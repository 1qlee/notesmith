import React, { useState } from "react"
import { StaticQuery, graphql, navigate } from "gatsby"
import { colors, spacing } from "../../styles/variables"
import { useShoppingCart } from 'use-shopping-cart'
import { CaretDown, PenNib, File, Book, LinkSimpleHorizontal, Truck, Package } from "phosphor-react"
import Loading from "../../assets/loading.svg"

import { ProductDetails } from "./ShopComponents"
import { QuantityTracker, StyledFieldset, StyledLabel } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"
import { Grid, Cell } from "styled-css-grid"
import Tag from "../ui/Tag"
import Icon from "../Icon"
import Button from "../Button"
import Content from "../Content"

const ProductInfo = ({ bookData, setBookData }) => {
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const calculateTotalPrice = (price) => {
    const totalPrice = (itemQuantity * price) / 100

    if (totalPrice) {
      return (
        <span>${totalPrice} -&nbsp;</span>
      )
    }
  }

  const handleButtonSubmit = e => {
    e.preventDefault()
    setLoading(true)

    navigate("/customize/notebook", {
      state: {
        quantity: itemQuantity,
        size: bookData.size,
        dimensions: bookData.dimensions,
        width: bookData.width,
        height: bookData.height,
        numOfPages: bookData.numOfPages,
      }
    })
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
                h5fontsize="0.625rem"
                h5color={colors.gray.nineHundred}
                h5margin="0 0 0.5rem 0"
              >
                <h5>Size</h5>
                <p>5.5" x 8.5" (A5)</p>
              </Content>
              <Content
                h5fontsize="0.625rem"
                h5color={colors.gray.nineHundred}
                h5margin="0 0 0.5rem 0"
              >
                <h5>Pages</h5>
                <p>48 total</p>
              </Content>
              <Content
                h5fontsize="0.625rem"
                h5color={colors.gray.nineHundred}
                h5margin="0 0 0.5rem 0"
              >
                <h5>Cover</h5>
                <p>Forest green</p>
              </Content>
              <Content
                h5fontsize="0.625rem"
                h5color={colors.gray.nineHundred}
                h5margin="0 0 0.5rem 0"
              >
                <h5>Binding</h5>
                <p>Saddle stitched</p>
              </Content>
            </Flexbox>
          </Flexbox>
          <Flexbox
            flex="flex"
            margin="0 0 1rem"
          >
            <QuantityTracker
              buttonwidth="1rem"
              buttonheight="1rem"
              counterwidth="2rem"
              counterpadding="0.25rem"
              counterfontsize="0.825rem"
              iconsize="0.625rem"
              wrapperpadding="0.5rem 1rem"
              wrapperboxshadow={`0 1px 2px ${colors.shadow.float}`}
              setItemQuantity={setItemQuantity}
            />
            <Button
              backgroundcolor={colors.primary.sixHundred}
              color={colors.primary.white}
              className={loading ? "is-loading" : null}
              disabled={loading}
              margin="0 0 0 1rem"
              padding="1rem"
              width="100%"
              onClick={e => handleButtonSubmit(e)}
            >
              {loading ? (
                <Loading height="1rem" width="1rem" />
              ) : (
                <span>
                  {calculateTotalPrice(data.stripePrice.unit_amount)} Customize layouts
                </span>
              )}
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
