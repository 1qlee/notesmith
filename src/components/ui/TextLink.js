import styled from "styled-components"
import { colors } from "../../styles/variables"

const TextLink = styled.a`
  align-items: ${props => props.align};
  background-color: transparent;
  border: none;
  box-shadow: 0 -1px 0 0 ${props => props.underlinecolor || colors.gray.nineHundred} inset;
  color: ${props => props.color || colors.gray.nineHundred};
  display: ${props => props.flex || "inline-flex"};
  font-size: ${props => props.fontsize || "1rem"};
  font-weight: ${props => props.fontweight || "500"};
  justify-content: ${props => props.justify};
  line-height: 1;
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: relative;
  transition: color 0.2s, background-size 0.2s;
  width: ${props => props.width};
  text-transform: ${props => props.texttransform};
  z-index: 5;
  &:hover {
    box-shadow: 0 -2px 0 0 ${props => props.underlinecolor || colors.gray.nineHundred} inset;
    cursor: pointer;
    // &::before {
    //   transform-origin: left;
    //   transform: scaleX(1);
    // }
    // &.has-icon {
    //   &::before {
    //     width: calc(100% - 12px);
    //   }
    // }
  }
  // &::before {
  //   background-color: ${props => props.underlinecolor || colors.gray.nineHundred};
  //   content: "";
  //   height: calc(100% + 8px);
  //   left: -4px;
  //   position: absolute;
  //   bottom: -4px;
  //   transition: transform 0.4s;
  //   transform: scaleX(0);
  //   transform-origin: right;
  //   width: calc(100% + 8px);
  //   z-index: -1;
  // }
  &.has-icon {
    span + span {
      margin-left: 0.25rem;
    }
  }
`

export default TextLink
