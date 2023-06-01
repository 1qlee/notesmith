import React, { useState } from "react"
import { navigate } from "gatsby"
import { colors, fonts } from "../../styles/variables"
import { useShoppingCart } from 'use-shopping-cart'
import { v4 as uuidv4 } from 'uuid'
import 'react-tooltip/dist/react-tooltip.css';
import { WarningCircle } from "phosphor-react"
import Notification from "../ui/Notification"

import Icon from "../ui/Icon"
import { Flexbox } from "../layout/Flexbox"
import { QuantityTracker, StyledLabel } from "../form/FormComponents"
import Button from "../ui/Button"
import ColorPicker from "./ColorPicker"
import Content from "../ui/Content"
import PageIcons from "../customize/PageIcons"
import ProductInfoBox from "./ProductInfoBox"
import TextLink from "../ui/TextLink"
import Tag from "../ui/Tag"

const ProductInfo = ({
  bookData,
  cartThumbnail,
  leftPageData,
  pageData,
  rightPageData,
  setBookData,
  setLeftPageData,
  setPageData,
  setRightPageData,
  toast,
}) => {
  const showWarningMsg = !rightPageData.template || !leftPageData.template
  const { addItem } = useShoppingCart()
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
    else {
      // create a promise to add items to cart then redirect user to cart
      const addItemsToCart = new Promise((resolve, reject) => {
        // use-shopping-cart function to add items to cart
        resolve(
          addItem({
            category: bookData.category,
            coverColor: bookData.coverColor,
            currency: "USD",
            custom: false,
            id: uuidv4(), // unique cart item id
            image: cartThumbnail,
            leftPageData: leftPageData,
            name: bookData.name,
            price_id: bookData.stripePreorderPriceId,
            price: bookData.preorderPrice,
            rightPageData: rightPageData,
            slug: bookData.slug,
            weight: bookData.weight,
          }, { count: itemQuantity })
        )
      })

      addItemsToCart.then(res => {
        return navigate("/cart")
      }).catch(error => {
        console.log(error)
      })
    }
  }

  return (
    <>
      <Content
        margin="0 0 16px 0"
        h1fontsize="3rem"
        h1fontweight="700"
      >
        <h1>{bookData.name}</h1>
      </Content>
      <Flexbox
        alignitems="center"
        margin="0 0 32px"
      >
        <Content
          h2fontsize="2rem"
          h2fontweight="400"
          h2margin="0"
        >
          <h2><s><span>${bookData.price / 100}</span></s> ${bookData.preorderPrice / 100}</h2>
        </Content>
        <Tag
          backgroundcolor={colors.yellow.threeHundred}
          color={colors.yellow.nineHundred}
          margin="0 0 0 8px"
        >
          Pre-order price
        </Tag>
      </Flexbox>
      <Content
        paragraphfontsize="1.25rem"
        margin="0 0 32px"
      >
        <p>{bookData.description}</p>
      </Content>
      <Content
        margin="32px 0"
      >
        <p>Cover color</p>
        <ColorPicker
          data={bookData.colors}
          selectedColor={bookData.coverColor}
          cbFunction={color => setBookData({
            ...bookData,
            coverColor: color,
          })}
        />
      </Content>
      <Flexbox
        justifycontent="space-between"
        margin="0 0 16px"
      >
        <Content>
          <p>Page layout</p>
        </Content>
        <TextLink
          alignitems="center"
          fontweight="400"
          onClick={() => setPageData({
            ...pageData,
            show: !pageData.show,
          })}
        >
          {pageData.show ? (
            "Back to images"
          ) : (
            "Back to editing"
          )}
        </TextLink>
      </Flexbox>
      <Flexbox
        flex="flex"
        flexwrap="wrap"
        justifycontent="flex-start"
        alignitems="center"
        margin="0 0 16px"
      >
        <PageIcons
          checkActiveVar={pageData.template}
          data={pageData}
          iconMargin="0 24px 24px 0"
          isProductPage={true}
          leftPageData={leftPageData}
          rightPageData={rightPageData}
          setData={setPageData}
          showLabels={false}
        />
      </Flexbox>
      <Flexbox
        flex="flex"
        alignitems="flex-end"
        margin="0 0 16px"
      >
        <div>
          <StyledLabel 
            htmlFor="quantity-tracker" 
            margin="0 0 1rem"
            fontfamily={fonts.primary}
            fontsize="1rem"
            fontweight="400"
          >
            Quantity
          </StyledLabel>
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
          backgroundcolor={colors.gray.nineHundred}
          border={`1px solid ${colors.gray.nineHundred}`}
          color={colors.gray.oneHundred}
          disabled={!bookData.coverColor || !itemQuantity || !leftPageData.template || !rightPageData.template}
          margin="0 0 0 1rem"
          padding="1rem"
          onClick={() => handleAddCartButton(bookData)}
          width="100%"
        >
          Add to cart
        </Button>
      </Flexbox>
      {showWarningMsg && (
        <Notification
          backgroundcolor={colors.red.twoHundred}
        >
          <Icon>
            <WarningCircle size={16} color={colors.red.nineHundred} />
          </Icon>
          <Content
            margin="0 0 0 8px"
            smallmargin="0"
            smallcolor={colors.red.nineHundred}
          >
            <small>You must apply a template to both page sides in order to add this item to your cart. Click on a page layout above and use the controls to apply them accordingly.</small>
          </Content>
        </Notification>
      )}
      {bookData.infoBoxes.map((box, index) => (
        <ProductInfoBox 
          heading={box.heading}
          text={box.text}
          key={index}
        />
      ))}
    </>
  )
}

export default ProductInfo
