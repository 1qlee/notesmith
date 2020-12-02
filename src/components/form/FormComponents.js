import styled from "styled-components"
import { colors, regex } from "../../styles/variables"

const AuthFormWrapper = styled.div`
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  padding: 2rem;
  width: 100%;
`

const StyledFieldset = styled.fieldset`
  border: none;
  display: flex;
  position: relative;
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
  &.is-vertical {
    flex-direction: column;
  }
  &.has-space-bottom {
    margin-bottom: 3rem;
  }
`

const StyledLabel = styled.label`
  margin-bottom: 0.5rem;
  color: ${colors.gray.nineHundred};
  font-size: 0.8rem;
`

const StyledFloatingLabel = styled.label`
  color: ${colors.primary.sevenHundred};
  font-size: 1rem;
  left: 1rem;
  font-weight: 400;
  opacity: ${props => props.inputFocused ? "0" : "1"};
  padding: 0 0.2rem;
  position: absolute;
  line-height: 1;
  top: 1rem;
  transform: translateX(${props => props.inputFocused ? "100px" : "0"});
  transition: background 0.2s, transform 0.2s, opacity 0.2s;
  z-index: 2;
  &:hover {
    cursor: text;
  }
  &:focus {
    box-shadow: 0 0 0 2px ${colors.gray.nineHundred}, inset 0 0 0 2px ${colors.white};
    outline: none;
  }
`

const StyledInput = styled.input`
  background: ${colors.paper.cream};
  box-shadow: inset 0 1px 3px ${colors.shadow.inset}, inset 0 0 1px ${colors.shadow.inset};
  border-radius: ${props => props.borderRadius ? props.borderRadius : 0};
  border: none;
  display: block;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  transition: background 0.2s, box-shadow 0.2s;
  width: 100%;
  &.is-error {
    box-shadow: 0 0 0 2px ${colors.red.sixHundred}, inset 0 0 0 1px ${colors.paper.cream};
  }
  &.has-width-auto {
    width: auto;
  }
  &:focus {
    box-shadow: 0 0 0 2px ${colors.gray.nineHundred}, inset 0 0 0 2px ${colors.white};
    outline: none;
  }
`

const ErrorLine = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  color: ${props => props.color};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  span + span {
    margin-left: 0.25rem;
  }
`

export {
  AuthFormWrapper,
  StyledFieldset,
  StyledFloatingLabel,
  StyledLabel,
  StyledInput,
  ErrorLine
}
