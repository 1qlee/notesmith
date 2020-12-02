import styled from "styled-components"
import { colors } from "../styles/variables"

const Button = styled.button`
  align-items: center;
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.borderRadius ? props.borderRadius : "0.25rem"};
  border: ${props => props.border ? props.border : "none"};
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  color: ${props => props.color || colors.gray.nineHundred};
  display: inline-flex;
  justify-content: center;
  padding: 0.5rem;
  line-height: 1;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
  width: ${props => props.width};
  .icon {
    stroke: ${props => props.color};
  }
  &.is-medium {
    padding: 1rem;
  }
  &:hover {
    cursor: pointer;
  }
  &:focus {
    box-shadow: 0 0 0 2px ${colors.gray.nineHundred}, inset 0 0 0 2px ${colors.white};
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
