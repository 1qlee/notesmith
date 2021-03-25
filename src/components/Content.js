import styled from "styled-components"
import { colors } from "../styles/variables"

const Content = styled.div`
  padding: ${props => props.colored ? "2rem" : "0"};
  border-radius: ${props => props.colored ? "1rem" : "0"};
  display: block;
  margin: ${props => props.margin};
  max-width: ${props => props.maxWidth};
  h1,h2,h3,h4,h5,h6 {
    margin: 0 0 0.5rem;
    font-weight: 700;
    text-rendering: optimizeLegibility;
    line-height: 1.2;
    text-align: ${props => props.headingTextAlign};
  }
  h1 {
    font-size: 4rem;
    color: ${props => props.h1Color || colors.primary.sevenHundred};
    font-weight: ${props => props.h1FontWeight || "700"};
  }
  h2 {
    font-size: 2rem;
    color: ${props => props.h2Color || colors.primary.sevenHundred};
    font-weight: ${props => props.h2FontWeight || "700"};
  }
  h3 {
    font-size: 1.5rem;
    color: ${props => props.h3Color || colors.primary.sevenHundred};
    font-weight: ${props => props.h3FontWeight || "700"};
  }
  h4 {
    font-size: 1rem;
    color: ${props => props.h4Color || colors.primary.sevenHundred};
    font-weight: ${props => props.h4FontWeight || "700"};
    &.is-column-heading {
      margin-bottom: 0.5rem;
      position: relative;
      &::after {
        background-color: ${props => props.headingColor || colors.primary.sixHundred};
        content: "";
        height: 1rem;
        left: -1rem;
        position: absolute;
        border-radius: 50% 1rem 100% 1rem;
        bottom: -0.25rem;
        opacity: 0.1;
        width: 100%;
      }
    }
  }
  ul {
    padding-left: 1.5rem;
    font-size: ${props => props.ulFontSize || "1rem"};
  }
  li {
    margin: 0.5rem 0;
  }
  p {
    color: ${props => props.paragraphColor || colors.gray.sevenHundred};
    font-size: ${props => props.paragraphFontSize || "1rem"};
    line-height: ${props => props.paragraphLineHeight || "1.5"};
    text-align: ${props => props.paragraphTextAlign};
    &:not(:last-child) {
      margin-bottom: ${props => props.paragraphMarginBottom || "1rem"};
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
