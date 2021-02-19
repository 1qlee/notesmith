import styled from "styled-components"
import { colors } from "../styles/variables"

const Button = styled.button`
  align-items: center;
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.borderRadius ? props.borderRadius : "0.25rem"};
  border: ${props => props.border ? props.border : "none"};
  box-shadow: ${props => props.boxShadow ? props.boxShadow : `0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float}`};
  color: ${props => props.color || colors.gray.nineHundred};
  display: inline-flex;
  justify-content: center;
  letter-spacing: 1px;
  padding: ${props => props.padding || "0.5rem"};
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
  width: ${props => props.width};
  &.has-icon {
    span + span {
      margin-left: 0.35rem;
    }
  }
  &:hover {
    cursor: pointer;
  }
  &[disabled] {
    opacity: 0.6;
    &:hover {
      cursor: auto;
    }
  }
`

export default Button
