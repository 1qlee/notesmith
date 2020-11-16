import React, { useState } from "react"
import styled from "styled-components"
import Button from "../Button"
import { colors } from "../../styles/variables"

import { StyledFieldset, StyledFloatingLabel, StyledInput } from "./FormComponents"

const StyledSignupForm = styled.form`
  display: ${props => props.formHidden ? "none" : "block"};
`

function SignupForm(props) {
  const [inputFocused, setInputFocused] = useState(false)

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
    <StyledSignupForm id="signup" name="signup" method="POST" data-netlify="true" autocomplete="off" action="/">
      <StyledFieldset>
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
          onBlur={(e) => handleBlur(e)}
          inputFocused={inputFocused}
          borderRadius="0.25rem 0 0 0.25rem"
          id="email"
          type="email" name="email"
        />
        <Button
          color={colors.white}
          background={colors.primary.sixHundred}
          borderRadius="0 0.25rem 0.25rem 0"
          type="submit" form="signup"
          >
          Sign Up
        </Button>
      </StyledFieldset>
    </StyledSignupForm>
  )
}

export default SignupForm
