import React from "react"
import styled, { keyframes } from "styled-components"
import Circle from "../../assets/handwriting-circle.svg"

const draw = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`

const CircleWrapper = styled.div`
  display: inline-block;
  position: relative;
  svg {
    position: absolute;
    left: -15px;
    top: 0;
    width: calc(100%  + 30px);
    height: calc(100% + 12px);
    .path-1,
    .path-2 {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
    }
    .path-1 {
      animation: ${draw} 3s linear forwards;
    }
    .path-2 {
      animation: ${draw} 3s linear 390ms forwards;
    }
  }
`

function CircledText({ text }) {
  return (
    <CircleWrapper>
      <Circle />
      <span>{text}</span>
    </CircleWrapper>
  )
}

export default CircledText
