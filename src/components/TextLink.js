import styled from "styled-components"
import { colors } from "../styles/variables"

const TextLink = styled.a`
  align-items: ${props => props.alignitems};
  border-bottom: ${props => props.borderbottom};
  color: ${props => props.color};
  display: ${props => props.flex || "flex"};
  justify-content: ${props => props.justifycontent};
  font-size: ${props => props.fontsize || "0.825rem"};
  font-family: ${props => props.fontfamily || "Inter, Helvetica, Tahoma, sans-serif"};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: relative;
  transition: color 0.2s;
  width: ${props => props.width};
  &:hover {
    color: ${props => props.hovercolor};
    &::before {
      width: 100%;
    }
  }
  &.has-icon {
    span + span {
      margin-left: 0.25rem;
    }
  }
  &::before {
    content: "";
    position: absolute;
    left: 2px;
    bottom: -2px;
    width: 0;
    height: 4px;
    transform: skew(-24deg);
    transition: width 0.2s;
    background-image: linear-gradient(to right, ${colors.gray.threeHundred} 0%, ${colors.gray.nineHundred} 100%);
    opacity: 0.5;
    z-index: 8;
  }
`

export default TextLink
