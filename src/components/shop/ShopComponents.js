import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import { Plus, Minus } from "phosphor-react"
import { Flexbox } from "../layout/Flexbox"
import Button from "../Button"
import Icon from "../Icon"

function CartQuantityTracker({ product, setItemQuantity, incrementItem, decrementItem }) {
  function handleChange(e) {
    e.preventDefault()
    if (!e.target.value || e.target.value === "0") {
      setItemQuantity(product.id, 1)
    }
    else {
      setItemQuantity(product.id, e.target.value)
    }
  }

  function handleQuantityButton(e, type) {
    e.preventDefault()
    const { value } = e.target

    if (type === "increment") {
      incrementItem(product.id, 1)
    }
    if (type === "decrement") {
      if (product.quantity === 1) {
        return
      }
      else {
        decrementItem(product.id, 1)
      }
    }
  }

  return (
    <Flexbox
      flex="flex"
      alignitems="center"
      margin="1rem 0"
    >
      <QuantityButton
        onClick={e => handleQuantityButton(e, "decrement")}
        margin="0 0.25rem 0 0"
        disabled={product.quantity == 1}
      >
        <Icon
        >
          <Minus
            size="0.8rem" color={colors.gray.sixHundred}
          />
        </Icon>
      </QuantityButton>
      <QuantityInput
        type="number"
        min="1"
        max="99"
        value={product.quantity}
        onChange={e => handleChange(e)}
      />
      <QuantityButton
        onClick={e => handleQuantityButton(e, "increment")}
        margin="0 0 0 0.25rem"
      >
        <Icon>
          <Plus
            size="0.8rem" color={colors.gray.sixHundred}
          />
        </Icon>
      </QuantityButton>
    </Flexbox>
  )
}

const QuantityButton = styled.button`
  background-color: ${colors.paper.offWhite};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  margin: ${props => props.margin};
  border: 1px solid ${colors.gray.threeHundred};
  border-radius: 100%;
  height: 1.6rem;
  width: 1.6rem;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: none;
    border-color: ${colors.gray.sixHundred};
  }
`

const QuantityInput = styled.input`
  background: ${colors.paper.offWhite};
  box-shadow: inset 0 1px 3px ${colors.shadow.inset}, inset 0 0 1px ${colors.shadow.inset};
  border-radius: 0.25rem;
  padding: 0.25rem;
  text-align: center;
  border: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`

const PriceTag = styled.div`
  font-size: ${props => props.fontsize};
  text-align: center;
  border-radius: ${props => props.borderradius};
  color: ${props => props.color};
  display: inline-block;
  padding: ${props => props.padding};
  position: relative;
  z-index: 1;
  &::after {
    background-color: ${props => props.backgroundcolor || colors.primary.sixHundred};
    content: "";
    height: 100%;
    left: -1rem;
    position: absolute;
    border-radius: 50% 1rem 100% 1rem;
    bottom: -0.25rem;
    opacity: 0.5;
    width: 200%;
    z-index: -1;
  }
`

const ProductDetails = styled.div`
  &.fade-enter{
     opacity: 0;
  }
  &.fade-exit{
     opacity: 1;
  }
  &.fade-enter-active{
     opacity: 1;
  }
  &.fade-exit-active{
     opacity: 0;
     transform: translateX(100px);
  }
  &.fade-enter-active,
  &.fade-exit-active{
     transition: opacity 0.2s, transform 0.2s;
  }
`

export {
  PriceTag,
  ProductDetails,
  CartQuantityTracker
}
