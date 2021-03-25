import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { Link } from "gatsby"
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart"

import Button from "../Button"
import Loading from "../../assets/loading.svg"

const OrderSummary = styled.div`
  background-color: ${colors.paper.cream};
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  margin-bottom: 1rem;
`

const OrderLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  p + p {
    margin-left: 1rem;
  }
  &.has-border-bottom {
    border-bottom: 1px solid ${colors.gray.threeHundred};
  }
`

function Orders({ hideButton }) {
  const { cartDetails, formattedTotalPrice } = useShoppingCart()
  const isCartEmpty = Object.keys(cartDetails).length === 0 && cartDetails.constructor === Object

  return (
    <>
      <OrderSummary>
        <OrderLine className="has-border-bottom">
          <h3>Order Summary</h3>
        </OrderLine>
        <OrderLine>
          <p>Subtotal</p>
          <p>{formattedTotalPrice}</p>
        </OrderLine>
        <OrderLine>
          <p>Shipping</p>
          <p>---</p>
        </OrderLine>
        <OrderLine className="has-border-bottom">
          <p>Tax</p>
          <p>---</p>
        </OrderLine>
        <OrderLine>
          <p><b>Total</b></p>
          <p><b>{formattedTotalPrice}</b></p>
        </OrderLine>
      </OrderSummary>
      {hideButton ? (
        null
      ) : (
        <Button
          backgroundcolor={colors.primary.sixHundred}
          color={colors.white}
          padding="1rem"
          form="cart-checkout-form"
          type="submit"
          width="100%"
          disabled={isCartEmpty}
          as={Link}
          to={isCartEmpty ? null : "/checkout"}
        >
          Continue to checkout
        </Button>
      )}
    </>
  )
}

export default Orders
