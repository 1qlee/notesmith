import React from "react"
import { StaticQuery, graphql } from "gatsby"
import { colors } from "../../styles/variables"
import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart'
import { CaretDown } from "phosphor-react"

import { ProductDetails } from "./ShopComponents"
import { QuantityTracker, StyledFieldset, StyledSelect, StyledLabel } from "../form/FormComponents"
import CheckoutForm from "../form/CheckoutForm"
import Button from "../Button"
import Content from "../Content"
import Icon from "../Icon"

const ProductInfo = ({ bookData, setBookData, setEditMode }) => {
  const { addItem, redirectToCheckout } = useShoppingCart()
  // converts select value to an object detailing selected book size
  function createBookDimensions(size) {
    switch(size) {
      case "Medium":
        setBookData({...bookData, width: 528, height: 816})
        break
      default:
        setBookData({...bookData, width: 528, height: 816})
    }
  }

  return (
    <StaticQuery
      query={graphql`
        query productQuery {
          stripePrice(id: { eq: "price_1IMORHIN24Fw2SWdGKObBWWY" }) {
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
            h3FontWeight="400"
            paragraphFontSize="1.25rem"
            ulFontSize="1.25rem"
            margin="0 0 2rem"
          >
            <h2>{data.stripePrice.product.name}</h2>
            <p>{formatCurrencyString({value: data.stripePrice.unit_amount, currency: 'USD'})}</p>
            <p>{data.stripePrice.product.description}</p>
          </Content>
          <form>
            <StyledFieldset
              margin="0 0 1rem"
              className="is-horizontal"
            >
              <div>
                <StyledLabel>Size</StyledLabel>
                <div style={{position: 'relative'}}>
                  <StyledSelect
                    borderRadius="0.25rem"
                    width="100%"
                    height="51px"
                    value={bookData.size}
                    onChange={e => createBookDimensions(e.target.value)}
                    padding="1rem 3rem 1rem 1rem"
                  >
                    <option value="Medium">A5 (5.5" x 8.5")</option>
                  </StyledSelect>
                  <Icon style={{position: 'absolute', top:"1rem", right:"1rem"}}>
                    <CaretDown size="1rem" />
                  </Icon>
                </div>
              </div>
              <div>
                <StyledLabel>Color</StyledLabel>
                <StyledSelect
                  borderRadius="0.25rem"
                  width="100%"
                  height="51px"
                  value={bookData.color}
                  onChange={e => setBookData({...bookData, color: e.target.value})}
                >
                  <option value="Cadet Gray">Cadet Gray</option>
                </StyledSelect>
              </div>
            </StyledFieldset>
            <StyledFieldset
              margin="0 0 1rem"
              className="is-vertical"
            >
              <StyledLabel>Quantity</StyledLabel>
              <QuantityTracker />
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
                    image: data.stripePrice.product.images
                  })
                }}
              >
                Add to cart
              </Button>
            </StyledFieldset>
          </form>
        </ProductDetails>
      )}
    />
  )
}

export default ProductInfo
