import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { Minus, Plus } from "phosphor-react"

import Icon from "../Icon"

function QuantityTracker(props) {
  const { setItemQuantity, initialQuantity } = props
  const [quantity, setQuantity] = useState(initialQuantity || 1)

  const handleButtonChange = (e, up) => {
    e.preventDefault()

    if (up) {
      setQuantity(quantity => parseInt(quantity + 1))
      setItemQuantity(parseInt(quantity + 1))
    }
    else {
      setQuantity(quantity => parseInt(quantity - 1))
      setItemQuantity(parseInt(quantity - 1))
    }
  }

  const handleBlur = e => {
    const { value } = e.target

    if (!value || value == 0) {
      setQuantity(1)
      setItemQuantity(1)
    }
  }

  const handleChange = e => {
    const { value } = e.target

    if (!value || value < 1) {
      setQuantity('')
    }
    else {
      setQuantity(parseInt(value))
      setItemQuantity(parseInt(e.target.value))
    }
  }

  return (
    <QuantityWrapper
      padding={props.wrapperpadding}
      boxshadow={props.wrapperboxshadow}
    >
      <QuantityButton
        width={props.buttonwidth}
        height={props.buttonheight}
        onClick={e => handleButtonChange(e)}
        disabled={quantity === 1}
      >
        <Icon style={{width:"100%", height: "100%"}}>
          <Minus
            size={props.iconsize}
            color={quantity === 1 ? colors.gray.fiveHundred : colors.black}
            weight="bold"
          />
        </Icon>
      </QuantityButton>
      <Counter
        border="none"
        padding={props.counterpadding}
        fontsize={props.counterfontsize}
        margin="0 0.25rem"
        min="1"
        onChange={e => handleChange(e)}
        onBlur={e => handleBlur(e)}
        type="number"
        value={quantity}
        width={props.counterwidth}
      />
      <QuantityButton
        width={props.buttonwidth}
        height={props.buttonheight}
        onClick={e => handleButtonChange(e, true)}
      >
        <Icon>
          <Plus
            size={props.iconsize}
            color={colors.black}
            weight="bold"
          />
        </Icon>
      </QuantityButton>
    </QuantityWrapper>
  )
}

const QuantityWrapper = styled.div`
  background-color: ${colors.white};
  box-shadow: ${props => props.boxshadow || "0 0 0 1px ${colors.gray.threeHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white}"};
  border-radius: 0.25rem;
  padding: ${props => props.padding || "0.75rem"};
  display: inline-flex;
  align-items: center;
`

const QuantityButton = styled.button`
  background-color: ${colors.white};
  border: none;
  padding: 0;
  width: ${props => props.width};
  height: ${props => props.height};
  &:hover {
    cursor: pointer;
  }
`

const Counter = styled.input`
  background-color: ${colors.white};
  border-radius: ${props => props.borderradius ? props.borderradius : 0};
  border: ${props => props.border};
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: ${props => props.fontsize};
  padding: ${props => props.padding};
  margin: ${props => props.margin};
  width: ${props => props.width};
  text-align: center;
  vertical-align: top;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`

const AuthFormWrapper = styled.div`
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  padding: 2rem;
  width: 100%;
`

const StyledFieldset = styled.fieldset`
  border: none;
  display: flex;
  flex-direction: ${props => props.flexdirection};
  justify-content: ${props => props.justifycontent};
  align-items: ${props => props.alignitems};
  margin: ${props => props.margin};
  position: relative;
  width: ${props => props.width};
  &.is-flex {
    fieldset {
      flex: 1;
      & + fieldset {
        margin-left: 1rem;
      }
    }
  }
  &.is-horizontal {
    div {
      flex: 1;
      &:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
  &.is-vertical {
    flex-direction: column;
    align-items: flex-start;
    label {
      margin-right: 0;
    }
  }
  &.has-buttons {
    button {
      &:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
`

const StyledRange = styled.div`
  width: ${props => props.width};
  margin: ${props => props.margin};
  input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    &:active {
      &::-webkit-slider-thumb {
        box-shadow: 0 1px 0px ${colors.shadow.float};
      }
    }
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: ${colors.white};
    border-radius: 100%;
    border: 2px solid ${colors.primary.sixHundred};
    box-shadow: 0 1px 2px ${colors.shadow.float};
    cursor: pointer;
    height: 1.25rem;
    margin-top: -0.375rem;
    transition: box-shadow 0.2s;
    width: 1.25rem;
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 0.5rem;
    cursor: pointer;
    background: ${colors.primary.oneHundred};
  }
`

