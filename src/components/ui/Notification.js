import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../../styles/variables"

const slideInDown = keyframes`
  from {
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0);
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
  animation: ${slideInDown} 0.2s ease-out;
  background-color: ${props => props.backgroundcolor};
  border-radius: 0.25rem;
  border: 2px solid ${props => props.color};
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  color: ${props => props.color};
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  transition: background-color 0.2s, color 0.2s;
  margin: 1rem 0;
  z-index: 8000;
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
    <StyledNotification color={props.color} backgroundcolor={props.backgroundcolor} className={props.className} bordercolor={props.bordercolor}>
      {props.children}
    </StyledNotification>
  )
}

export default Notification
