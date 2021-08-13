import React from "react"
import styled from "styled-components"
import { colors, convertToDecimal } from "../../styles/variables"
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart"
import { ArrowLeft, Trash } from "phosphor-react"

import { CartQuantityTracker } from "./ShopComponents"
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
  }

  return (
    <>
      <Flexbox
        flex="flex"
        alignitems="center"
        justifycontent="space-between"
        margin="0 0 2rem 0"
      >
        <TextLink
          className="has-icon"
          color={colors.gray.sixHundred}
          hovercolor={colors.gray.nineHundred}
        >
          <Icon>
            <ArrowLeft size="1rem" />
          </Icon>
          <span>Back to shopping</span>
        </TextLink>
      </Flexbox>
      <Flexbox
        bordercolor={colors.gray.threeHundred}
        className="has-border-bottom"
      >
        <Content
          h3fontweight="400"
        >
          <h3>Your cart</h3>
        </Content>
      </Flexbox>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item, index) => (
            <Flexbox
              key={index}
              flex="flex"
              justifycontent="space-between"
              padding="1rem 0"
              height="132px"
            >
              <Flexbox
                flex="flex"
              >
                {item.image.map(image => (
                  <img key={image.description} src={image} alt={image.description} width="150" style={{marginRight:"1rem"}} />
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
                    paragraphcolor={colors.gray.sixHundred}
                    paragraphmarginbottom="0"
                  >
                    <h3>{item.name}</h3>
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
                <CartQuantityTracker
                  buttonwidth="1rem"
                  buttonheight="1rem"
                  counterwidth="2rem"
                  counterfontsize="0.825rem"
                  iconsize="0.625rem"
                  wrapperpadding="0.25rem"
                  wrapperboxshadow={`0 1px 2px ${colors.shadow.float}`}
                  product={item}
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
