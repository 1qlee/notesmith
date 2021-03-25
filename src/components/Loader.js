import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../styles/variables"

import Logo from "./Logo"

const loading = keyframes`
  20%,
  100% {
    transform: translate(0, 2px); /* stay on the baseline for most of the animation duration */
  }
  0% {
    transform: translate(0, 0px); /* hop up */
    opacity: 0;
  }
  10% {
    transform: translate(0, 2px); /* return to baseline */
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

const moving = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
`

const LoaderWrapper = styled.div`
  background-color: ${colors.paper.cream};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .letter-logo {
    animation-name: ${loading};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    will-change: transform;
  }
  #letter-n {
    animation-delay: 0.1s;
  }
  #letter-o {
    animation-delay: 0.3s;
  }
  #letter-t {
    animation-delay: 0.35s;
  }
  #letter-e {
    animation-delay: 0.4s;
  }
  #letter-s {
    animation-delay: 0.45s;
  }
  #letter-m {
    animation-delay: 0.5s;
  }
  #letter-i {
    animation-delay: 0.55s;
  }
  #letter-t2 {
    animation-delay: 0.6s;
  }
  #letter-h {
    animation-delay: 0.65s;
  }
  &.has-nav {
    height: calc(100vh - 96px);
    width: 100%;
    top: -48px;
    left: -48px;
  }
`

const StyledLoader = styled.div`
  animation-name: ${moving};
  animation-duration: 1s;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
  background-color: ${colors.paper.cream};
  margin: 0 auto;
  text-align: center;
  height: 100%;
  width: 100%;
  border-radius: 100%;
  top: 0;
  left: 0;
  position: absolute;
  will-change: transform;
`

function Loader({ className }) {
  return (
    <LoaderWrapper className={className}>
      <div style={{position: 'relative'}}>
        <div style={{position: 'relative'}}>
          <Logo color={colors.gray.nineHundred} height="152" width="352" />
        </div>
        <StyledLoader />
      </div>
    </LoaderWrapper>
  )
}

export default Loader
