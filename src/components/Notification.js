import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../styles/variables"

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
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

const StyledNotification = styled.div`
  animation: ${fadeIn} 0.2s linear;
  background-color: ${props => props.background};
  border: 3px solid ${props => props.borderColor};
  box-shadow: 0 2px 2px ${colors.shadow.float}, 0 0 2px ${colors.shadow.float};
  color: ${props => props.color};
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  transition: background-color 0.2s, color 0.2s;
  &.is-submitting {
    background: radial-gradient(circle, #ffd08f 0%, rgba(253,180,78,1) 80%);
    animation: ${loading} 1s infinite;
  }
  p {
    line-height: 1.25;
    color: ${props => props.color};
    margin: 0;
  }
`

function Notification(props) {
  return (
    <StyledNotification color={props.color} background={props.background} className={props.className} borderColor={props.borderColor}>
      {props.children}
    </StyledNotification>
  )
}

export default Notification
