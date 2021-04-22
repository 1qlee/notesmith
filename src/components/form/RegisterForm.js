import React, { useState } from "react"
import styled from "styled-components"
import Button from "../Button"
import { colors } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"

import { StyledFieldset, StyledFloatingLabel, StyledInput } from "./FormComponents"

const StyledRegisterForm = styled.form`
  display: ${props => props.formHidden ? "none" : "block"};
`

function RegisterForm(props) {
  const [email, setEmail] = useState("")
  const [inputFocused, setInputFocused] = useState(false)
  const { signUpWithEmail } = useFirebaseContext()
  const isBrowser = typeof window !== "undefined"
  // Settings for signing up a user with an email link
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://www.localhost:8000/signup',
    // This must be true.
    handleCodeInApp: true,
    dynamicLinkDomain: 'example.page.link'
  }

  function handleSignUp() {
    signUpWithEmail(email, actionCodeSettings).then(() => {
      isBrowser && window.location.setItem('emailForSignIn', email)
    }).catch(error => {
      console.log(error.code, error.msg)
    })
  }

  function handleBlur(e) {
    let inputValue = e.target.value

    if (inputValue.length > 0) {
      setInputFocused(true)
    }
    else {
      setInputFocused(false)
    }
  }

  return (
    <StyledRegisterForm id="signup" name="signup" method="POST" data-netlify="true" autocomplete="off" action="/">
      <StyledFieldset
        margin="2rem 0"
      >
        <input type="hidden" name="form-name" value="signup" />
        <StyledFloatingLabel
          onClick={() => setInputFocused(true)}
          inputFocused={inputFocused}
          htmlFor="email"
        >
          Enter your email address
        </StyledFloatingLabel>
        <StyledInput
          onFocus={() => setInputFocused(true)}
          onBlur={e => handleBlur(e)}
          onChange={e => setEmail(e.currentTarget.value)}
          inputFocused={inputFocused}
          id="email"
          type="email" name="email"
          placeholder="signmeup@gmail.com"
        />
        <Button
          color={colors.white}
          backgroundcolor={colors.primary.sixHundred}
          padding="1rem"
          type="submit" form="signup"
          className="is-medium"
        >
          Sign Up
        </Button>
      </StyledFieldset>
    </StyledRegisterForm>
  )
}

export default RegisterForm
