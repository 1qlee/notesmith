import styled from "styled-components"
import { colors } from "../styles/variables"

const Button = styled.button`
  align-items: center;
  background-color: ${props => props.background};
  border-radius: ${props => props.borderRadius ? props.borderRadius : "0.25rem"};
  border: ${props => props.border ? props.border : "none"};
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  color: ${props => props.color};
  display: inline-flex;
  justify-content: center;
  font-size: 1rem;
  padding: 1rem;
  line-height: 1;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
  width: ${props => props.width};
  .icon {
    stroke: ${props => props.color};
  }
  &.is-small {
    padding: 0.5rem;
  }
  &:hover {
    cursor: pointer;
  }
  &:focus {
    box-shadow: 0 0 0 2px #4d90fe,inset 0 0 0 2px hsla(0,0%,100%,0.9);
  }
  &[disabled] {
    opacity: 0.6;
    &:hover {
      cursor: auto;
    }
  }
`

export default Button
