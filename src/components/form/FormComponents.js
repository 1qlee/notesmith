import React, { useEffect, useState, useRef, useCallback } from "react"
import styled from "styled-components"
import { colors, fonts, convertFloatFixed, widths } from "../../styles/variables"
import { Minus, Plus, CaretUp, CaretDown } from "phosphor-react"

import Icon from "../ui/Icon"

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

    if (!value || value === 0) {
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
  max,
  min,
  onChange,
  padding,
  step,
  value,
  width,
}) {
  const [startLongPress, setStartLongPress] = useState({
    start: false,
    direction: "",
  })
  const [inputValue, setInputValue] = useState(value || 1)
  const inputRef = useRef(null)

  useEffect(() => {
    let timerId

    if (startLongPress.start) {
      if (startLongPress.direction === "up") {
        timerId = setTimeout(() => {
          setInterval(validateClick("up"), 50)
        }, 150)
      }
      else {
        timerId = setTimeout(() => {
          setInterval(validateClick("down"), 50)
        }, 150)
      }
    }
    else {
      clearTimeout(timerId)
    }

    if (inputValue > value) {
      setInputValue(value)
    }
    if (value !== inputValue) {
      setInputValue(value)
    }

    return () => {
      clearTimeout(timerId)
    }
  }, [value, startLongPress])

  const start = useCallback((direction) => {
    setStartLongPress({ start: true, direction: direction });
  }, []);
  const stop = useCallback(() => {
    setStartLongPress({ start: false });
  }, []);

  function validateInput(newValue) {
    const floatValue = newValue || newValue === 0 ? convertFloatFixed(parseFloat(newValue), 3) : convertFloatFixed(parseFloat(inputValue), 3)
    const minValue = convertFloatFixed(parseFloat(min), 3)
    const maxValue = convertFloatFixed(parseFloat(max), 3)

    if (isNaN(floatValue)) {
      setInputValue(value)
      return
    }
    else if (floatValue < minValue) {
      setInputValue(minValue)
      onChange(minValue)
    }
    else if (floatValue > maxValue) {
      setInputValue(maxValue)
      onChange(maxValue)
    }
    else {
      setInputValue(floatValue)
      onChange(floatValue)
    }
  }

  // to increment or decrement the value by the step
  function validateClick(direction) {
    const floatStep = parseFloat(step)
    const floatValue = parseFloat(inputValue)

    if (direction === "up") {
      validateInput(floatValue + floatStep)
    }
    else {
      validateInput(floatValue - floatStep)
    }
  }

  function handleKeyDown(e) {
    const keyCode = e.keyCode

    // enter or ESC
    if (keyCode === 13 || keyCode === 27) {
      e.target.blur()
      validateInput()
    }
    // up arrow
    if (keyCode === 38) {
      validateClick("up")
    }
    // down arrow
    if (keyCode === 40) {
      validateClick("down")
    }
  }

  return (
    <NumberInputWrapper
      width={width}
    >
      <StyledInput
        onBlur={e => validateInput(inputValue)}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => handleKeyDown(e)}
        padding={padding}
        ref={inputRef}
        type="text"
        value={inputValue}
        width={width}
      />
      <NumberInputIcon
        pos="top"
        top="4px"
        width="16px"
        onClick={() => validateClick("up")}
        onMouseDown={() => start("up")}
        onMouseUp={() => stop()}
        onTouchStart={() => start("up")}
        onTouchEnd={() => stop()}
      >
        <CaretUp color={colors.gray.nineHundred} fill="bold" size="0.875rem" />
      </NumberInputIcon>
      <NumberInputIcon
        pos="bottom"
        bottom="4px"
        width="16px"
        onClick={() => validateClick("down")}
        onMouseDown={() => start("down")}
        onMouseUp={() => stop()}
        onTouchStart={() => start("down")}
        onTouchEnd={() => stop()}
      >
        <CaretDown color={colors.gray.nineHundred} fill="bold" size="0.875rem" />
      </NumberInputIcon>
    </NumberInputWrapper>
  )
}

function RangeInput({
  min,
  max,
  value,
  step,
  onChange,
  margin,
  width,
}) {
  const inputRef = useRef(null)
  
  useEffect(() => {
    const currentPercent = Math.abs((value - min) * 100 / (max - min)) + "% 100%"
    inputRef.current.style.backgroundSize = currentPercent
  }, [value, min, max, step, margin, width])

  return (
    <StyledRange
      margin={margin}
      width={width}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(e)}
        ref={inputRef}
      />
    </StyledRange>
  )
}

