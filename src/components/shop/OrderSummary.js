import React from "react"
import styled from "styled-components"
import { colors, convertToDecimal } from "../../styles/variables"
import { Link } from "gatsby"
import { useShoppingCart } from "use-shopping-cart"

import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"
import Button from "../Button"

const Orders = styled.div`
  background-color: ${colors.paper.offWhite};
  border: 1px solid ${colors.gray.sixHundred};
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
    border-bottom: 1px solid ${colors.gray.sixHundred};
  }
  &.has-border-top {
    border-top: 1px solid ${colors.gray.sixHundred};
  }
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
        <OrderLine className="has-border-bottom">
          <h3>Order Summary</h3>
        </OrderLine>
        {createOrder().map(item => (
          <Flexbox
            flex="flex"
            flexdirection="row"
            justifycontent="space-between"
            padding="1rem"
            width="100%"
            className="has-border-bottom"
            bordercolor={colors.gray.sixHundred}
          >
            <Flexbox
              flex="flex"
              flexdirection="row"
            >
              <img src={item.image[0]} width="100px" />
              <Content
                paragraphmarginbottom="0"
                paragraphcolor={colors.primary.sevenHundred}
                margin="0 0 0 1rem"
              >
                <p><b>{item.name}</b></p>
                <p>${convertToDecimal(item.price, 2)} x {item.quantity}</p>
              </Content>
            </Flexbox>
            <p>{item.formattedValue}</p>
          </Flexbox>
        ))}
        <OrderLine>
          <p>Subtotal</p>
          <p>{formattedTotalPrice}</p>
        </OrderLine>
        <OrderLine>
          <p>Shipping</p>
          {selectedRate ? (
            <p>${selectedRate.rate}</p>
          ) : (
            <p>---</p>
          )}
        </OrderLine>
        {taxRate > 0 && (
          <OrderLine>
            <p>Tax</p>
            <p>${taxRate.toFixed(2)}</p>
          </OrderLine>
        )}
        <OrderLine className="has-border-top">
          <p><b>Total</b></p>
          <p><b>${calculateTotalPrice()}</b></p>
        </OrderLine>
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
