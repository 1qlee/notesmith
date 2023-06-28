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
  setPageData,
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
      addItem({
        category: bookData.category,
        coverColor: bookData.coverColor,
        currency: "USD",
        custom: bookData.custom,
        id: uuidv4(), // unique cart item id
        image: cartThumbnail,
        leftPageData: leftPageData,
        height: bookData.heightPixel,
        name: bookData.name,
        numOfPages: bookData.numOfPages,
        price_id: bookData.stripePreorderPriceId,
        price: bookData.preorderPrice,
        printed: false,
        rightPageData: rightPageData,
        slug: bookData.slug,
        size: bookData.size,
        weight: bookData.weight,
        width: bookData.widthPixel,
      }, { count: itemQuantity })
    }
  }

  return (
    <>
      <Content
        margin="0 0 16px 0"
        h1fontsize="3rem"
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
          headingfontfamily={fonts.secondary}
        >
          <h2><s><span style={{color: colors.gray.sixHundred}}>${bookData.price / 100}</span></s> ${bookData.preorderPrice / 100}</h2>
        </Content>
        <Tag
          backgroundcolor={colors.white}
          border={colors.borders.black}
          color={colors.gray.nineHundred}
          margin="0 0 0 8px"
        >
          Pre-order price (25% off)
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
        h5fontweight="700"
        h5margin="0 0 8px"
      >
        <h5>Cover color</h5>
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
        <Content
          h5fontweight="700"
          h5margin="0 0 8px"
        >
          <h5>Page layout</h5>
        </Content>
        <Content
          linktextdecoration="underline"
        >
          <a
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
          </a>
        </Content>
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
            margin="0 0 8px"
            fontsize="1rem"
            fontweight="700"
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
          <Content
            margin="0 0 0 8px"
            paragraphmargin="0"
            paragraphcolor={colors.red.nineHundred}
            paragraphfontsize="0.875rem"
          >
            <p>You must apply a template to both page sides in order to add this item to your cart. Click on a page layout above and use the controls to apply them accordingly.</p>
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
