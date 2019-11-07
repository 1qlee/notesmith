import React, { useState } from "react"
import styled from "styled-components"

import colors from "../styles/colors"

const StyledSignupForm = styled.form`
  animation: slideIn 0.2s linear;
  background: ${colors.white};
  bottom: 0;
  display: ${props => props.formHidden ? "none" : "block"};
  position: absolute;
  transition: bottom 0.2s ease-in;
  width: 100%;
  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(100%);
    }
    50% {
      opacity: 0;
      transform: translateY(50%);
    }
    100% {
      opacity: 1;
      transform: translateY(5px);
    }
  }
`

const StyledFieldSet = styled.div`
  border: none;
  display: flex;
  padding: 1rem;
  position: relative;
`

const StyledLabel = styled.label`
  left: 1.3rem;
  position: absolute;
  top: 2rem;
  transform: translateY(${props => props.inputFocused ? "-1.8rem" : "0"});
  background: ${props => props.inputFocused ? colors.white : "transparent"};
  color: ${props => props.inputFocused ? colors.primary.normal : "#444"};
  padding: 0 0.2rem;
  transition: background 0.2s, transform 0.2s;
  z-index: 2;
  &:hover {
    cursor: text;
  }
`

const StyledInput = styled.input`
  background: ${props => props.inputFocused ? colors.white : colors.gray.threeHundred};
  border-radius: 0.25rem 0 0 0.25rem;
  border: none;
  display: block;
  padding: 0.5rem;
  transition: background 0.2s;
  width: 100%;
  z-index: 1;
  border: 1px solid transparent;
  border-color: ${props => props.inputFocused ? colors.primary.normal : "transparent"};
  outline-color: ${colors.primary.normal};
`

const CloseButton = styled.div`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: -28px;
  background: ${colors.white};
  padding: 0.25rem;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  &::before {
    content: "";
    background: ${colors.gray.eightHundred};
    position: absolute;
    right: 11px;
    top: 6px;
    width: 2px;
    height: 12px;
    transform: rotate(45deg);
  }
  &::after {
    content: "";
    background: ${colors.gray.eightHundred};
    position: absolute;
    right: 11px;
    top: 6px;
    width: 2px;
    height: 12px;
    transform: rotate(-45deg);
  }
`

const StyledButton = styled.button`
  background: #444;
  border-radius: 0 0.25rem 0.25rem 0;
  border: none;
  color: ${colors.white};
  padding: 1rem;
  &:hover {
    cursor: pointer;
  }
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
    <StyledSignupForm id="signup" formHidden={props.formHidden} name="signup" method="POST" data-netlify="true" autocomplete="off">
      <CloseButton onClick={() => props.setFormHidden(true)}/>
      <StyledFieldSet>
        <StyledLabel onClick={() => setInputFocused(true)} inputFocused={inputFocused} htmlFor="email">Enter your email address</StyledLabel>
        <StyledInput
          onFocus={() => setInputFocused(true)}
          onBlur={(e) => handleBlur(e)}
          inputFocused={inputFocused}
          id="email"
          type="email" name="email"
        />
        <StyledButton type="submit" form="signup">Subscribe</StyledButton>
      </StyledFieldSet>
    </StyledSignupForm>
  )
}

export default SignupForm
