import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../styles/variables"
import Loading from "../assets/loading.svg"

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Button = styled.button`
  align-items: center;
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.gray.threeHundred};
  border-radius: ${props => props.borderradius ? props.borderradius : "0"};
  border: ${props => props.border ? props.border : "none"};
  box-shadow: ${props => props.boxshadow ? props.boxshadow : `0 0 0 1px ${props.backgroundcolor}`};
  color: ${props => props.color || colors.gray.nineHundred};
  display: inline-flex;
  font-size: ${props => props.fontsize || "1rem"};
  font-family: "Spectral", Georgia, serif;
  height: ${props => props.height};
  justify-content: center;
  padding: ${props => props.padding || "0.5rem 1rem"};
  margin: ${props => props.margin || "0"};
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
  width: ${props => props.width || "auto"};
  &.has-icon {
    span + span {
      margin-left: 0.35rem;
    }
  }
  &.is-loading {
    svg {
      animation: ${rotate} 0.5s linear infinite;
      fill: ${props => props.color || colors.gray.nineHundred};
      stroke: ${props => props.color || colors.gray.nineHundred};
    }
  }
  &:hover {
    cursor: pointer;
  }
  &:focus {
    box-shadow: 0 0 0 1px ${colors.gray.nineHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
    outline: none;
  }
  &[disabled] {
    opacity: 0.6;
    &:hover {
      cursor: auto;
    }
  }
`

export default Button
