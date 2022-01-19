import React, { useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors, convertToDecimal } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { ArrowLeft, Trash } from "phosphor-react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import { QuantityTracker } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"
import TextLink from "../TextLink"
import Icon from "../Icon"

function ShoppingCart() {
  const {
    clearCart,
    cartDetails,
    setItemQuantity,
    incrementItem,
    decrementItem,
    removeItem
  } = useShoppingCart()
  const cartItems = []

  // push all product objects in cartDetails to an array
  for (const product in cartDetails) {
    cartItems.push(cartDetails[product])

    console.log(cartItems)
  }

  return (
    <>
      <Content
        margin="0 0 2rem 0"
      >
        <h3>Your cart</h3>
      </Content>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item, index) => (
            <Flexbox
              key={index}
              flex="flex"
              justifycontent="space-between"
              padding="1rem"
            >
              <Flexbox
                flex="flex"
              >
                {item.images.nodes.map(image => (
                  <GatsbyImage image={image.childImageSharp.gatsbyImageData} alt="" style={{marginRight:"1rem"}} />
                ))}
                <Flexbox
                  flex="flex"
                  flexdirection="column"
                  justifycontent="space-between"
                >
                  <Content
                    h3fontweight="400"
                    h3margin="0"
                    h3fontsize="1.2rem"
                  >
                    <p>{item.name}</p>
                    <p>
                      ${convertToDecimal(item.price, 2)}
                    </p>
                  </Content>
                  <TextLink
                    color={colors.gray.sixHundred}
                    hovercolor={colors.gray.nineHundred}
                    margin="0"
                    width="1rem"
                    onClick={e => {
                      e.preventDefault()
                      removeItem(item.id)
                    }}
                  >
                    <Icon>
                      <Trash size="1rem" />
                    </Icon>
                  </TextLink>
                </Flexbox>
              </Flexbox>
              <Flexbox
                flex="flex"
                flexdirection="column"
                justifycontent="space-between"
                alignitems="flex-end"
              >
                <Content
                  h3color={colors.primary.nineHundred}
                  h3fontweight="400"
                  h3margin="0"
                >
                  <h3>${convertToDecimal(item.value, 2)}</h3>
                </Content>
                <QuantityTracker
                  buttonwidth="1rem"
                  buttonheight="1rem"
                  counterwidth="6rem"
                  counterfontsize="0.825rem"
                  iconsize="0.625rem"
                  setItemQuantity={setItemQuantity}
                  counterpadding="0.5rem"
                />
              </Flexbox>
            </Flexbox>
          ))}
        </>
      ) : (
        <Content
          margin="1rem 0"
          paragraphtextalign="center"
        >
          <p>You have no items in your cart.</p>
        </Content>
      )}
    </>
  )
}

export default ShoppingCart
