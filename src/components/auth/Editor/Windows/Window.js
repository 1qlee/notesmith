import React, { useEffect } from "react"
import styled from "styled-components"
import { colors, widths } from "../../../../styles/variables"

const StyledWindow = styled.div`
  background-color: ${colors.gray.eightHundredFifty};
  box-shadow: ${colors.shadow.modal};
  color: ${colors.white};
  position: absolute;
  left: 100%;
  top: 0%;
  width: 300px;
  z-index: 9001;
  padding: 1rem;
`

function Window({ children, setShowWindow}) {

  return (
    <StyledWindow>
      {children}
    </StyledWindow>
  )
}

export default Window
