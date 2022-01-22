import React from "react"
import styled from "styled-components"
import { colors, convertToDecimal } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { Trash } from "phosphor-react"
import { GatsbyImage } from "gatsby-plugin-image"

import { CartQuantityTracker } from "./ShopComponents"
import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"
import TextLink from "../TextLink"
import Icon from "../Icon"

const CartWrapper = styled.div`
  background-color: ${colors.white};
  border-radius: 0.25rem;
  border: 1px solid ${colors.gray.threeHundred};
`

function ShoppingCart() {
  const {
    cartDetails,
    setItemQuantity,
    removeItem
  } = useShoppingCart()
  const cartItems = []

  // push all product objects in cartDetails to an array
  for (const product in cartDetails) {
    cartItems.push(cartDetails[product])
  }

  return (
    <>
      <Content
        margin="0 0 2rem 0"
        h1fontsize="2rem"
      >
        <h1>Cart</h1>
      </Content>
      <CartWrapper>
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item, index) => (
              <Flexbox
                key={index}
                flex="flex"
                justifycontent="space-between"
                padding="1rem"
                alignitems="center"
              >
                <Flexbox
                  flex="flex"
                  alignitems="center"
                >
                  <GatsbyImage
                    image={item.images.nodes[0].childImageSharp.gatsbyImageData}
                    alt=""
                    style={{marginRight:"1rem", width: "50px"}}
                    loading="eager"
                  />
                  <Content
                    h3fontweight="400"
                    h3margin="0"
                    h3fontsize="1.2rem"
                  >
                    <p>{item.name}</p>
                  </Content>
                </Flexbox>
                <Flexbox
                  flex="flex"
                  alignitems="center"
                >
                  <Content
                    margin="0 1rem 0 0"
                  >
                    <p>
                      ${convertToDecimal(item.price, 2)}
                    </p>
                  </Content>
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
                <Flexbox
                  flex="flex"
                  alignitems="center"
                >
                  <Content
                    h3color={colors.primary.nineHundred}
                    h3fontweight="400"
                    h3margin="0"
                    h3fontsize="1.25rem"
                    margin="0 1rem 0 0"
                  >
                    <h3>${convertToDecimal(item.value, 2)}</h3>
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
      </CartWrapper>
    </>
  )
}

export default ShoppingCart
