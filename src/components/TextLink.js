import styled from "styled-components"
import { colors } from "../styles/variables"

const TextLink = styled.a`
  align-items: ${props => props.alignitems};
  border-bottom: ${props => props.borderbottom};
  color: ${props => props.color || colors.gray.sixHundred};
  display: ${props => props.flex || "flex"};
  justify-content: ${props => props.justifycontent};
  font-size: ${props => props.fontsize || "0.825rem"};
  font-family: ${props => props.fontfamily || "Inter, Helvetica, Tahoma, sans-serif"};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: relative;
  width: ${props => props.width};
  background:  no-repeat 0 100%;
  background-image: linear-gradient(${colors.yellow.threeHundred}, ${colors.yellow.oneHundred});
  background-size: 0% 40%;
  transition: background-size 0.2s;
  z-index: 5;
  &:hover {
    color: ${props => props.hovercolor || colors.gray.nineHundred};
    background-size: 100% 40%;
    &::before {
      width: 100%;
    }
  }
  &.has-icon {
    span + span {
      margin-left: 0.25rem;
    }
  }
`

export default TextLink
