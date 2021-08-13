import React from "react"
import styled from "styled-components"
import { colors, convertToDecimal } from "../../styles/variables"
import { Link } from "gatsby"
import { useShoppingCart } from "use-shopping-cart"

import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"
import Button from "../Button"

const Orders = styled.div`
  background-color: ${colors.white};
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px ${colors.shadow.float};
  margin-bottom: 1rem;
  padding: 1rem;
`

function OrderSummary({ hideButton, selectedRate, taxRate }) {
  const { cartDetails, totalPrice, formattedTotalPrice } = useShoppingCart()
  const isCartEmpty = Object.keys(cartDetails).length === 0 && cartDetails.constructor === Object

  // calculate the total price of the user's cart incl shipping
  const calculateTotalPrice = () => {
    let calculatedPrice = totalPrice

    if (selectedRate) {
      const formattedRate = parseFloat(selectedRate.rate * 100)
      calculatedPrice += formattedRate
    }
    if (taxRate) {
      calculatedPrice += parseFloat(taxRate * 100)
    }

    return convertToDecimal(calculatedPrice, 2) // converts to a float value
  }

  const createOrder = () => {
    let order = []

    for (const product in cartDetails) {
      order.push(cartDetails[product])
    }

    return order
  }

  return (
    <>
      <Orders>
        <Flexbox
          className="has-border-bottom"
          padding="0 0 1rem 0"
          bordercolor={colors.gray.threeHundred}
        >
          <Content
            h3margin="0"
            h3fontweight="400"
          >
            <h3>Order summary</h3>
          </Content>
        </Flexbox>
        <Flexbox
          padding="1rem 0"
          flex="flex"
          justifycontent="space-between"
        >
          <p>Subtotal</p>
          <p>${convertToDecimal(totalPrice, 2)}</p>
        </Flexbox>
        <Flexbox
          padding="1rem 0"
          flex="flex"
          justifycontent="space-between"
        >
          <p>Shipping</p>
          {selectedRate ? (
            <p>${selectedRate.rate}</p>
          ) : (
            <p>---</p>
          )}
        </Flexbox>
        {taxRate > 0 && (
          <Flexbox
            className="has-border-bottom"
            padding="0 0 1rem 0"
            bordercolor={colors.gray.threeHundred}
          >
            <p>Tax</p>
            <p>${taxRate.toFixed(2)}</p>
          </Flexbox>
        )}
        <Flexbox
          padding="1rem 0 0"
          flex="flex"
          justifycontent="space-between"
          alignitems="flex-end"
          className="has-border-top"
          bordercolor={colors.gray.threeHundred}
        >
          <Content
            paragraphmarginbottom="0"
            paragraphcolor={colors.gray.nineHundred}
          >
            <p>Total</p>
          </Content>
          <Content
            h3margin="0"
            h3fontweight="400"
            h3color={colors.primary.nineHundred}
          >
            <h3>${calculateTotalPrice()}</h3>
          </Content>
        </Flexbox>
      </Orders>
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

export default OrderSummary
