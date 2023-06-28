import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"

const TextLink = styled.a`
  align-items: ${props => props.alignitems};
  background-color: transparent;
  border: none;
  border-bottom: ${props => props.borderbottom};
  color: ${props => props.color || colors.gray.nineHundred};
  display: ${props => props.flex || "inline-flex"};
  font-size: ${props => props.fontsize || "1rem"};
  font-weight: ${props => props.fontweight || "700"};
  justify-content: ${props => props.justifycontent};
  line-height: 1;
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: relative;
  transition: color 0.2s, background-size 0.2s;
  width: ${props => props.width};
  text-transform: ${props => props.texttransform};
  text-decoration: underline;
  z-index: 5;
  &:hover {
    color: ${props => props.hovercolor || colors.gray.oneHundred};
    cursor: pointer;
    &::before {
      transform-origin: left;
      transform: scaleX(1);
    }
    &.has-icon {
      &::before {
        width: calc(100% - 12px);
      }
    }
  }
  &::before {
    background-color: ${props => props.underlinecolor || colors.gray.nineHundred};
    content: "";
    height: calc(100% + 8px);
    left: -4px;
    position: absolute;
    bottom: -4px;
    transition: transform 0.4s;
    transform: scaleX(0);
    transform-origin: right;
    width: calc(100% + 8px);
    z-index: -1;
  }
  &.has-icon {
    span + span {
      margin-left: 0.25rem;
    }
  }
`

export default TextLink
