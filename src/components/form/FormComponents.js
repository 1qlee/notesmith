import React, { useState, useRef } from "react"
import styled from "styled-components"
import { colors, regex } from "../../styles/variables"
import { Minus, Plus } from "phosphor-react"

import Icon from "../Icon"

function QuantityTracker() {
  const [quantity, setQuantity] = useState(1)
  const quantityRef = useRef()

  const handleBlur = e => {
    console.log(e.target.value)
    if (!e.target.value || e.target.value == 0) {
      setQuantity(1)
    }
  }

  return (
    <QuantityWrapper>
      <QuantityButton
        onClick={e => {
          e.preventDefault()
          quantityRef.current.stepDown(1)
        }}
        borderradius="0.25rem 0 0 0.25rem"
      >
        <Icon>
          <Minus
            size="0.75rem"
            color={quantity === 1 ? colors.gray.fiveHundred : colors.gray.nineHundred}
            weight="bold"
          />
        </Icon>
      </QuantityButton>
      <Counter
        border="none"
        fontSize="1rem"
        margin="0 0.25rem"
        min="1"
        onChange={e => setQuantity(e.target.value)}
        onBlur={e => handleBlur(e)}
        ref={quantityRef}
        type="number"
        value={quantity}
        width="3rem"
      />
      <QuantityButton
        onClick={e => {
          e.preventDefault()
          quantityRef.current.stepUp(1)
        }}
        borderradius="0 0.25rem 0.25rem 0"
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
  background-color: ${colors.paper.cream};
  box-shadow: 0 0 0 1px ${colors.gray.nineHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
  border-radius: 0.25rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
`

const QuantityButton = styled.button`
  background-color: ${colors.paper.cream};
  border: none;
  padding: 0.25rem 1rem;
  border-radius: ${props => props.borderradius};
  &:hover {
    cursor: pointer;
  }
`

const Counter = styled.input`
  background-color: ${colors.paper.cream};
  border-radius: ${props => props.borderRadius ? props.borderRadius : 0};
  border: ${props => props.border};
  font-size: ${props => props.fontSize};
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
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  padding: 2rem;
  width: 100%;
`

const StyledFieldset = styled.fieldset`
  border: none;
  display: flex;
  margin: ${props => props.margin};
  position: relative;
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
    border-radius: 0.25rem;
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
      border-radius: 0.25rem 0.25rem 0 0;
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
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  width: 100%;
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
  background-color: ${colors.paper.cream};
  box-shadow: 0 0 0 1px ${colors.gray.nineHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
  border-radius: ${props => props.borderRadius ? props.borderRadius : 0};
  border: none;
  display: block;
  font-size: 1rem;
  line-height: 1rem;
  padding: ${props => props.padding ? props.padding : "0.5rem 1rem"};
  width: ${props => props.width ? props.width : "100%"};
  &.is-error {
    box-shadow: 0 0 0 2px ${colors.red.sixHundred}, inset 0 0 0 1px ${colors.paper.cream};
  }
  &.has-width-auto {
    width: auto;
  }
  &:focus {
    box-shadow: 0 0 0 2px ${colors.link.normal}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
    outline: none;
  }
  &::placeholder {
    color: ${colors.gray.fiveHundred};
    opacity: 1;
  }
`

const StyledSelect = styled.select`
  background-color: ${colors.paper.cream};
  box-shadow: 0 0 0 1px ${colors.gray.nineHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
  border-radius: ${props => props.borderRadius ? props.borderRadius : 0};
  border: none;
  font-size: ${props => props.fontSize};
  padding: ${props => props.padding || "1rem"};
  height: ${props => props.height || "49px"};
  width: ${props => props.width};
  appearance: none;
  &.is-error {
    box-shadow: 0 0 0 2px ${colors.red.sixHundred}, inset 0 0 0 1px ${colors.paper.cream};
  }
  &:active,
  &:focus {
    box-shadow: 0 0 0 2px ${colors.link.normal}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
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
  StyledFieldset,
  StyledRadio,
  StyledSelect,
  StyledFloatingLabel,
  StyledLabel,
  StyledInput,
  ErrorLine
}
