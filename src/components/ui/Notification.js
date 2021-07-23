import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../../styles/variables"

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
  border-left: 5px solid ${props => props.bordercolor};
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  color: ${props => props.color};
  display: inline-flex;
  justify-content: space-between;
  padding: 1rem;
  transition: background-color 0.2s, color 0.2s;
  margin: ${props => props.margin || "1rem 0"};
  z-index: 8000;
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
    <StyledNotification
      margin={props.margin}
      color={props.color}
      backgroundcolor={props.backgroundcolor}
      className={props.className}
      bordercolor={props.bordercolor}
    >
      {props.children}
    </StyledNotification>
  )
}

export default Notification
