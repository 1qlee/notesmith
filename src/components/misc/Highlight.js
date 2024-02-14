import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledHighlight = styled.span`
  position: relative;
  z-index: 1;
  &::before {
    content: "";
    position: absolute;
    top: -16px;
    left: -32px;
    width: 100%;
    height: calc(100% + 32px);
    background-image: linear-gradient(75deg, transparent 0%, ${props => props.color} 10%, ${props => props.color} 50%, transparent 100%);
    transform: skew(15deg);
    z-index: -1;
  }
`

function Highlight({ color, children }) {
  return (
    <StyledHighlight
      color={color}
    >
      {children}
    </StyledHighlight>
  )
}

export default Highlight