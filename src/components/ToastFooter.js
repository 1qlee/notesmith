import React, { useState } from "react"
import styled from "styled-components"

import { colors } from "../styles/variables"
import SignupForm from "./SignupForm"

const StyledToastFooter = styled.footer`
  background: ${colors.white};
  bottom: 2rem;
  color: ${colors.primary.sixHundred};
  padding: 1rem;
  position: absolute;
  text-align: center;
  text-decoration: underline;
  transition: background 0.2s ease-out;
  background: ${props => props.formHidden ? colors.white : colors.primary.sixHundred};
  width: 100%;
  &:hover {
    cursor: pointer;
  }
`

function ToastFooter() {
  const [formHidden, setFormHidden] = useState(true)

  return (
    <>
      <StyledToastFooter onClick={() => setFormHidden(!formHidden)} formHidden={formHidden}>
        <p>Click here to access the sign-up form!</p>
      </StyledToastFooter>
      <SignupForm formHidden={formHidden} setFormHidden={setFormHidden} />
    </>
  )
}

export default ToastFooter
