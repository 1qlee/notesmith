import React, { useState } from "react"
import { Link, navigate } from "gatsby"
import { colors } from "../../styles/variables"
import { useShoppingCart } from 'use-shopping-cart'
import { ArrowRight, CircleNotch } from "phosphor-react"
import { v4 as uuidv4 } from 'uuid'

import { ProductDetails } from "./ShopComponents"
import { QuantityTracker, StyledLabel } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"
import PageIcons from "../customize/PageIcons"
import ColorPicker from "./ColorPicker"
import Notification from "../ui/Notification"
import Icon from "../Icon"
import Button from "../Button"
import Content from "../Content"

const ProductInfo = ({
  bookData,
  cartThumbnail,
  leftPageData,
  rightPageData,
  setBookData,
  selectedTemplate,
  setSelectedTemplate,
  toast,
}) => {
  const { addItem } = useShoppingCart()
  const [loading, setLoading] = useState(false)
  const [itemQuantity, setItemQuantity] = useState(1)

  function handleAddCartButton(bookData) {
    if (!bookData.coverColor) {
      toast.error("Select a cover color.")
    }
    else if (!itemQuantity) {
      toast.error("Enter a quantity.")
    }
    else if (!leftPageData.template) {
      toast.error("Apply a template to left pages.")
    }
    else if (!rightPageData.template) {
      toast.error("Apply a template to right pages.")
    }
    // create a promise to add items to cart then redirect user to cart
    const addItemsToCart = new Promise((resolve, reject) => {
      // use-shopping-cart function to add items to cart
      resolve(
        addItem({
          category: bookData.category,
          coverColor: bookData.coverColor,
          currency: "USD",
          id: uuidv4(), // unique cart item id
          image: cartThumbnail,
          leftPageData: leftPageData,
          name: bookData.name,
          price_id: bookData.stripePriceId,
          price: bookData.price,
          rightPageData: rightPageData,
          slug: bookData.slug,
          weight: bookData.weight,
        }, {count: itemQuantity})
      )
    })

    addItemsToCart.then(res => {
      return navigate("/cart")
    }).catch(error => {
      console.log(error)
    })
  }

  return (
    <ProductDetails>
      <Content
        margin="0 0 1rem"
        paragraphfontsize="1.125rem"
      >
        <Flexbox
          flex="flex"
          justifycontent="space-between"
          alignitems="center"
          margin="0 0 1rem"
        >
          <Content
            margin="0 1rem 0 0"
            h1fontsize="2.5rem"
            h1margin="0"
          >
            <h1>{bookData.name}</h1>
          </Content>
          <Content
            h2fontsize="2.5rem"
            h2fontweight="400"
            h2margin="0"
          >
            <h2>${bookData.price / 100}</h2>
          </Content>
        </Flexbox>
        <p>{bookData.description}</p>
      </Content>
      <Content
        headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
        h3fontsize="0.75rem"
        margin="2rem 0"
      >
        <h3>Cover color</h3>
        <ColorPicker
          data={bookData.colors}
          selectedColor={bookData.coverColor}
          cbFunction={color => setBookData({
            ...bookData,
            coverColor: color,
          })}
        />
      </Content>
      <Content
        headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
        h3fontsize="0.75rem"
        margin="2rem 0 0"
      >
        <h3>Page layout</h3>
      </Content>
      <Flexbox
        flex="flex"
        flexwrap="wrap"
        justifycontent="flex-start"
        alignitems="center"
        margin="0 0 2rem"
      >
        <PageIcons
          checkActiveVar={selectedTemplate.template}
          data={selectedTemplate}
          iconMargin="0 0.5rem"
          isProductPage={true}
          leftPageData={leftPageData}
          rightPageData={rightPageData}
          setData={setSelectedTemplate}
          showLabels={false}
        />
      </Flexbox>
      <Flexbox
        flex="flex"
        margin="0 0 1rem"
        alignitems="flex-end"
      >
        <div>
          <StyledLabel htmlFor="quantity-tracker" margin="0 0 1rem">Quantity</StyledLabel>
          <QuantityTracker
            id="quantity-tracker"
            buttonwidth="1rem"
            buttonheight="1rem"
            counterwidth="100%"
            counterpadding="1rem"
            counterfontsize="0.825rem"
            iconsize="0.625rem"
            setItemQuantity={setItemQuantity}
          />
        </div>
        <Button
          backgroundcolor={colors.primary.sixHundred}
          border={`1px solid ${colors.primary.sixHundred}`}
          className={loading ? "is-loading" : null}
          color={colors.primary.white}
          disabled={loading || !bookData.coverColor || !itemQuantity || !leftPageData.template || !rightPageData.template}
          margin="0 0 0 1rem"
          padding="1rem"
          onClick={() => handleAddCartButton(bookData)}
          width="100%"
        >
          Add to cart
        </Button>
      </Flexbox>
      <Flexbox
        flex="flex"
        alignitems="center"
        margin="0 0 2rem"
      >
        <Content
          paragraphfontsize="0.825rem"
          paragraphcolor={colors.gray.sevenHundred}
        >
          <p>Free shipping for orders over $60</p>
          <p>30 day return policy</p>
        </Content>
      </Flexbox>
      <Notification
        backgroundcolor={colors.white}
        bordercolor={colors.gray.nineHundred}
        margin="0 0 2rem"
        padding="1rem"
      >
        <div>
          <Content
            margin="0 0 1rem"
          >
            <p>Need more control over your page layouts? Use our online editor and gain access to more design tools as well as the ability to edit each page individually!</p>
          </Content>
          <Button
            color={colors.primary.sixHundred}
            className={loading ? "is-loading" : null}
            backgroundcolor={colors.white}
            border={`1px solid ${colors.primary.sixHundred}`}
            disabled={loading}
            as={Link}
            to={`/customize/${bookData.slug}/`}
            padding="1rem"
            width="100%"
          >
            {loading ? (
              <CircleNotch size="1rem" />
            ) : (
              <span>
                Customize page layouts in editor
              </span>
            )}
            <Icon margin="0 0 0 0.5rem">
              <ArrowRight size="1rem" />
            </Icon>
          </Button>
        </div>
      </Notification>
    </ProductDetails>
  )
}

export default ProductInfo
