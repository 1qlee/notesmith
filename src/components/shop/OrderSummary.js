import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors, convertToDecimal } from "../../styles/variables"
import { Link } from "gatsby"
import { useShoppingCart } from "use-shopping-cart"
import { GatsbyImage } from "gatsby-plugin-image"

import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"

const Orders = styled.div`
  background-color: ${colors.white};
  border-radius: 0.25rem;
  border: 1px solid ${colors.gray.threeHundred};
  margin-bottom: 1rem;
`

function OrderSummary({ selectedRate, taxRate }) {
  const { cartDetails, totalPrice } = useShoppingCart()
  const isCartEmpty = Object.keys(cartDetails).length === 0 && cartDetails.constructor === Object
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    // array to store cartItems
    const cartItemsArray = []
    // push all product objects in cartDetails to an array
    for (const cartItem in cartDetails) {
      cartItemsArray.push(cartDetails[cartItem])
    }

    setCartItems(cartItemsArray)
  }, [cartDetails])

  // calculate the total price of the user's cart incl shipping
  function calculateTotalPrice() {
    let calculatedPrice = totalPrice

    if (selectedRate) {
      const formattedRate = parseFloat(selectedRate.rate * 100)
      calculatedPrice += formattedRate
    }
    if (taxRate) {
      calculatedPrice += parseFloat(taxRate)
    }

    return convertToDecimal(calculatedPrice, 2) // converts to a float value
  }

  function capitalizeText(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  return (
    <>
      <Orders>
        <Flexbox
          className="has-border-bottom"
          padding="1rem"
          bordercolor={colors.gray.threeHundred}
        >
          <Content
            h3margin="0"
            h3fontweight="400"
          >
            <h3>Order Summary</h3>
          </Content>
        </Flexbox>
        {cartItems.map(item => (
          <Flexbox
            alignitems="center"
            flex="flex"
            key={item.id}
            padding="0.5rem 1rem"
          >
            <GatsbyImage
              image={item.image.gatsbyImageData}
              alt="product thumbnail"
            />
            <Flexbox
              flex="flex"
              justifycontent="space-between"
              width="100%"
            >
              <Content
                paragraphcolor={colors.gray.nineHundred}
                paragraphlineheight="1"
                paragraphmarginbottom="0.25rem"
                smallcolor={colors.gray.sixHundred}
                smallfontsize="0.875rem"
                smallmargin="0"
              >
                <p>{item.name} <span style={{color:colors.gray.sixHundred}}><span style={{margin:'0 0.0675rem 0 0.25rem'}}>x</span>{item.quantity}</span></p>
                {item.category === "notebooks" && (
                  <small>{capitalizeText(item.coverColor)}, {capitalizeText(item.leftPageData.template)} left, {capitalizeText(item.rightPageData.template)} right</small>
                )}
              </Content>
              <p>${convertToDecimal(item.price * item.quantity, 2)}</p>
            </Flexbox>
          </Flexbox>
        ))}
        <Flexbox
          padding="1rem"
          flex="flex"
          justifycontent="space-between"
          className="has-border-top"
          bordercolor={colors.gray.threeHundred}
        >
          <p>Subtotal</p>
          <p>${convertToDecimal(totalPrice, 2).toFixed(2)}</p>
        </Flexbox>
        <Flexbox
          padding="1rem"
          flex="flex"
          justifycontent="space-between"
          bordercolor={colors.gray.threeHundred}
        >
          <p>Shipping</p>
          {selectedRate ? (
            <p>${selectedRate.rate}</p>
          ) : (
            <p>---</p>
          )}
        </Flexbox>
        <Flexbox
          padding="1rem"
          flex="flex"
          justifycontent="space-between"
          bordercolor={colors.gray.threeHundred}
        >
          <p>Taxes</p>
          {taxRate ? (
            <p>${(taxRate / 100).toFixed(2)}</p>
          ) : (
            <p>---</p>
          )}
        </Flexbox>
        <Flexbox
          padding="1rem"
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
            h3fontsize="1.75rem"
          >
            <h3>${calculateTotalPrice()}</h3>
          </Content>
        </Flexbox>
      </Orders>
    </>
  )
}

export default OrderSummary
