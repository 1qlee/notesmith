import React, { useState } from "react"
import { StaticQuery, graphql, navigate } from "gatsby"
import { colors, spacing } from "../../styles/variables"
import { useShoppingCart } from 'use-shopping-cart'
import { CaretDown, PenNib, File, Book, LinkSimpleHorizontal, Truck, Package } from "phosphor-react"

import { ProductDetails } from "./ShopComponents"
import { QuantityTracker, SelectWrapper, StyledFieldset, StyledSelect, SelectIcon, StyledLabel } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"
import { Grid, Cell } from "styled-css-grid"
import Tag from "../ui/Tag"
import Icon from "../Icon"
import Button from "../Button"
import Content from "../Content"

const ProductInfo = ({ bookData, setBookData, setEditMode }) => {
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)
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
            h1fontweight="400"
            h2fontsize="2rem"
            h2fontweight="400"
            headermargin="0 0 1rem"
            margin="0 0 1rem"
            paragraphfontsize="1.125rem"
          >
            <h1>{data.stripePrice.product.name}</h1>
            <h2>${data.stripePrice.unit_amount / 100}</h2>
            <p>{data.stripePrice.product.description}</p>
          </Content>
          <Flexbox
            margin="0 0 2rem"
          >
            <Flexbox
              flex="flex"
              justifycontent="space-between"
            >
              <Content
                h3fontsize="0.75rem"
                h3margin="0 0 0.5rem 0"
              >
                <h3>SIZE</h3>
                <p>5.5" x 8.5" (A5)</p>
              </Content>
              <Content
                h3fontsize="0.75rem"
                h3margin="0 0 0.5rem 0"
              >
                <h3>PAGES</h3>
                <p>48 total</p>
              </Content>
              <Content
                h3fontsize="0.75rem"
                h3margin="0 0 0.5rem 0"
              >
                <h3>COVER</h3>
                <p>Forest green</p>
              </Content>
              <Content
                h3fontsize="0.75rem"
                h3margin="0 0 0.5rem 0"
              >
                <h3>BINDING</h3>
                <p>Saddle stitched</p>
              </Content>
            </Flexbox>
          </Flexbox>
          <Flexbox
            flex="flex"
            margin="0 0 1rem"
          >
            <QuantityTracker setItemQuantity={setItemQuantity} />
            <Button
              backgroundcolor={colors.primary.sixHundred}
              color={colors.primary.white}
              margin="0 0 0 1rem"
              padding="1rem"
              width="100%"
              onClick={e => {
                e.preventDefault()
                navigate("/customize/notebooks", {
                  state: {
                    quantity: itemQuantity
                  }
                })
                // addItem({
                //   name: data.stripePrice.product.name,
                //   description: data.stripePrice.product.description,
                //   id: data.stripePrice.id,
                //   price: data.stripePrice.unit_amount,
                //   currency: data.stripePrice.currency,
                //   image: data.stripePrice.product.images,
                // }, itemQuantity)
              }}
            >
              {calculateTotalPrice(data.stripePrice.unit_amount)} Customize layouts
            </Button>
          </Flexbox>
          <Flexbox
            flex="flex"
            justifycontent="space-between"
            className="has-border-bottom"
            bordercolor={colors.gray.fourHundred}
            padding="0 0 2rem"
          >
            <Content
              paragraphfontsize="0.75rem"
              linkfontsize="0.85rem"
            >
              <a>Return Policy</a>
            </Content>
            <Flexbox
              flex="flex"
              alignitems="center"
            >
              <Icon
                margin="0 0.5rem 0 0"
              >
                <Truck size="1rem" weight="duotone" colors={colors.gray.sixHundred} />
              </Icon>
              <Content
                paragraphfontsize="0.85rem"
                paragraphcolor={colors.gray.sevenHundred}
              >
                <p>Free shipping for orders over $40</p>
              </Content>
            </Flexbox>
          </Flexbox>
          <Content
            margin="2rem 0 0"
            h3fontsize="0.75rem"
          >
            <h3>NOTEBOOK DETAILS</h3>
          </Content>
          <Content
            margin="0 0 0.5rem"
            paragraphcolor={colors.gray.sevenHundred}
          >
            <Flexbox
              flex="flex"
              alignitems="center"
            >
              <Icon margin="0 0.5rem 0 0">
                <PenNib size="1.25rem" weight="duotone" color={colors.gray.sixHundred} />
              </Icon>
              <p>Fountain pen friendly paper</p>
            </Flexbox>
          </Content>
          <Content
            margin="0 0 0.5rem"
            paragraphcolor={colors.gray.sevenHundred}
          >
            <Flexbox
              flex="flex"
              alignitems="center"
            >
              <Icon margin="0 0.5rem 0 0">
                <File size="1.25rem" weight="duotone" color={colors.gray.sixHundred} />
              </Icon>
              <p>70lb smooth, white paper inside</p>
            </Flexbox>
          </Content>
          <Content
            margin="0 0 0.5rem"
            paragraphcolor={colors.gray.sevenHundred}
          >
            <Flexbox
              flex="flex"
              alignitems="center"
            >
              <Icon margin="0 0.5rem 0 0">
                <Book size="1.25rem" weight="duotone" color={colors.gray.sixHundred} />
              </Icon>
              <p>80c linen paper cover</p>
            </Flexbox>
          </Content>
          <Content
            margin="0 0 0.5rem"
            paragraphcolor={colors.gray.sevenHundred}
          >
            <Flexbox
              flex="flex"
              alignitems="center"
            >
              <Icon margin="0 0.5rem 0 0">
                <LinkSimpleHorizontal size="1.25rem" weight="duotone" color={colors.gray.sixHundred} />
              </Icon>
              <p>Saddle stitch binding</p>
            </Flexbox>
          </Content>
          <Content
            paragraphcolor={colors.gray.sevenHundred}
          >
            <Flexbox
              flex="flex"
              alignitems="center"
            >
              <Icon
                margin="0 0.5rem 0 0"
              >
                <Package size="1.25rem" weight="duotone" color={colors.gray.sixHundred} />
              </Icon>
              <p>Always made to order</p>
            </Flexbox>
          </Content>
        </ProductDetails>
      )}
    />
  )
}

export default ProductInfo
