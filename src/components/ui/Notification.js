import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../../styles/variables"
import { Flexbox } from "../layout/Flexbox"

const slideInDown = keyframes`
  from {
    transform: translate3d(0, -10%, 0);
    opacity: 0;
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`

const pulsate = pulseColor => keyframes`
  0% {
    box-shadow: 0 0 12px 0 ${pulseColor};
  }
  50% {
    box-shadow: 0 0 12px 24px rgba(0, 0, 0, 0);
  }
  100% {
		box-shadow: 0 0 12px 6px rgba(0, 0, 0, 0);
  }
`

const loading = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 400px 0;
  }
`

const StyledNotification = styled(Flexbox)`
  animation: ${slideInDown} 0.2s ease-out;
  background-color: ${props => props.backgroundcolor || colors.white};
  border: ${props => props.border};
  border-radius: ${props => props.borderradius || "0"};
  box-shadow: ${props => props.boxshadow || "0 0 0 0"};
  color: ${props => props.color};
  transition: background-color 0.2s, color 0.2s;
  max-width: ${props => props.maxwidth};
  text-align: ${props => props.textalign || "left"};
  z-index: ${props => props.zindex || "1"};
  &.is-submitting {
    background: radial-gradient(circle, #ffd08f 0%, rgba(253,180,78,1) 80%);
    animation: ${loading} 1s infinite;
  }
  &.has-no-style {
    border: none;
    box-shadow: none;
  }
  &.is-pulsating {
    animation: ${props => pulsate(props.backgroundcolor)} 2s linear infinite;
  }
`

function Notification({ children, ...p }) {
  return (
    <StyledNotification {...p}>
      {children}
    </StyledNotification>
  )
}

export default Notification
