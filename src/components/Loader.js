import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../styles/variables"

import Logo from "./Logo"

const loading = keyframes`
  0% {
    transform: translateX(-100%) skew(-45deg);
  }
  25% {
    transform: translateX(100%) skew(-45deg);
  }
  100% {
    transform: translateX(100%) skew(-45deg);
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
`

const StyledLoader = styled.div`
  animation-name: ${loading};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  background-color: ${colors.paper.cream};
  margin: 0 auto;
  text-align: center;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
`

function Loader() {
  return (
    <LoaderWrapper>
      <div style={{position: 'relative'}}>
        <div style={{position: 'relative'}}>
          <Logo color={colors.primary.sixHundred} height="64" width="320" />
        </div>
        <StyledLoader />
      </div>
    </LoaderWrapper>
  )
}

export default Loader