const StyledRadio = styled.div`
  flex: 1;
  &:not(:last-child) {
    margin-right: 1rem;
  }
  label {
    box-shadow: inset 0 1px 1px ${colors.shadow.inset}, inset 0 0 1px ${colors.shadow.inset};
    border: 1px solid ${colors.gray.threeHundred};
    box-sizing: border-box;
    display: block;
    height: 100%;
    width: 100%;
    cursor: pointer;
    transition: border-color .2s;
    &:hover,
    &:focus,
    &:active {
      border-color: ${colors.gray.sixHundred};
      .radio-header {
        border-color: ${colors.gray.sixHundred};
      }
    }
    .radio-header {
      border-bottom: 1px solid ${colors.gray.threeHundred};
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1rem;
      font-weight: 400;
      transition: border-color .2s;
    }
    .radio-content {
      padding: 0.5rem;
    }
  }
  input[type="radio"] {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input[type="radio"]:active ~ label {
    opacity: 1;
  }

  input[type="radio"]:checked ~ label {
    border: 1px solid ${colors.link.normal};
    .radio-header {
      background-color:  ${colors.primary.oneHundred};
      color: ${colors.link.normal};
      border-color: ${colors.link.normal};
    }
  }
`

const RadioInput = styled.div`
  display: block;
  border: none;
  margin: ${props => props.margin};
  label {
    box-sizing: border-box;
    border: none;
    display: inline-flex;
    align-items: center;
    height: 100%;
    width: 100%;
    cursor: pointer;
    transition: border-color .2s;
    &:hover,
    &:focus,
    &:active {
      border-color: ${colors.gray.sixHundred};
    }
  }
  svg {
    filter: drop-shadow(0px 0px 1px ${colors.primary.twoHundred});
  }
  input[type="radio"] {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input[type="radio"]:active ~ label {
    opacity: 1;
  }

  input[type="radio"]:checked ~ label {
    border: none;
  }
`

const StyledLabel = styled.label`
  color: ${colors.primary.fourHundred};
  display: block;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: ${props => props.fontsize ? props.fontsize : "0.7rem"};
  font-weight: 700;
  margin: ${props => props.margin || "0 0 0.5rem 0"};
`

const StyledFloatingLabel = styled(StyledLabel)`
  position: absolute;
  left: 1rem;
  top: 0.5rem;
`

const StyledInput = styled.input`
  background-color: ${colors.white};
  box-shadow: ${colors.shadow.layeredSmall};
  border-radius: ${props => props.borderradius ? props.borderradius : "0.25rem"};
  border: 1px solid ${colors.primary.sixHundred};
  color: ${colors.gray.nineHundred};
  display: block;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: ${props => props.fontsize ? props.fontsize : "0.8rem"};
  margin: ${props => props.margin ? props.margin : "0"};
  padding: ${props => props.padding ? props.padding : "1rem"};
  text-align: ${props => props.textalign};
  transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s, border-color 0.2s;
  width: ${props => props.width ? props.width : "100%"};
  &.is-error {
    border-color: ${colors.red.sixHundred};
  }
  &.has-width-auto {
    width: auto;
  }
  &:focus {
    border-color: ${colors.primary.nineHundred};
    box-shadow: 0 0 0 ${colors.primary.oneHundred};
    transform: translate(1px, 1px);
    outline: none;
  }
  &:hover {
    &:not(:focus) {
      background-color: ${colors.primary.hover};
    }
  }
  &::placeholder {
    color: ${colors.gray.fiveHundred};
    opacity: 1;
  }
`

const SelectWrapper = styled.div`
  position: relative;
  width: ${props => props.width ? props.width : "100%"};
`

const SelectIcon = styled.span`
  position: absolute;
  top: ${props => props.top ? props.top : "2.5rem"};
  right: ${props => props.right ? props.right : "1rem"};
`

const StyledSelect = styled.select`
  background-color: ${colors.white};
  box-shadow: ${colors.shadow.layeredSmall};
  border-radius: ${props => props.borderradius ? props.borderradius : "0.25rem"};
  border: none;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: ${props => props.fontsize || "0.8rem"};
  padding: ${props => props.padding || "1rem"};
  height: ${props => props.height};
  width: ${props => props.width};
  appearance: none;
  &.is-error {
    box-shadow: 0 0 0 2px ${colors.red.sixHundred}, inset 0 0 0 1px ${colors.paper.offWhite};
  }
  &:hover {
    cursor: pointer;
  }
  &:active,
  &:focus {
    box-shadow: 0 0 0 2px ${colors.blue.sixHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
    outline: none;
  }
`

const ErrorLine = styled.div`
  position: relative;
  margin-top: 0.5rem;
  margin: ${props => props.margin};
  color: ${props => props.color};
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  span + span {
    margin-left: 0.25rem;
  }
`

export {
  QuantityTracker,
  QuantityWrapper,
  QuantityButton,
  Counter,
  AuthFormWrapper,
  SelectWrapper,
  StyledFieldset,
  StyledRadio,
  StyledRange,
  StyledSelect,
  SelectIcon,
  StyledFloatingLabel,
  StyledLabel,
  StyledInput,
  RadioInput,
  ErrorLine
}
