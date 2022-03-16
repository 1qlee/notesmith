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
  border-radius: 0.25rem;
  border: 1px solid ${props => props.bordercolor || colors.gray.threeHundred};
  color: ${props => props.color};
  display: flex;
  justify-content: space-between;
  transition: background-color 0.2s, color 0.2s;
  padding: ${props => props.padding};
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

function Notification({ children, ...p }) {
  return (
    <StyledNotification {...p}>
      {children}
    </StyledNotification>
  )
}

export default Notification
