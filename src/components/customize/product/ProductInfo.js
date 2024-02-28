import React, { useState } from "react"
import { colors,  } from "../../../styles/variables"
import { useShoppingCart } from '../../cart/context/cartContext'
import { applyDiscounts, formatDollars } from "../../../utils/helper-functions"
import { v4 as uuidv4 } from 'uuid'
import { Tooltip } from "react-tooltip"

import Button from "../../ui/Button"
import ColorPicker from "../../shop/ColorPicker"
import Content from "../../ui/Content"
import PageIcons from "../PageIcons"
import { Flexbox } from "../../layout/Flexbox"
import { QuantityTracker, StyledLabel } from "../../form/FormComponents"
import StrikeText from "../../misc/StrikeText"
import ProductQuickControls from "./ProductQuickControls"
import ProductDescription from "./ProductDescription"

const ProductInfo = ({
  cartThumbnail,
  dimensions,
  max,
  toast,
  bookData,
  setBookData,
  pageData,
  setPageData,
  leftPageData,
  setLeftPageData,
  rightPageData,
  setRightPageData,
  selectedPageSvg,
}) => {
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemAdded, setItemAdded] = useState(false)
  let discount = applyDiscounts(bookData.price, +itemQuantity)
  let discountRate = discount.rate || 0
  let discountPrice = discount.price || 0
  let discountSaved = discount.saved || 0
  let discountPct = discount.pct || 0
  let discountAmount = discount.amount || 0

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
      handleItemAdded()
      addItem({
        category: bookData.category,
        coverColor: bookData.coverColor,
        currency: "USD",
        custom: bookData.custom,
        discount: discountSaved,
        id: uuidv4(), // unique cart item id
        image: cartThumbnail,
        leftPageData: leftPageData,
        height: bookData.heightPixel,
        name: bookData.name,
        numOfPages: bookData.numOfPages,
        price_id: bookData.stripePriceId,
        price: discountPrice || bookData.price,
        printed: false,
        originalPrice: bookData.price,
        rightPageData: rightPageData,
        slug: bookData.slug,
        size: bookData.size,
        weight: bookData.weight,
        width: bookData.widthPixel,
      }, { count: itemQuantity })
    }
  }

  function handleHoverCartButton(e) {
    const button = e.target

    if (validateCartButton()) {
      button.disabled = false
    }
    else {
      button.disabled = true
    }
  }

  function validateCartButton() {
    if (!leftPageData.template || !rightPageData.template || !itemQuantity || !bookData.coverColor) {
      return false
    } else {
      return true
    }
  }

  function handleItemAdded() {
    setItemAdded(true)
    setTimeout(() => {
      setItemAdded(false)
    }, 1000)
  }

  return (
    <>
      <Content
        margin="0 0 16px 0"
        h1fontsize="3rem"
      >
        <h1>{bookData.name}</h1>
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
        justify="space-between"
        margin="0 0 16px"
      >
        <Content
          h5fontweight="700"
          h5margin="0 0 8px"
        >
          <h5>Page layout</h5>
        </Content>
        {pageData.template && (
          <Content
            linktextdecoration="underline"
          >
            <a
              align="center"
              fontweight="400"
              onClick={() => setPageData({
                ...pageData,
                show: !pageData.show,
              })}
            >
              {pageData.show ? (
                "Back to images"
              ) : (
                "Back to template"
              )}
            </a>
          </Content>
        )}
      </Flexbox>
      <Flexbox
        flex="flex"
        flexwrap="wrap"
        justify="flex-start"
        align="center"
      >
        <PageIcons
          checkActiveVar={pageData.template}
          data={pageData}
          iconMargin="0 24px 24px 0"
          isProductPage={true}
          hideNone
          leftPageData={leftPageData}
          rightPageData={rightPageData}
          setLeftPageData={setLeftPageData}
          setRightPageData={setRightPageData}
          setData={setPageData}
          selectedPageSvg={selectedPageSvg}
          showLabels={false}
        />
      </Flexbox>
      {(pageData.template && pageData.template !== "blank") && (
        <ProductQuickControls 
          pageData={pageData}
          dimensions={dimensions}
          max={max}
          selectedPageSvg={selectedPageSvg}
          setPageData={setPageData}
        />
      )}
      <Flexbox
        flex="flex"
        justify="space-between"
      >
        <StyledLabel
          htmlFor="quantity-tracker"
          margin="0 0 8px"
          fontsize="1rem"
          fontweight="700"
        >
          Quantity
        </StyledLabel>
      </Flexbox>
      <Flexbox
        flex="flex"
        margin="0 0 16px"
      >
        <QuantityTracker
          id="quantity-tracker"
          buttonwidth="1rem"
          buttonheight="1rem"
          counterwidth="100%"
          counterpadding="14px"
          counterfontsize="1rem"
          iconsize="0.75rem"
          setItemQuantity={setItemQuantity}
        />
        <Button
          backgroundcolor={colors.gray.nineHundred}
          border={`1px solid ${colors.gray.nineHundred}`}
          color={colors.gray.oneHundred}
          id="cart-button"
          margin="0 0 0 1rem"
          padding="1rem"
          onClick={() => handleAddCartButton(bookData)}
          disabled={!validateCartButton()}
          width="100%"
        >
          {itemAdded ? (
            <span>Added to cart!</span>
          ) : (
              <span>Add to cart - <StrikeText>{formatDollars(bookData.price / 100)}</StrikeText>{formatDollars(discountAmount / 100)}</span>
          )}
        </Button>
      </Flexbox>
      <Content
        paragraphfontsize="0.875rem"
        margin="32px 0 16px"
      >
        <p>{bookData.longDescription}</p>
      </Content>
      <ProductDescription 
        bookData={bookData}
      />
      <Tooltip 
        anchorSelect="#discount-text"
        content={`${discountPct}% discount.`}
        place="top"
        variant="success"
        style={{backgroundColor: colors.green.sixHundred}}
      />
      {!validateCartButton() && (
        <Tooltip
          anchorSelect="#cart-button"
          content="You must choose a page layout first."
          place="top"
          variant="error"
        />
      )}
    </>
  )
}

export default ProductInfo
