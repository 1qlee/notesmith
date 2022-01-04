import React, { useState } from "react"
import styled from "styled-components"
import { ArrowCircleRight } from "phosphor-react"
import { colors } from "../../../styles/variables"
import { StaticQuery, graphql, navigate } from "gatsby"
import { useShoppingCart } from 'use-shopping-cart'

import { Flexbox } from "../../layout/Flexbox"
import { QuantityTracker, StyledLabel, StyledFieldset, SelectWrapper, StyledSelect, SelectIcon } from "../../form/FormComponents"
import Button from "../../Button"
import Icon from "../../Icon"
import Content from "../../Content"

function Checkoutbar({
  bookData,
}) {
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)

  const calculateTotalPrice = (price, dash) => {
    const totalPrice = (itemQuantity * price) / 100

    if (totalPrice && dash) {
      return (
        <span>${totalPrice} -&nbsp;</span>
      )
    }
    else {
      return (
        <span>${totalPrice}</span>
      )
    }
  }

  function handleCheckoutButton(price) {
    // create a promise to add items to cart then redirect user to cart
    const addItemsToCart = new Promise((resolve, reject) => {
      // use-shopping-cart function to add items to cart
      resolve(
        addItem({
          name: price.product.name,
          description: price.product.description,
          id: price.id,
          price: price.unit_amount,
          currency: price.currency,
          image: price.product.images,
        }, itemQuantity)
      )
    })

    addItemsToCart.then(() => {
      return navigate("/cart")
    }).catch(error => {
      console.log(error)
    })
  }

  return (
    <StaticQuery
      query={graphql`
        query notebookQuery {
          stripePrice(id: { eq: "price_1IbAlnIN24Fw2SWdOVRXdimr" }) {
            id,
            unit_amount,
            currency,
            product {
              id
              name
              description
              images
            }
          }
        }
      `}
      render={data => (
        <Flexbox
          flex="flex"
          flexdirection="column"
          justifycontent="space-between"
          height="100%"
        >
          <Flexbox
            flex="flex"
            flexdirection="column"
            padding="1rem"
          >
            <Content
              margin="0 0 1rem 0"
              h4fontweight="400"
              h4color={colors.primary.eightHundred}
            >
              <h3>{data.stripePrice.product.name}</h3>
              <p>{data.stripePrice.product.description.substring(0, 100)}...</p>
            </Content>
            <Flexbox
              flex="flex"
              alignitems="center"
              justifycontent="space-between"
              margin="0.5rem 0"
            >
              <Content
                padding="0"
                margin="0"
                h4margin="0"
                h4fontweight="400"
              >
                <h4>Size</h4>
              </Content>
              <Content
                padding="0"
                margin="0"
                paragraphmarginbottom="0"
              >
                <p>{`${bookData.dimensions} (${bookData.size})`}</p>
              </Content>
            </Flexbox>
            <Flexbox
              flex="flex"
              alignitems="center"
              justifycontent="space-between"
              margin="0.5rem 0"
            >
              <Content
                padding="0"
                margin="0"
                h4margin="0"
                h4fontweight="400"
              >
                <h4>Cover</h4>
              </Content>
              <Content
                padding="0"
                margin="0"
                paragraphmarginbottom="0"
              >
                <p>Forest green</p>
              </Content>
            </Flexbox>
            <Flexbox
              alignitems="center"
              bordercolor={colors.gray.threeHundred}
              className="has-border-bottom"
              flex="flex"
              justifycontent="space-between"
              margin="0.5rem 0"
              padding="0 0 1rem 0"
            >
              <Content
                padding="0"
                margin="0"
                h4margin="0"
                h4fontweight="400"
              >
                <h4>Pages</h4>
              </Content>
              <Content
                padding="0"
                margin="0"
                paragraphmarginbottom="0"
              >
                <p>48</p>
              </Content>
            </Flexbox>
            <Flexbox
              flex="flex"
              alignitems="center"
              justifycontent="space-between"
              margin="0.5rem 0"
            >
              <Content
                padding="0"
                margin="0"
                h4margin="0"
                h4fontweight="400"
              >
                <h4>Quantity</h4>
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
            <Flexbox
              flex="flex"
              alignitems="flex-end"
              justifycontent="space-between"
              margin="0.5rem 0"
            >
              <Content
                padding="0"
                margin="0"
                h4margin="0"
                h4fontweight="400"
              >
                <h4>Subtotal</h4>
              </Content>
              <Content
                padding="0"
                margin="0"
                h3margin="0"
                h3fontweight="400"
                h3color={colors.primary.sixHundred}
              >
                <h3>{calculateTotalPrice(data.stripePrice.unit_amount)}</h3>
              </Content>
            </Flexbox>
          </Flexbox>
          <Flexbox
            padding="1rem"
            backgroundcolor={colors.white}
            className="has-border-top"
            bordercolor={colors.gray.threeHundred}
          >
            <Button
              backgroundcolor={colors.primary.sixHundred}
              borderradius="0.25rem"
              color={colors.primary.white}
              padding="1rem"
              width="100%"
              onClick={() => handleCheckoutButton(data.stripePrice)}
            >
              {calculateTotalPrice(data.stripePrice.unit_amount, true)} Checkout
              <Icon
                margin="0 0 0 0.5rem"
              >
                <ArrowCircleRight size="1rem" weight="bold" />
              </Icon>
            </Button>
          </Flexbox>
        </Flexbox>
      )}
    />
  )
}

export default Checkoutbar
