import styled from "styled-components"
import { colors } from "../styles/variables"

const TextLink = styled.a`
  align-items: ${props => props.alignitems};
  border-bottom: ${props => props.borderbottom};
  color: ${props => props.color || colors.gray.nineHundred};
  display: ${props => props.flex || "flex"};
  font-family: ${props => props.fontfamily || "Inter, Helvetica, Tahoma, sans-serif"};
  font-size: ${props => props.fontsize || "0.825rem"};
  justify-content: ${props => props.justifycontent};
  line-height: 1;
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: relative;
  transition: background-size 0.2s;
  width: ${props => props.width};
  z-index: 5;
  &:hover {
    color: ${props => props.hovercolor};
    &::before {
      width: 100%;
    }
  }
  &::before {
    background-color: ${colors.gray.nineHundred};
    content: "";
    height: 1px;
    left: 0;
    position: absolute;
    bottom: -4px;
    transition: width 0.2s;
    width: 0;
  }
  &.has-icon {
    span + span {
      margin-left: 0.25rem;
    }
  }
`

export default TextLink
