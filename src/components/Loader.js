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
    transform: translateX(0) skew(-25deg,0);
  }
  50% {
    transform: translateX(100%) skew(-25deg,0);
  }
  100% {
    transform: translateX(0) skew(-25deg,0);
  }
`

const LoaderWrapper = styled.div`
  background-color: ${colors.paper.offWhite};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  flex-direction: column;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  z-index: 999;
  &.has-nav {
    height: calc(100vh - 96px);
    width: calc(100% - 4px);
    top: 0;
    left: 4px;
  }
  .letter-logo {
    animation-name: ${loading};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    will-change: transform;
  }
  #letter-n {
    animation-delay: 0.1s;
  }
  #letter-o {
    animation-delay: 0.2s;
  }
  #letter-t {
    animation-delay: 0.25s;
  }
  #letter-e {
    animation-delay: 0.3s;
  }
  #letter-s {
    animation-delay: 0.35s;
  }
  #letter-m {
    animation-delay: 0.4s;
  }
  #letter-i {
    animation-delay: 0.45s;
  }
  #letter-t2 {
    animation-delay: 0.5s;
  }
  #letter-h {
    animation-delay: 0.55s;
  }
`

const StyledLoader = styled.div`
  animation-name: ${moving};
  animation-duration: 2s;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
  animation-direction: reverse;
  background-color: ${colors.paper.offWhite};
  margin: 0 auto;
  text-align: center;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  will-change: transform;
`

function Loader({ className, msg }) {
  return (
    <LoaderWrapper className={className}>
      <div style={{position: 'relative', marginTop: '-48px', marginLeft: '-50px'}}>
        <div style={{position: 'relative'}}>
          <Logo color={colors.gray.nineHundred} height="152" width="352" />
        </div>
        <StyledLoader />
      </div>
      <p>{msg}</p>
    </LoaderWrapper>
  )
}

export default Loader
