import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { useShoppingCart } from 'use-shopping-cart'

import { Plus, Minus } from "phosphor-react"
import { Flexbox } from "../layout/Flexbox"
import { QuantityWrapper, QuantityButton, Counter } from "../form/FormComponents"
import Icon from "../Icon"

function CartQuantityTracker(props) {
  const {
    setItemQuantity,
    incrementItem,
    decrementItem
  } = useShoppingCart()
  const [trackQuantity, setTrackQuantity] = useState(props.product.quantity)

  // change the quantity based on input
  function handleQuantityChange(quantity) {
    const intQuantity = parseInt(quantity)

    if (intQuantity === 0 || !intQuantity) {
      setTrackQuantity(1)
    }
    else {
      setTrackQuantity(quantity)
    }
  }

  // check for a valid quantity input on blur
  function handleBlur(quantity) {
    const intQuantity = parseInt(quantity)

    if (!intQuantity) {
      setItemQuantity(props.product.id, 1)
      setTrackQuantity(1)
    }
    else {
      setItemQuantity(props.product.id, intQuantity)
      setTrackQuantity(intQuantity)
    }
  }

  function handleButtonChange(up) {
    if (up) {
      setTrackQuantity(trackQuantity + 1)
      incrementItem(props.product.id)
    }
    else {
      setTrackQuantity(trackQuantity - 1)
      decrementItem(props.product.id)
    }
  }

  return (
    <QuantityWrapper
      padding={props.wrapperpadding}
      boxshadow={props.wrapperboxshadow}
    >
      <QuantityButton
        disabled={props.product.quantity === 1}
        height={props.buttonheight}
        left={true}
        onClick={() => handleButtonChange(false)}
        padding={props.counterpadding}
        width={props.buttonwidth}
      >
        <Icon style={{width:"100%", height: "100%"}}>
          <Minus
            size={props.iconsize}
            color={props.product.quantity === 1 ? colors.gray.threeHundred : colors.gray.nineHundred}
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
        onBlur={e => handleBlur(parseInt(e.target.value))}
        onChange={e => handleQuantityChange(parseInt(e.target.value))}
        type="number"
        value={trackQuantity}
        width={props.counterwidth}
      />
      <QuantityButton
        onClick={() => handleButtonChange(true)}
        height={props.buttonheight}
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
