import styled from "styled-components"
import { colors } from "../styles/variables"

const Content = styled.div`
  padding: ${props => props.colored ? "2rem" : "0"};
  border-radius: ${props => props.colored ? "1rem" : "0"};
  display: block;
  margin: 0;
  text-align: ${props => props.textAlign};
  h1,h2,h3,h4,h5,h6 {
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    margin-bottom: 2rem;
    font-family: "Spectral", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-weight: 700;
    text-rendering: optimizeLegibility;
    line-height: 1.2;
    text-align: ${props => props.textAlignCenter ? props.textAlignCenter : "left"};
  }
  h1 {
    font-size: 3rem;
    color: ${props => props.h1Color || colors.primary.sevenHundred};
  }
  h2 {
    font-size: 2rem;
    color: ${props => props.h2Color || colors.primary.sevenHundred};
  }
  h3 {
    font-size: 1.5rem;
    color: ${props => props.h3Color || colors.primary.sevenHundred};
  }
  h4 {
    font-size: 1rem;
    color: ${props => props.h4Color || colors.primary.sevenHundred};
    font-weight: ${props => props.h4FontWeight || "700"};
    &.is-column-heading {
      margin-bottom: 0.5rem;
      position: relative;
      &::after {
        background-color: ${colors.link.normal};
        content: "";
        height: 1rem;
        left: -1rem;
        position: absolute;
        border-radius: 50% 1rem 100% 1rem;
        bottom: -0.25rem;
        opacity: 0.1;
        width: 100%;
      }
      &.green {
        &::after {
          background-color: ${colors.green.sixHundred};
        }
      }
      &.red {
        &::after {
          background-color: ${colors.red.sixHundred};
        }
      }
      &.blue {
        &::after {
          background-color: ${colors.blue.sixHundred};
        }
      }
      &.purple {
        &::after {
          background-color: ${colors.purple.sixHundred};
        }
      }
    }
  }
  p {
    color: ${props => props.paragraphColor || colors.gray.sevenHundred};
    line-height: 1.5;
    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
  small {
    color: ${props => props.smallColor || colors.gray.sevenHundred};
    display: block;
    margin: 0.5rem 0;
  }
  a {
    color: ${props => props.linkColor || colors.link.normal};
    &:hover {
      cursor: pointer;
      color: ${colors.black};
    }
  }
`

export default Content
