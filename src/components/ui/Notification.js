import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../../styles/variables"

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
  align-items: center;
  animation: ${fadeIn} 0.2s linear;
  background-color: ${props => props.backgroundColor};
  border-radius: 0.25rem;
  border: 2px solid ${props => props.color};
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  color: ${props => props.color};
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  transition: background-color 0.2s, color 0.2s;
  margin: 1rem 0;
  span {
    margin-right: 1rem;
  }
  button, a {
    margin-left: 1rem;
  }
  &.is-submitting {
    background: radial-gradient(circle, #ffd08f 0%, rgba(253,180,78,1) 80%);
    animation: ${loading} 1s infinite;
  }
  p {
    color: ${props => props.color};
  }
`

function Notification(props) {
  return (
    <StyledNotification color={props.color} backgroundColor={props.backgroundColor} className={props.className} borderColor={props.borderColor}>
      {props.children}
    </StyledNotification>
  )
}

export default Notification
