import React, { useState } from "react"
import styled from "styled-components"
import { navigate, Link } from "gatsby"
import { setUser, isLoggedIn } from "../../utils/auth"
import firebase from "gatsby-plugin-firebase"
import { colors, regex } from "../../styles/variables"

import { StyledFieldset, StyledLabel, StyledInput } from "../form/FormComponents"
import Button from "../Button"
import Content from "../Content"
import Icon from "../Icon"
import SEO from "../layout/Seo"

const SignupFormWrapper = styled.div`
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  padding: 2rem;
  width: 100%;
`

const SignupForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showLogin, setShowLogin] = useState(true)
  const [emailError, setEmailError] = useState({
    msg: "",
    color: colors.red.sixHundred
  })
  const [passwordError, setPasswordError] = useState({
    msg: "",
    color: colors.gray.sevenHundred
  })
  const [passwordValidated, setPasswordValidated] = useState()
  const auth = firebase.auth()

  function handleSubmit(e) {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      navigate("/")
    })
    .catch(error => {
      if (error.code == 'auth/email-already-in-use') {
        setEmailError({
          msg: "This email is already in use.",
          color: colors.red.sixHundred
        })
      }
    })
  }

  function validateEmail(email) {
    if (regex.email.test(email) || email.length === 0) {
      setEmailError({
        msg: "",
        color: colors.gray.sevenHundred
      })
      setEmail(email)
    }
    else {
      setEmailError({
        msg: "Invalid format",
        color: colors.red.sixHundred
      })
    }
  }

  function validatePassword(password) {
    let additionalCharsReq = 8 - password.length

    if (regex.password.test(password)) {
      setPasswordError({
        msg: "",
        color: colors.gray.sevenHundred
      })
      setPasswordValidated(true)
      setPassword(password)
    }
    else {
      if (password.length > 0) {
        setPasswordError({
          msg: additionalCharsReq === 1 ? `You need ${additionalCharsReq} more character.` : `You need ${additionalCharsReq} more characters.`,
          color: colors.gray.sevenHundred
        })
      }
      else if (password.length === 0) {
        setPasswordError({
          msg: "",
          color: colors.gray.sevenHundred
        })
      }
      setPasswordValidated(false)
    }
  }

  function validatePasswordOnBlur(password) {
    let currentNumOfChars = password.length

    if (currentNumOfChars !== 0 && currentNumOfChars < 8) {
      setPasswordValidated(false)
      return setPasswordError({
        msg: "Password must be at least 8 characters.",
        color: colors.red.sixHundred
      })
    }
  }

  return (
    <>
      <SignupFormWrapper>
        <SEO title="Sign Up" />
        <Content>
          <h4>Create your Notesmith account</h4>
        </Content>
        <form
          id="signup-form"
          onSubmit={e => handleSubmit(e)}
        >
          <StyledFieldset className="is-vertical">
            <StyledLabel>Email</StyledLabel>
            <StyledInput
              onChange={(e) => validateEmail(e.currentTarget.value)}
              className={emailError.msg && "is-error"}
              borderRadius="0.25rem"
              id="email"
              type="email"
              name="email"
              autocomplete="email"
            />
            {emailError.msg && (
              <small style={{position: 'absolute', top: 'calc(100% + 2px)', color: emailError.color}}>{emailError.msg}</small>
            )}
          </StyledFieldset>
          <StyledFieldset className="is-vertical has-space-bottom">
            <StyledLabel>Password</StyledLabel>
            <StyledInput
              onFocus={(e) => validatePassword(e.currentTarget.value)}
              onChange={(e) => validatePassword(e.currentTarget.value)}
              onBlur={(e) => validatePasswordOnBlur(e.currentTarget.value)}
              className={passwordError.msg && "is-error"}
              borderRadius="0.25rem"
              id="password"
              type="password"
              name="password"
              autocomplete="new-password"
            />
            {passwordValidated && (
              <div style={{position: `absolute`, right: `1rem`, bottom: `0`}}>
                <Icon
                  icon="ShieldCheck"
                  weight="regular"
                  size="1.5rem"
                  color={colors.green.sixHundred}
                />
              </div>
            )}
            {passwordError.msg && (
              <small style={{position: 'absolute', top: 'calc(100% + 2px)', color: passwordError.color}}>{passwordError.msg}</small>
            )}
          </StyledFieldset>
          <StyledFieldset>
            <Button
              color={colors.white}
              background={colors.primary.sixHundred}
              borderRadius="0.25rem"
              disabled={passwordValidated && email.length > 0 ? false : true}
              type="submit"
              form="signup-form"
              width="100%"
              >
              Create account
            </Button>
          </StyledFieldset>
        </form>
      </SignupFormWrapper>
    </>
  )
}

export default SignupForm
