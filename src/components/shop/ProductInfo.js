import React, { useState } from "react"
import { StaticQuery, graphql } from "gatsby"
import { colors } from "../../styles/variables"
import { useShoppingCart } from 'use-shopping-cart'
import { CaretDown } from "phosphor-react"

import { ProductDetails } from "./ShopComponents"
import { QuantityTracker, SelectWrapper, StyledFieldset, StyledSelect, SelectIcon, StyledLabel } from "../form/FormComponents"
import Button from "../Button"
import Content from "../Content"

const ProductInfo = ({ bookData, setBookData, setEditMode }) => {
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState()
  // converts select value to an object detailing selected book size
  const createBookDimensions = (size) => {
    switch(size) {
      case "Medium":
        setBookData({...bookData, width: 528, height: 816})
        break
      default:
        setBookData({...bookData, width: 528, height: 816})
    }
  }

  const calculateTotalPrice = (price) => {
    const totalPrice = (itemQuantity * price) / 100

    if (totalPrice) {
      return (
        <span>${totalPrice} -&nbsp;</span>
      )
    }
  }

  return (
    <StaticQuery
      query={graphql`
        query productQuery {
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
        <ProductDetails>
          <Content
            h1fontsize="2.5rem"
            h2fontsize="2rem"
            h1fontweight="400"
            h2fontweight="400"
            h3fontweight="400"
            margin="0 0 2rem"
            paragraphfontsize="1.25rem"
            ulfontsize="1.25rem"
            paragraphcolor={colors.primary.nineHundred}
            headermargin="0 0 1rem"
          >
            <h1>{data.stripePrice.product.name}</h1>
            <h2>${data.stripePrice.unit_amount / 100}</h2>
            <p>{data.stripePrice.product.description}</p>
          </Content>
          <form>
            <StyledFieldset
              margin="0 0 1rem"
              className="is-horizontal"
            >
              <SelectWrapper>
                <StyledLabel fontsize="0.8rem">Size</StyledLabel>
                <StyledSelect
                  width="100%"
                  value={bookData.size}
                  onChange={e => createBookDimensions(e.target.value)}
                >
                  <option value="Medium">A5 (5.5" x 8.5")</option>
                </StyledSelect>
                <SelectIcon>
                  <CaretDown size="1rem" />
                </SelectIcon>
              </SelectWrapper>
              <SelectWrapper>
                <StyledLabel fontsize="0.8rem">Color</StyledLabel>
                <StyledSelect
                  width="100%"
                  value={bookData.color}
                  onChange={e => setBookData({...bookData, color: e.target.value})}
                >
                  <option value="Cadet Gray">Cadet Gray</option>
                </StyledSelect>
                <SelectIcon>
                  <CaretDown size="1rem" />
                </SelectIcon>
              </SelectWrapper>
            </StyledFieldset>
            <StyledFieldset
              margin="0 0 1rem"
              className="is-vertical"
            >
              <StyledLabel fontsize="0.8rem">Quantity</StyledLabel>
              <QuantityTracker setItemQuantity={setItemQuantity} />
            </StyledFieldset>
            <StyledFieldset
              margin="0 0 1rem"
              className="has-buttons"
            >
              <Button
                backgroundcolor={colors.black}
                color={colors.white}
                padding="1rem"
                width="100%"
                onClick={e => {
                  e.preventDefault()
                  setEditMode(true)
                }}
              >
                Customize pages
              </Button>
              <Button
                backgroundcolor={colors.primary.sixHundred}
                color={colors.white}
                padding="1rem"
                width="100%"
                onClick={e => {
                  e.preventDefault()
                  addItem({
                    name: data.stripePrice.product.name,
                    description: data.stripePrice.product.description,
                    id: data.stripePrice.id,
                    price: data.stripePrice.unit_amount,
                    currency: data.stripePrice.currency,
                    image: data.stripePrice.product.images,
                  }, itemQuantity)
                }}
              >
                {calculateTotalPrice(data.stripePrice.unit_amount)} Add to cart
              </Button>
            </StyledFieldset>
          </form>
        </ProductDetails>
      )}
    />
  )
}

export default ProductInfo
