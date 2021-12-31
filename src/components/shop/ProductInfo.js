import React, { useState } from "react"
import { StaticQuery, graphql, navigate } from "gatsby"
import { colors, spacing } from "../../styles/variables"
import { useShoppingCart } from 'use-shopping-cart'
import { CaretDown, PenNib, File, Book, LinkSimpleHorizontal, Truck, Package } from "phosphor-react"
import Loading from "../../assets/loading.svg"

import { ProductDetails } from "./ShopComponents"
import { QuantityTracker, StyledFieldset, StyledLabel, SelectWrapper, StyledSelect, SelectIcon } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"
import { Grid, Cell } from "styled-css-grid"
import Tag from "../ui/Tag"
import Icon from "../Icon"
import Button from "../Button"
import Content from "../Content"

const ProductInfo = ({ bookData, stripeData }) => {
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = ""
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
    <ProductDetails>
      <Content
        h1fontsize="2.5rem"
        h2fontsize="2rem"
        h2fontweight="400"
        h1margin="0"
        h2margin="0"
        margin="0 0 1rem"
        paragraphfontsize="1.125rem"
      >
        <Flexbox
          flex="flex"
          alignitems="center"
          justifycontent="space-between"
          margin="0 0 1rem"
        >
          <Flexbox
            margin="0 1rem 0 0"
          >
            <h1>{stripeData.product.name}</h1>
          </Flexbox>
          <Flexbox>
            <h2>${stripeData.unit_amount / 100}</h2>
          </Flexbox>
        </Flexbox>
        <p>{stripeData.product.description}</p>
      </Content>
      <Flexbox
        margin="2rem 0"
      >
        <Flexbox
          flex="flex"
          justifycontent="space-between"
        >
          <Content
            h5fontsize="0.625rem"
            h5color={colors.primary.eightHundred}
            h5margin="0 0 0.25rem 0"
          >
            <h5>Size</h5>
            <p>{`${bookData.width}" x ${bookData.height}" (${bookData.size})`}</p>
          </Content>
          <Content
            h5fontsize="0.625rem"
            h5color={colors.primary.eightHundred}
            h5margin="0 0 0.25rem 0"
          >
            <h5>Pages</h5>
            <p>{bookData.numOfPages} pages</p>
          </Content>
          <Content
            h5fontsize="0.625rem"
            h5color={colors.primary.eightHundred}
            h5margin="0 0 0.25rem 0"
          >
            <h5>Paper</h5>
            <p>{`${bookData.paperColor}, ${bookData.paperWeight} `}</p>
          </Content>
          <Content
            h5fontsize="0.625rem"
            h5color={colors.primary.eightHundred}
            h5margin="0 0 0.25rem 0"
          >
            <h5>Paper Tooth</h5>
            <p>{bookData.paperTooth}</p>
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
          counterwidth="100%"
          counterpadding="1rem"
          counterfontsize="0.825rem"
          iconsize="0.625rem"
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
              {calculateTotalPrice(stripeData.unit_amount)} Customize layouts
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
  )
}

export default ProductInfo
