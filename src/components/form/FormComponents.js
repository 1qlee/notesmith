import React, { useState, useRef } from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"
import { Minus, Plus, CaretUp, CaretDown } from "phosphor-react"

import Icon from "../Icon"

function QuantityTracker(props) {
  const { setItemQuantity, initialQuantity } = props
  const [quantity, setQuantity] = useState(initialQuantity || 1)

  const handleButtonChange = (e, up) => {
    e.preventDefault()

    if (up) {
      if (props.item) {
        setQuantity(quantity => parseInt(quantity + 1))
        setItemQuantity(props.item.id, parseInt(quantity + 1))
      }
      else {
        setQuantity(quantity => parseInt(quantity + 1))
        setItemQuantity(parseInt(quantity + 1))
      }
    }
    else {
      if (props.item) {
        setQuantity(quantity => parseInt(quantity - 1))
        setItemQuantity(props.item.id, parseInt(quantity - 1))
      }
      else {
        setQuantity(quantity => parseInt(quantity - 1))
        setItemQuantity(parseInt(quantity - 1))
      }
    }
  }

  const handleBlur = e => {
    const { value } = e.target

    if (!value || value == 0) {
      if (props.item) {
        setQuantity(1)
        setItemQuantity(props.item.id, 1)
      }
      else {
        setQuantity(1)
        setItemQuantity(1)
      }
    }
  }

  const handleChange = e => {
    const { value } = e.target

    if (!value || value < 1) {
      setQuantity('')
    }
    else {
      if (props.item) {
        setQuantity(parseInt(value))
        setItemQuantity(props.item.id, parseInt(e.target.value))
      }
      else {
        setQuantity(parseInt(value))
        setItemQuantity(parseInt(e.target.value))
      }
    }
  }

  return (
    <QuantityWrapper
      padding={props.wrapperpadding}
      boxshadow={props.wrapperboxshadow}
      width={props.wrapperwidth}
    >
      <QuantityButton
        disabled={quantity === 1}
        height={props.buttonheight}
        left={true}
        onClick={e => handleButtonChange(e)}
        padding={props.counterpadding}
        width={props.buttonwidth}
      >
        <Icon style={{width:"100%", height: "100%"}}>
          <Minus
            size={props.iconsize}
            color={quantity === 1 ? colors.gray.nineHundred : colors.gray.nineHundred}
            weight="bold"
          />
        </Icon>
      </QuantityButton>
      <Counter
        border="none"
        padding={props.counterpadding}
        fontsize={props.counterfontsize}
        id={props.id}
        margin="0 0.25rem"
        min="1"
        onChange={e => handleChange(e)}
        onBlur={e => handleBlur(e)}
        type="number"
        value={quantity}
        width={props.counterwidth}
      />
      <QuantityButton
        height={props.buttonheight}
        onClick={e => handleButtonChange(e, true)}
        padding={props.counterpadding}
        right={true}
        width={props.buttonwidth}
      >
        <Icon>
          <Plus
            size={props.iconsize}
            color={colors.gray.nineHundred}
            weight="bold"
          />
        </Icon>
      </QuantityButton>
    </QuantityWrapper>
  )
}

function NumberInput({
  min,
  max,
  data,
  onChange,
  step,
  currentValue,
  padding,
  width,
}) {
  const [number, setNumber] = useState(0)
  const numberInput = useRef(null)

  function validateInput(value) {
    const floatValue = parseFloat(value)
    const maxValue = parseFloat(max)
    const minValue = parseFloat(min)

    if (!value || isNaN(floatValue)) {
      console.log("invalid")
      numberInput.current.value = currentValue
      return
    }
    else if (floatValue < min) {
      console.log("low:", value)
      onChange({
        ...data,
        test: min,
      })
      numberInput.current.value = min
    }
    else if (floatValue > max) {
      console.log("high:", floatValue)
      onChange({
        ...data,
        test: max,
      })
      numberInput.current.value = max
    }
    else {
      console.log("success")
      onChange({
        ...data,
        test: floatValue,
      })
      numberInput.current.value = floatValue
    }
  }

  function validateClick(direction) {
    if (direction === "up") {
      validateInput(currentValue + 1)
    }
    else {
      validateInput(currentValue - 1)
    }
  }

  function handleKeyDown(e) {
    const keyCode = e.keyCode
    const value = e.target.value

    if (keyCode === 13 || keyCode === 27) {
      e.target.blur()
      validateInput(value)
    }
  }

  return (
    <NumberInputWrapper
      width={width}
    >
      <StyledInput
        ref={numberInput}
        type="text"
        padding={padding}
        width={width}
        onKeyDown={e => handleKeyDown(e)}
        onBlur={e => validateInput(e.target.value)}
      />
      <NumberInputIcon
        right="0"
        top="0"
        width="1rem"
        onClick={() => validateClick("up")}
      >
        <CaretUp color={colors.gray.oneHundred} fill="bold" size="0.75rem" />
      </NumberInputIcon>
      <NumberInputIcon
        right="0"
        bottom="0"
        width="1rem"
        onClick={() => validateClick("down")}
      >
        <CaretDown color={colors.gray.oneHundred} fill="bold" size="0.75rem" />
      </NumberInputIcon>
    </NumberInputWrapper>
  )
}

const NumberInputWrapper = styled.div`
  position: relative;
  width: ${props => props.width};
`

const NumberInputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${props => props.height || "1rem"};
  background-color: ${colors.gray.nineHundred};
  left: ${props => props.left};
  position: absolute;
  right: ${props => props.right};
  bottom: ${props => props.bottom};
  top: ${props => props.top};
  width: ${props => props.width};
  user-select: none;
  &:hover {
    cursor: pointer;
    background-color: ${colors.gray.eightHundred};
  }
`

const QuantityWrapper = styled.div`
  position: relative;
  width: ${props => props.width};
`

const QuantityButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
  width: ${props => props.width};
  height: ${props => props.height};
  position: absolute;
  top: ${props => props.padding};
  left: ${props => props.left ? "0.75rem" : null};
  right: ${props => props.right ? "0.75rem" : null};
  z-index: 99;
  &:hover {
    cursor: pointer;
  }
`

const Counter = styled.input`
  background-color: ${colors.white};
  border: 1px solid ${colors.gray.nineHundred};
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: ${props => props.fontsize};
  padding: ${props => props.padding || "1rem"};
  text-align: center;
  vertical-align: top;
  width: ${props => props.width};
  -moz-appearance: textfield;
  transition: border-color 0.2s, box-shadow 0.2s;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &:focus {
    border-color: ${colors.gray.nineHundred};
    outline: none;
  }
  &:hover {
    &:not(:focus) {
      background-color: ${colors.gray.oneHundred};
    }
  }
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
    background: ${colors.gray.threeHundred};
    height: 0.5rem;
    &:hover,
    &:focus {
      &::-webkit-slider-thumb {
        background-color: ${colors.gray.twoHundred};
      }
    }
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: ${colors.gray.oneHundred};
    border: 2px solid ${colors.gray.nineHundred};
    box-shadow: ${colors.shadow.layeredSmall};
    border-radius: 100%;
    cursor: pointer;
    height: 1.25rem;
    margin-top: -0.375rem;
    transition: box-shadow 0.2s, border-color 0.2s, background-color 0.2s;
    width: 1.25rem;
  }
  input[type=range]::-webkit-slider-runnable-track {
    background: transparent;
    border-radius: 0.25rem;
    -webkit-appearance: none;
    cursor: pointer;
    height: 0.5rem;
    width: 100%;
  }
`

const StyledCheckbox = styled.div`
  align-items: center;
  display: flex;
  flex: ${props => props.flex || "1"};
  margin: ${props => props.margin};
  padding: ${props => props.padding || "0.25rem 0.5rem"};
  transition: background-color 0.2s;
  justify-content: center;
  span {
    font-family: ${fonts.secondary};
    font-size: ${props => props.fontsize || "0.75rem"}
  }
  &:hover {
    background-color: ${colors.gray.oneHundred};
    cursor: pointer;
  }
`

const StyledRadio = styled.div`
  flex: 1;
  &:not(:last-child) {
    margin-right: 1rem;
  }
  label {
    box-shadow: inset 0 1px 1px ${colors.shadow.inset}, inset 0 0 1px ${colors.shadow.inset};
    border: 1px solid ${colors.gray.nineHundred};
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
      border-bottom: 1px solid ${colors.gray.nineHundred};
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
      background-color:  ${colors.gray.oneHundred};
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
  color: ${props => props.color || colors.gray.nineHundred};
  display: block;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: ${props => props.fontsize ? props.fontsize : "0.75rem"};
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
  border-radius: ${props => props.borderradius ? props.borderradius : "0"};
  border: 1px solid ${props => props.bordercolor || colors.gray.nineHundred};
  color: ${colors.gray.nineHundred};
  display: block;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: ${props => props.fontsize ? props.fontsize : "0.8rem"};
  margin: ${props => props.margin ? props.margin : "0"};
  padding: ${props => props.padding ? props.padding : "1rem"};
  text-align: ${props => props.textalign};
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s;
  width: ${props => props.width ? props.width : "100%"};
  &.is-error {
    border-color: ${colors.red.sixHundred};
  }
  &.has-width-auto {
    width: auto;
  }
  &:focus {
    border-color: ${colors.gray.sixHundred};
    outline: none;
  }
  &:hover {
    &:not(:focus) {
      background-color: ${colors.gray.twoHundred};
    }
  }
  &::placeholder {
    color: ${colors.gray.threeHundred};
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
  border-radius: ${props => props.borderradius ? props.borderradius : "0"};
  border: 1px solid ${colors.gray.nineHundred};
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: ${props => props.fontsize || "0.8rem"};
  padding: ${props => props.padding || "1rem 4rem 1rem 1rem"};
  height: ${props => props.height};
  width: ${props => props.width};
  appearance: none;
  &.is-error {
    border-color: ${colors.red.sixHundred};
  }
  &:hover {
    cursor: pointer;
    background-color: ${colors.gray.oneHundred};
  }
  &:active,
  &:focus {
    border-color: ${colors.gray.nineHundred};
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

const StyledTable = styled.table`
  th, td {
    padding: 1rem;
  }
  th {
    font-family: ${fonts.secondary};
    font-size: 0.825rem;
    font-weight: 700;
  }
  tr {
    &.is-selected {
      background-color: ${colors.gray.oneHundred};
    }
  }
`

export {
  AuthFormWrapper,
  Counter,
  ErrorLine,
  NumberInput,
  QuantityButton,
  QuantityTracker,
  QuantityWrapper,
  RadioInput,
  SelectIcon,
  SelectWrapper,
  StyledCheckbox,
  StyledFieldset,
  StyledFloatingLabel,
  StyledInput,
  StyledLabel,
  StyledRadio,
  StyledRange,
  StyledSelect,
  StyledTable,
}
