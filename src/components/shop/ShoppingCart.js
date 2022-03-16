import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { colors, convertToDecimal, spacing } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { Trash } from "phosphor-react"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"

import { CartQuantityTracker } from "./ShopComponents"
import { Flexbox } from "../layout/Flexbox"
import Button from "../Button"
import Content from "../Content"
import TextLink from "../TextLink"
import Icon from "../Icon"

function ShoppingCart() {
  const {
    cartDetails,
    setItemQuantity,
    removeItem,
    totalPrice,
  } = useShoppingCart()
  const cartItems = []

  // push all product objects in cartDetails to an array
  for (const product in cartDetails) {
    cartItems.push(cartDetails[product])
    console.log(cartDetails[product])
  }

  return (
    <div>
      <Content
        margin="0 0 2rem 0"
        h1fontweight="400"
        h1fontsize="2.5rem"
      >
        <h1>Your cart</h1>
      </Content>
      {cartItems.length > 0 ? (
        <>
          <table>
            <thead>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th style={{textAlign:"right"}}>Total</th>
            </thead>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    height="100%"
                  >
                    <GatsbyImage
                      image={item.image.gatsbyImageData}
                      alt="product thumbnail"
                    />
                    <Content
                      paragraphmargin="0"
                      paragraphfontsize="1.25rem"
                      smallfontsize="0.875rem"
                      smallmargin="0"
                      margin="0 0 0 1rem"
                    >
                      <p>{item.name}</p>
                      <a>
                        <small>View details</small>
                      </a>
                    </Content>
                  </Flexbox>
                </td>
                <td>
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    height="100%"
                  >
                    <Content
                      paragraphmargin="0"
                      paragraphfontsize="1.25rem"
                    >
                      <p>
                        ${convertToDecimal(item.price, 2)}
                      </p>
                    </Content>
                  </Flexbox>
                </td>
                <td>
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    height="100%"
                  >
                    <CartQuantityTracker
                      buttonwidth="1rem"
                      buttonheight="1rem"
                      counterwidth="6rem"
                      counterfontsize="0.825rem"
                      iconsize="0.625rem"
                      setItemQuantity={setItemQuantity}
                      product={item}
                      counterpadding="0.5rem"
                    />
                  </Flexbox>
                </td>
                <td>
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    justifycontent="flex-end"
                    height="100%"
                  >
                    <Content
                      paragraphmargin="0"
                      paragraphfontsize="1.25rem"
                    >
                      <p>${convertToDecimal(item.value, 2)}</p>
                    </Content>
                  </Flexbox>
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td style={{textAlign:"right"}}><span style={{marginRight: "6rem"}}>Subtotal</span><span style={{fontSize:"1.25rem"}}>${parseFloat(totalPrice / 100)}</span></td>
            </tr>
          </table>
          <Flexbox
            width="100%"
            flex="flex"
            justifycontent="flex-end"
            margin="2rem 0 0"
          >
            <Button
              backgroundcolor={colors.primary.sixHundred}
              color={colors.white}
              padding="1rem"
              as={Link}
              to="/checkout"
              width="12rem"
            >
              Checkout
            </Button>
          </Flexbox>
        </>
      ) : (
        <Content
          margin="1rem 0"
          paragraphtextalign="center"
        >
          <p>You have no items in your cart.</p>
        </Content>
      )}
    </div>
  )
}

export default ShoppingCart
