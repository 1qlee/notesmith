import React, { useState } from "react"
import { colors, fonts } from "../../styles/variables"
import { Link } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { WarningCircle, CircleNotch } from "@phosphor-icons/react"

import { AuthFormWrapper, StyledFieldset, StyledLabel, StyledInput, ErrorLine } from "./FormComponents"
import { Flexbox } from "../layout/Flexbox"
import Content from "../ui/Content"
import Button from "../ui/Button"
import Icon from "../ui/Icon"
import Seo from "../layout/Seo"

const SigninForm = () => {
  const { login } = useFirebaseContext()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [authError, setAuthError] = useState({
    msg: "",
    color: colors.red.sixHundred,
    link: false
  })

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    // Sign in using Firebase auth function
    login(email, password)
    .then(() => {
      setLoading(false)
    })
    .catch(error => {
      setLoading(false)
      // Handle various error codes from Firebase
      switch(error.code) {
        case "auth/user-disabled":
          setAuthError({
            msg: "This account has been disabled.",
            color: colors.red.sixHundred,
            link: false
          })
          break
        case "auth/invalid-email":
          setAuthError({
            msg: "Email was in an invalid format.",
            color: colors.red.sixHundred,
            link: false
          })
          break
        case "auth/user-not-found":
          setAuthError({
            msg: "No account found with this email.",
            color: colors.red.sixHundred,
            link: false
          })
          break
        case "auth/wrong-password":
          setAuthError({
            msg: "Incorrect email or password.",
            color: colors.red.sixHundred,
            link: false
          })
          break
        default:
          setAuthError({
            msg: "Something went wrong. Please try again.",
            color: colors.red.sixHundred,
            link: false
          })
      }
    })
  }

  return (
    <AuthFormWrapper>
      <Seo title="Sign In" />
      <Content
        h1fontsize="2rem"
        margin="0 0 32px"
      >
        <h1>Sign into your account</h1>
      </Content>
      <form 
        id="signin-form" 
        onSubmit={e => handleSubmit(e)} 
      >
        <StyledFieldset
          className="is-vertical"
          margin="16px 0"
        >
          <StyledLabel htmlFor="email">Email</StyledLabel>
          <StyledInput
            fontsize="1rem"
            onChange={(e) => setEmail(e.currentTarget.value)}
            onFocus={() => setAuthError({
              msg: ""
            })}
            id="email"
            type="email"
            name="email"
          />
        </StyledFieldset>
        <StyledFieldset
          className="is-vertical"
          margin="16px 0 32px"
        >
          <Flexbox
            flex="flex"
            align="center"
            justify="space-between"
            width="100%"
          >
            <StyledLabel htmlFor="password">Password</StyledLabel>
            <Content
              linktextdecoration="underline"
              margin="0 0 8px"
              linkfontsize="0.75rem"
              linkfontfamily={fonts.secondary}
            >
              <Link to="/forgot">Forgot your password?</Link>
            </Content>
          </Flexbox>
          <StyledInput
            fontsize="1rem"
            onChange={(e) => setPassword(e.currentTarget.value)}
            onFocus={() => setAuthError({
              msg: ""
            })}
            id="password"
            type="password"
            name="password"
          />
          {authError.msg && (
            <ErrorLine color={authError.color}>
              <Icon>
                <WarningCircle weight="fill" color={authError.color} size={18} />
              </Icon>
              <span>{authError.msg}</span>
              {authError.link && (
                <a style={{float: "right"}}>Resend email</a>
              )}
            </ErrorLine>
          )}
        </StyledFieldset>
        <StyledFieldset>
          <Button
            color={colors.gray.oneHundred}
            className={loading && "is-loading"}
            backgroundcolor={colors.gray.nineHundred}
            disabled={loading}
            type="submit"
            form="signin-form"
            width="100%"
            padding="1rem"
          >
            {loading ? (
              <Icon>
                <CircleNotch size="1rem" />
              </Icon>
            ) : (
              <span>
                Sign in
              </span>
            )}
          </Button>
        </StyledFieldset>
      </form>
      <Content
        paragraphtextalign="center"
        linktextdecoration="underline"
        margin="16px 0 0"
      >
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </Content>
    </AuthFormWrapper>
  )
}

export default SigninForm
