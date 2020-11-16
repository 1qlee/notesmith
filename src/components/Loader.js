import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../styles/variables"

const loading = keyframes`
  0% {
    background-color: ${colors.white};
  }
  100% {
    background-color: ${colors.primary.sixHundred};
  }
`

const LoaderWrapper = styled.div`
  background-color: ${colors.primary.sixHundred};
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100%;
`

const StyledLoader = styled.div`
  animation: ${loading} 1s forwards infinite;
  background-color: ${colors.white};
  color: ${colors.primary.sixHundred};
  border-radius: 100%;
  padding: 1rem;
  margin: 0 auto;
  text-align: center;
  font-size: 2rem;
`

function Loader() {
  return (
    <LoaderWrapper>
      <StyledLoader>N</StyledLoader>
    </LoaderWrapper>
  )
}

export default Loader
