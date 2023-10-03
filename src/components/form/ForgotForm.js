import React, { useState } from "react"
import { colors } from "../../styles/variables"
import { Link } from "gatsby"
import { WarningCircle, CircleNotch } from "@phosphor-icons/react"

import { AuthFormWrapper, StyledFieldset, StyledLabel, StyledInput, ErrorLine } from "./FormComponents"
import Content from "../ui/Content"
import Button from "../ui/Button"
import Icon from "../ui/Icon"
import Seo from "../layout/Seo"

const ForgotForm = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState()
  const [emailSent, setEmailSent] = useState(false)
  const [authError, setAuthError] = useState("")

  async function handleSubmit(e) {
    if (e) {
      e.preventDefault()
    }
    setLoading(true)
    
    await fetch("/.netlify/functions/send-password-reset", {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        userEmail: email,
        redirectUrl: "https://notesmithbooks.com",
      })
    }).then(async res => {
      const data = await res.json()

      if (data.error) {
        throw data.error
      }
      else {
        setEmailSent(true)
      }

      setLoading(false)
    }).catch(error => {
      setAuthError(error)
      setEmailSent(false)
      setLoading(false)
    })
  }

  return (
    <AuthFormWrapper>
      <Seo title="Sign In" />
      {emailSent ? (
        <Content
          h1fontsize="2rem"
          linktextdecoration="underline"
        >
          {loading ? (
            <>
              <h1>Resending...</h1>
              <p>Do not refresh this page!</p>
            </>
          ) : (
            <>
              <h1>Email was successfully sent</h1>
              <p>If you haven't received an email in 5 minutes, you may <a onClick={() => handleSubmit()}>resend it</a>. Remember to check your spam folder!</p>
            </>
          )} 
        </Content>
      ) : (
        <>
          <Content
            h1fontsize="2rem"
            margin="0 0 32px"
          >
            <h1>Forgot your password?</h1>
            <p>Enter the email address for your account and, if the email exists in our records, we'll send you a link to reset your password.</p>
          </Content >
          <form
            id="forgot-form"
            onSubmit={e => handleSubmit(e)}
          >
            <StyledFieldset
              className="is-vertical"
              margin="16px 0 32px"
            >
              <StyledLabel htmlFor="email">Email</StyledLabel>
              <StyledInput
                onChange={(e) => setEmail(e.currentTarget.value)}
                onFocus={() => setAuthError("")}
                id="email"
                type="email"
                name="email"
              />
              {authError && (
                <ErrorLine color={colors.red.sixHundred}>
                  <Icon>
                    <WarningCircle weight="fill" color={colors.red.sixHundred} size={18} />
                  </Icon>
                  <span>{authError}</span>
                </ErrorLine>
              )}
            </StyledFieldset>
            <StyledFieldset>
              <Button
                color={colors.gray.oneHundred}
                backgroundcolor={colors.gray.nineHundred}
                className={loading && "is-loading"}
                disabled={loading && true}
                type="submit"
                form="forgot-form"
                width="100%"
                padding="1rem"
              >
                {loading ? (
                  <Icon>
                    <CircleNotch size="1rem" />
                  </Icon>
                ) : (
                  <span>Continue</span>
                )}
              </Button>
            </StyledFieldset>
          </form>
          <Content
            paragraphtextalign="center"
            linktextdecoration="underline"
            margin="16px 0 0"
          >
            <p>
              <Link to="/signin">Return to sign in</Link>
            </p>
          </Content>
        </>
      )}
    </AuthFormWrapper>
  )
}

export default ForgotForm
