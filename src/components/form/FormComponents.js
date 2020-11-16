import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledFieldset = styled.fieldset`
  border: none;
  display: flex;
  position: relative;
  &.is-vertical {
    flex-direction: column;
  }
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
`

const StyledLabel = styled.label`
  margin-bottom: 0.5rem;
  color: ${colors.gray.nineHundred};
`

const StyledFloatingLabel = styled.label`
  color: ${colors.gray.nineHundred};
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
  &:focus {
    box-shadow: 0 0 0 2px ${colors.blue.sixHundred}, inset 0 0 0 1px ${colors.paper.cream};
  }
  &.is-error {
    box-shadow: 0 0 0 2px ${colors.red.sixHundred}, inset 0 0 0 1px ${colors.paper.cream};
  }
`

export { StyledFieldset, StyledFloatingLabel, StyledLabel, StyledInput }
