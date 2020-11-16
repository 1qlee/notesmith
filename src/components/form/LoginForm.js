import React, { useState } from "react"
import styled from "styled-components"
import { navigate, Link } from "gatsby"
import { setUser, isLoggedIn } from "../../utils/auth"
import firebase from "gatsby-plugin-firebase"
import { colors } from "../../styles/variables"

import { StyledFieldset, StyledLabel, StyledInput } from "../form/FormComponents"
import Content from "../Content"
import Button from "../Button"
import SEO from "../layout/Seo"

const LoginFormWrapper = styled.div`
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  padding: 2rem;
  width: 100%;
`

const LoginForm = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [showLogin, setShowLogin] = useState(true)
  const auth = firebase.auth()

  function handleSubmit() {
    auth.doSignInWithEmailAndPassword(email, password)
    .then(() => {
      navigate()
    })
    .catch(error => {
      setEmail("error")
      setPassword("error")
    })
  }

  return (
    <LoginFormWrapper>
      <SEO title="Log In" />
      <Content>
        <h3>Log into your account</h3>
      </Content>
      <form id="login-form" onSubmit={handleSubmit} style={{maxWidth:"500px"}}>
        <StyledFieldset className="is-vertical">
          <StyledLabel>Email</StyledLabel>
          <StyledInput
            onChange={(e) => setEmail(e.currentTarget.value)}
            borderRadius="0.25rem"
            id="email"
            type="email"
            name="email"
          />
        </StyledFieldset>
        <StyledFieldset className="is-vertical">
          <StyledLabel>Password</StyledLabel>
          <StyledInput
            onChange={(e) => setPassword(e.currentTarget.value)}
            borderRadius="0.25rem"
            id="password"
            type="password"
            name="password"
          />
        </StyledFieldset>
        <StyledFieldset>
          <Content>
            <Link to="/forgot">Forgot your password?</Link>
          </Content>
        </StyledFieldset>
        <StyledFieldset>
          <Button
            color={colors.white}
            background={colors.primary.sixHundred}
            borderRadius="0.25rem"
            type="submit"
            form="login-form"
            width="100%"
            >
            Log In
          </Button>
        </StyledFieldset>
      </form>
    </LoginFormWrapper>
  )
}

export default LoginForm
