import React from "react"
import styled, { keyframes } from "styled-components"
import Loader from "../components/Loader"
import TestLogo from "../assets/logo-animated.svg"
import "../components/layout/master.css"

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

const TestLogoWrapper = styled.div`
  width: 300px;
  position: relative;
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

const Test = () => {
  return (
    <TestLogoWrapper>
      <TestLogo width="300" height="96" />
    </TestLogoWrapper>
  )
}
export default Test
