import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../../styles/variables"

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const pulsate = pulseColor => keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 ${pulseColor};
  }
  50% {
    transform: scale(1);
    box-shadow: 0 0 0 5px rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
`

const StyledIcon = styled.span`
  align-items: center;
  background-color: ${props => props.backgroundcolor};
  border-radius: ${props => props.borderradius || "0.25rem 0 0 0.25rem"};
  padding: ${props => props.padding};
  display: inline-flex;
  justify-content: center;
  position: relative;
  margin: ${props => props.margin};
  height: ${props => props.height};
  width: ${props => props.width};
  &.is-help {
    &:hover {
      cursor: help;
    }
  }
  &.is-loading {
    svg {
      animation: ${rotate} 0.5s linear infinite;
      fill: ${props => props.color || colors.gray.nineHundred};
      stroke: ${props => props.color || colors.gray.nineHundred};
    }
  }
  &.is-pulsating {
    svg {
      transform: scale(1);
      animation: ${props => pulsate(props.pulseColor)} 2s linear infinite;
      border-radius: 100%;
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