const NumberInputWrapper = styled.div`
  position: relative;
  width: ${props => props.width};
`

const NumberInputIcon = styled.div`
  align-items: center;
  bottom: ${props => props.bottom};
  border-radius: ${props => props.pos === "top" ? "0 0.25rem 0 0" : "0 0 0.25rem 0" };
  display: flex;
  justify-content: center;
  position: absolute;
  right: 4px;
  top: ${props => props.top};
  user-select: none;
  width: ${props => props.width};
  &:hover {
    cursor: pointer;
    background-color: ${colors.gray.oneHundred};
  }
`

const QuantityWrapper = styled.div`
  position: relative;
  display: inline-block;
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
  left: ${props => props.left ? "0.875rem" : null};
  right: ${props => props.right ? "0.875rem" : null};
  z-index: 99;
  &:hover {
    cursor: pointer;
  }
`

const Counter = styled.input`
  background-color: ${colors.white};
  border: 1px solid ${colors.gray.nineHundred};
  border-radius: 4px;
  font-family: ${fonts.secondary};
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
  border: ${colors.borders.black};
  border-top-width: 0;
  padding: 64px;
  margin: 0 auto;
  max-width: ${widths.form};
`

const StyledFieldset = styled.fieldset`
  border: none;
  margin: ${props => props.margin || "0 0 16px"};
  position: relative;
  flex: ${props => props.flex || "1"};
  width: ${props => props.width};
`

const StyledRange = styled.div`
  width: ${props => props.width};
  margin: ${props => props.margin};
  input[type=range] {
    -webkit-appearance: none;
    margin-right: 15px;
    width: 100%;
    height: 7px;
    border-radius: 0.25rem;
    background: ${colors.gray.threeHundred};
    background-image: linear-gradient(${colors.gray.nineHundred}, ${colors.gray.nineHundred});
    background-size: 70% 100%;
    background-repeat: no-repeat;
    &:hover {
      &::-webkit-slider-thumb {
        border-color: ${colors.gray.eightHundred};
      }
    }
    &:focus {
      &::-webkit-slider-thumb {
        border-width: 4px;
      }
    }
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 6px solid ${colors.gray.nineHundred};
    background: ${colors.gray.oneHundred};
    cursor: pointer;
    box-shadow: 0 0 2px 0 #555;
    transition: background 0.2s, border-color 0.2s, border 0.2s;
  }
  input[type=range]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }
`

const StyledCheckbox = styled.div`
  align-items: center;
  border-radius: 4px;
  border: 1px solid ${colors.gray.nineHundred};
  display: flex;
  flex: ${props => props.flex || "1"};
  margin: ${props => props.margin};
  padding: ${props => props.padding || "8px"};
  transition: background-color 0.2s;
  span {
    font-size: ${props => props.fontsize || "0.875rem"}
  }
  &:hover {
    background-color: ${colors.gray.twoHundred};
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
  font-size: 0.875rem;
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
      border-color: ${colors.gray.nineHundred};
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
  font-size: ${props => props.fontsize ? props.fontsize : "0.875rem"};
  font-weight: ${props => props.fontweight || "700"};
  margin: ${props => props.margin || "0 0 8px 0"};
  width: ${props => props.width};
`

const StyledFloatingLabel = styled(StyledLabel)`
  position: absolute;
  left: 1rem;
  top: 0.5rem;
`

const StyledInput = styled.input`
  background-color: ${colors.white};
  border-radius: ${props => props.borderradius ? props.borderradius : "4px"};
  border: 1px solid ${props => props.bordercolor || colors.gray.nineHundred};
  color: ${colors.gray.nineHundred};
  display: block;
  font-size: ${props => props.fontsize ? props.fontsize : "1rem"};
  margin: ${props => props.margin ? props.margin : "0"};
  padding: ${props => props.padding ? props.padding : "16px"};
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
    box-shadow: ${colors.shadow.focus};
    border-color: transparent;
    outline: none;
  }
  &:hover {
    &:not(:focus) {
      background-color: ${colors.gray.oneHundred};
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
  border-radius: ${props => props.borderradius ? props.borderradius : "0.25rem"};
  border: 1px solid ${colors.gray.nineHundred};
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
  margin-top: 8px;
  margin: ${props => props.margin};
  color: ${props => props.color};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  span + span {
    margin-left: 4px;
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
  RangeInput,
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
}
