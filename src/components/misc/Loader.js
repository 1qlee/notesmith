import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../../styles/variables"

import Logo from "../../assets/logo-animated.svg"

// const loading = keyframes`
//   20%,
//   100% {
//     transform: translate(0, 2px); /* stay on the baseline for most of the animation duration */
//   }
//   0% {
//     transform: translate(0, 0px); /* hop up */
//     opacity: 0;
//   }
//   10% {
//     transform: translate(0, 2px); /* return to baseline */
//   }
//   20% {
//     opacity: 1;
//   }
//   100% {
//     opacity: 0;
//   }
// `

const strokeOffset = keyframes`
  0% {
    stroke-dashoffset: 1000;
  }
  50% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0;
  }
`

const LoaderWrapper = styled.div`
  background-color: ${colors.white};
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
    height: calc(100vh - 70px);
    width: calc(100% + 4px);
    top: 70px;
    left: 0;
  }
  .mask {
    fill: none;
    stroke: #fff;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: ${strokeOffset} 2.5s cubic-bezier(0.95, 0.05, 0.55, 0.95) infinite;
  }
  #mask-N {
    animation-delay: 0.1s;
  }
  #mask-o {
    animation-delay: 0.2s;
  }
  #mask-t1 {
    animation-delay: 0.35s;
  }
  #mask-e {
    animation-delay: 0.5s;
  }
  #mask-s {
    animation-delay: 0.65s;
  }
  #mask-m {
    animation-delay: 0.8s;
  }
  #mask-i {
    animation-delay: 0.95s;
  }
  #mask-t2 {
    animation-delay: 1.1s;
  }
  #mask-h {
    animation-delay: 1.25s;
  }
`

// const StyledLoader = styled.div`
//   animation-name: ${moving};
//   animation-duration: 2s;
//   animation-timing-function: ease-in;
//   animation-iteration-count: infinite;
//   animation-direction: reverse;
//   background-color: ${colors.white};
//   margin: 0 auto;
//   text-align: center;
//   height: 100%;
//   width: calc(100% + 100px);
//   top: 0;
//   left: 0;
//   position: absolute;
//   will-change: transform;
// `

// const moving = keyframes`
//   0% {
//     transform: translateX(0) skew(-25deg,0);
//   }
//   50% {
//     transform: translateX(100%) skew(-25deg,0);
//   }
//   100% {
//     transform: translateX(0) skew(-25deg,0);
//   }
// `

function Loader({ className, msg }) {
  return (
    <LoaderWrapper className={className}>
      <Logo height="96" width="300" />
      <p>{msg}</p>
    </LoaderWrapper>
  )
}

export default Loader
