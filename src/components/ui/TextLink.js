import styled from "styled-components"
import { colors } from "../../styles/variables"

const TextLink = styled.a`
  align-items: ${props => props.alignitems};
  border-bottom: ${props => props.borderbottom};
  color: ${props => props.color || colors.gray.nineHundred};
  display: ${props => props.flex || "inline-flex"};
  font-family: ${props => props.fontfamily || "Inter, Helvetica, Tahoma, sans-serif"};
  font-size: ${props => props.fontsize || "0.825rem"};
  font-weight: ${props => props.fontweight};
  justify-content: ${props => props.justifycontent};
  line-height: 1;
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: relative;
  transition: background-size 0.2s;
  width: ${props => props.width};
  text-transform: ${props => props.texttransform};
  z-index: 5;
  &:hover {
    color: ${props => props.hovercolor};
    &::before {
      transform-origin: left;
      transform: scaleX(1);
    }
  }
  &::before {
    background-color: ${props => props.underlinecolor || colors.gray.nineHundred};
    content: "";
    height: 1px;
    left: 0;
    position: absolute;
    bottom: -4px;
    transition: transform 0.4s;
    transform: scaleX(0);
    transform-origin: right;
    width: 100%;
  }
  &.has-icon {
    span + span {
      margin-left: 0.25rem;
    }
  }
`

export default TextLink
