import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../styles/variables"

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledIcon = styled.span`
  align-items: center;
  display: inline-flex;
  justify-content: center;
  position: relative;
  margin: ${props => props.margin};
  &.is-loading {
    svg {
      animation: ${rotate} 0.5s linear infinite;
      fill: ${props => props.color || colors.gray.nineHundred};
      stroke: ${props => props.color || colors.gray.nineHundred};
    }
  }
`

function Icon({ children, ...p }) {
  return (
    <StyledIcon {...p}>
      {children}
    </StyledIcon>
  )
}

export default Icon
