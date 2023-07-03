import React from "react"
import styled, { keyframes } from "styled-components"
import { colors, fonts } from "../../styles/variables"

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
  align-items: ${props => props.alignitems || "flex-start"};
  animation: ${slideInDown} 0.2s ease-out;
  background-color: ${props => props.backgroundcolor};
  border: ${props => props.border};
  border-radius: ${props => props.borderradius || "0"};
  color: ${props => props.color};
  display: ${props => props.display || "flex"};
  justify-content: ${props => props.justifycontent || "space-between"};
  margin: ${props => props.margin || "1rem 0"};
  padding: ${props => props.padding || "16px"};
  transition: background-color 0.2s, color 0.2s;
  max-width: ${props => props.maxwidth};
  z-index: 8000;
  &.is-submitting {
    background: radial-gradient(circle, #ffd08f 0%, rgba(253,180,78,1) 80%);
    animation: ${loading} 1s infinite;
  }
  &.has-no-style {
    border: none;
    box-shadow: none;
  }
  p {
    color: ${props => props.color};
    font-size: ${props => props.fontsize || "0.75rem"};
    margin-bottom: 0;
    line-height: 1.5;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
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
