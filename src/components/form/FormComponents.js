import React, { useState, useRef } from "react"
import styled from "styled-components"
import { colors, regex } from "../../styles/variables"
import { Minus, Plus } from "phosphor-react"

import Icon from "../Icon"

function QuantityTracker(props) {
  const [quantity, setQuantity] = useState(1)

  const handleButtonChange = (e, up) => {
    e.preventDefault()
    const { value } = e.target

    if (up) {
      setQuantity(quantity => quantity + 1)
      props.setItemQuantity(quantity + 1)
    }
    else {
      setQuantity(quantity => quantity - 1)
      props.setItemQuantity(quantity - 1)
    }
  }

  const handleBlur = e => {
    const { value } = e.target

    if (!value || value == 0) {
      setQuantity(1)
      props.setItemQuantity(1)
    }
  }

  const handleChange = e => {
    const { value } = e.target

    setQuantity(e.target.value)
    props.setItemQuantity(e.target.value)
  }

  return (
    <QuantityWrapper>
      <QuantityButton
        onClick={e => handleButtonChange(e)}
        disabled={quantity == 1}
      >
        <Icon style={{width:"100%", height: "100%"}}>
          <Minus
            size="0.75rem"
            color={quantity === 1 ? colors.gray.fiveHundred : colors.gray.nineHundred}
            weight="bold"
          />
        </Icon>
      </QuantityButton>
      <Counter
        border="none"
        fontsize="1rem"
        margin="0 0.25rem"
        min="1"
        onChange={e => handleChange(e)}
        onBlur={e => handleBlur(e)}
        type="number"
        value={quantity}
        width="3rem"
      />
      <QuantityButton
        onClick={e => handleButtonChange(e, true)}
      >
        <Icon>
          <Plus
            size="0.75rem"
            color={colors.gray.nineHundred}
            weight="bold"
          />
        </Icon>
      </QuantityButton>
    </QuantityWrapper>
  )
}

const QuantityWrapper = styled.div`
  background-color: ${colors.paper.offWhite};
  box-shadow: 0 0 0 1px ${colors.gray.nineHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
  padding: 0.75rem;
  display: flex;
  align-items: center;
`

const QuantityButton = styled.button`
  background-color: ${colors.paper.offWhite};
  border: none;
  padding: 0;
  width: 3rem;
  height: 1.5rem;
  &:hover {
    cursor: pointer;
  }
`

const Counter = styled.input`
  background-color: ${colors.paper.offWhite};
  border-radius: ${props => props.borderradius ? props.borderradius : 0};
  border: ${props => props.border};
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
  margin: ${props => props.margin};
  position: relative;
  width: ${props => props.width};
  label {
    margin-right: 1rem;
  }
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

const StyledLabel = styled.label`
  color: ${colors.primary.sevenHundred};
  display: block;
  font-family: "Spectral";
  font-size: ${props => props.fontsize ? props.fontsize : "0.65rem"};
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  width: calc(100% - 2rem);
`

const StyledFloatingLabel = styled(StyledLabel)`
  position: absolute;
  left: 1rem;
  top: 0.5rem;
`

const StyledInput = styled.input`
  background-color: ${colors.paper.offWhite};
  box-shadow: 0 0 0 1px ${colors.gray.sixHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
  border-radius: ${props => props.borderradius ? props.borderradius : 0};
  border: none;
  color: ${colors.gray.nineHundred};
  display: block;
  font-size: 1rem;
  line-height: 1rem;
  padding: ${props => props.padding ? props.padding : "2rem 1rem 1rem"};
  width: ${props => props.width ? props.width : "100%"};
  &.is-error {
    box-shadow: 0 0 0 2px ${colors.red.sixHundred}, inset 0 0 0 1px ${colors.paper.offWhite};
  }
  &.has-width-auto {
    width: auto;
  }
  &:focus {
    box-shadow: 0 0 0 2px ${colors.primary.sixHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
    outline: none;
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
  top: 1rem;
  right: 1rem;
`

const StyledSelect = styled.select`
  background-color: ${colors.paper.offWhite};
  box-shadow: 0 0 0 1px ${colors.gray.sixHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
  border-radius: ${props => props.borderradius ? props.borderradius : 0};
  border: none;
  font-size: ${props => props.fontsize};
  padding: ${props => props.padding || "1rem"};
  height: ${props => props.height};
  width: ${props => props.width};
  appearance: none;
  &.is-error {
    box-shadow: 0 0 0 2px ${colors.red.sixHundred}, inset 0 0 0 1px ${colors.paper.offWhite};
  }
  &:active,
  &:focus {
    box-shadow: 0 0 0 2px ${colors.primary.sixHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
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
  Counter,
  AuthFormWrapper,
  SelectWrapper,
  StyledFieldset,
  StyledRadio,
  StyledSelect,
  SelectIcon,
  StyledFloatingLabel,
  StyledLabel,
  StyledInput,
  ErrorLine
}
