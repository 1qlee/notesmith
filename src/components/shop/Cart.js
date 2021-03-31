import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart"
import { ArrowLeft } from "phosphor-react"

import { CartQuantityTracker } from "./ShopComponents"
import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"
import TextLink from "../TextLink"
import Icon from "../Icon"

const StyledCart = styled.div`

`

const CartItems = styled.div`

`

const CartItem = styled.div`
  p {
    margin: 0.5rem 0;
  }
`

const ItemName = styled.h3`
  font-family: "Crimson Pro", Palatino, Georgia, serif;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`

function Cart() {
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
    <StyledCart>
      <Flexbox
        flex="flex"
        alignitems="center"
        justifycontent="space-between"
        padding="0 0 1rem 0"
        bordercolor={colors.gray.threeHundred}
        className="has-border-bottom"
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
        {cartItems.length > 0 && (
          <TextLink
            color={colors.gray.sixHundred}
            hovercolor={colors.gray.nineHundred}
            onClick={e => {
              e.preventDefault()
              clearCart()
            }}
          >
            <span>Clear cart</span>
          </TextLink>
        )}
      </Flexbox>
      <CartItems>
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item, index) => (
              <Flexbox
                key={index}
                flex="flex"
                justifycontent="space-between"
                padding="1rem 0"
              >
                <Flexbox
                  flex="flex"
                  margin="0 1rem 0 0"
                >
                  {item.image.map(image => (
                    <img src={image} alt={image.description} width="150" style={{marginRight:"1rem"}} />
                  ))}
                  <CartItem>
                    <ItemName>{item.name}</ItemName>
                    <p>
                      {formatCurrencyString({
                        value: item.price,
                        currency: 'USD'
                      })}
                    </p>
                    <CartQuantityTracker
                      product={item}
                      setItemQuantity={setItemQuantity}
                      incrementItem={incrementItem}
                      decrementItem={decrementItem}
                    />
                    <TextLink
                      color={colors.link.normal}
                      hovercolor={colors.link.hover}
                      margin="0 0 0 0.25rem"
                      onClick={e => {
                        e.preventDefault()
                        removeItem(item.id)
                      }}
                    >
                      <small>Remove</small>
                    </TextLink>
                  </CartItem>
                </Flexbox>
                <Flexbox>
                  <p>{item.formattedValue}</p>
                </Flexbox>
              </Flexbox>
            ))}
          </>
        ) : (
          <Content
            margin="1rem 0"
            paragraphTextAlign="center"
          >
            <p>You have no items in your cart.</p>
          </Content>
        )}
      </CartItems>
    </StyledCart>
  )
}

export default Cart
