import React, { useState } from "react"
import { colors } from "../../styles/variables"
import { navigate, Link } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { Warning } from "phosphor-react"

import { AuthFormWrapper, StyledFieldset, StyledLabel, StyledInput, ErrorLine } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"
import Button from "../Button"
import Icon from "../Icon"
import SEO from "../layout/Seo"

const LoginForm = (props) => {
  const { login, user } = useFirebaseContext()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [authError, setAuthError] = useState({
    msg: "",
    color: colors.red.sixHundred,
    link: false
  })

  function handleSubmit(e) {
    e.preventDefault()
    // Log in using Firebase auth function
    login(email, password)
    .then(() => {
      // Redirect user to the dashboard app page
      navigate("/app/dashboard")
    })
    .catch(error => {
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
            msg: "Something went wrong.",
            color: colors.red.sixHundred,
            link: false
          })
      }
    })
  }

  return (
    <AuthFormWrapper>
      <SEO title="Log In" />
      <Content>
        <h4>Log into your account</h4>
      </Content>
      <form id="login-form" onSubmit={handleSubmit} style={{maxWidth:"500px"}}>
        <StyledFieldset
          className="is-vertical"
          margin="1rem 0"
        >
          <StyledLabel htmlFor="email">Email</StyledLabel>
          <StyledInput
            onChange={(e) => setEmail(e.currentTarget.value)}
            onFocus={() => setAuthError({
              msg: ""
            })}
            borderRadius="0.25rem"
            id="email"
            type="email"
            name="email"
            padding="0.75rem"
          />
        </StyledFieldset>
        <StyledFieldset
          className="is-vertical"
          margin="1rem 0 2rem"
        >
          <StyledLabel htmlFor="password">
            <Flexbox
              flex="flex"
              alignitems="center"
              justifycontent="space-between"
              width="100%"
            >
              Password
              <Content>
                <Link to="/forgot">Forgot your password?</Link>
              </Content>
            </Flexbox>
          </StyledLabel>
          <StyledInput
            onChange={(e) => setPassword(e.currentTarget.value)}
            onFocus={() => setAuthError({
              msg: ""
            })}
            borderRadius="0.25rem"
            id="password"
            type="password"
            name="password"
            padding="0.75rem"
          />
          {authError.msg && (
            <ErrorLine color={authError.color}>
              <Icon>
                <Warning weight="fill" color={authError.color} size={18} />
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
            color={colors.white}
            backgroundcolor={colors.primary.sixHundred}
            borderRadius="0.25rem"
            type="submit"
            form="login-form"
            width="100%"
            padding="1rem"
          >
            Log In
          </Button>
        </StyledFieldset>
      </form>
    </AuthFormWrapper>
  )
}

export default LoginForm
