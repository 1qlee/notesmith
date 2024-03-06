import React, { useEffect, useState, useRef } from "react"
import { colors,  } from "../../styles/variables"
import { useShoppingCart } from '../cart/context/cartContext'
import { v4 as uuidv4 } from 'uuid'
import { Tooltip } from "react-tooltip"
import { throttle } from "lodash"
import { isBrowser, formatDollars } from "../../utils/helper-functions"

import Button from "../ui/Button"
import ColorPicker from "../shop/ColorPicker"
import Content from "../ui/Content"
import PageIcons from "../customize/PageIcons"
import { Flexbox } from "../layout/Flexbox"
import { QuantityTracker, StyledLabel } from "../form/FormComponents"
import ProductQuickControls from "./ProductQuickControls"
import ProductDescription from "./ProductDescription"
import Tag from "../ui/Tag"

const ProductInfoLabel = ({ number, label, margin }) => {
  return (
    <Flexbox
      align="flex-end"
      margin={margin || "0"}
      gap="8px"
    >
      <Tag
        fontweight="400"
      >
        {number}
      </Tag>
      <Content
        margin="0"
        h5fontweight="700"
        h5margin="0"
        headinglineheight="1"
      >
        <h5>{label}</h5>
      </Content>
    </Flexbox>
  )
}

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
  const cartButtonRef = useRef(null)
  const { addItem, handleCartClick, shouldDisplayCart } = useShoppingCart()
  const [buttonFixed, setButtonFixed] = useState(false)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemAdded, setItemAdded] = useState(false)
  const fixedButtonStyle = {
    position: buttonFixed && "fixed",
    bottom: buttonFixed && "0",
    right: buttonFixed && "0",
    borderRadius: buttonFixed && "0",
    margin: buttonFixed && "0",
    zIndex: buttonFixed && 49,
  }

  useEffect(() => {
    if (isBrowser()) {
      const isNodeInViewport = (node) => {
        var rect = node.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }

      const handleScroll = throttle(() => {
        const cartNode = cartButtonRef.current

        if (document.documentElement.clientWidth < 767 && !isNodeInViewport(cartNode) && !buttonFixed) {
          setButtonFixed(true)
        }
        else {
          setButtonFixed(false)
        }
      }, 50)


      document.addEventListener('scroll', handleScroll)
    }
  }, []) 

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
        id: uuidv4(), // unique cart item id
        image: cartThumbnail,
        leftPageData: leftPageData,
        height: bookData.heightPixel,
        name: bookData.name,
        numOfPages: bookData.numOfPages,
        price_id: bookData.stripePriceId,
        price: bookData.price,
        printed: false,
        originalPrice: bookData.price,
        rightPageData: rightPageData,
        slug: bookData.slug,
        size: bookData.size,
        weight: bookData.weight,
        width: bookData.widthPixel,
      }, { count: itemQuantity })

      if (!shouldDisplayCart) {
        handleCartClick()
      }
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
      <ProductInfoLabel
        label="Select cover color"
        number="1"
      />
      <ColorPicker
        data={bookData.colors}
        selectedColor={bookData.coverColor}
        cbFunction={color => setBookData({
          ...bookData,
          coverColor: color,
        })}
      />
      <ProductInfoLabel
        label="Select layout"
        margin="0 0 16px"
        number="2"
      />
      <PageIcons
        checkActiveVar={pageData.template}
        data={pageData}
        iconMargin="0"
        isProductPage={true}
        hideNone
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setPageData}
        selectedPageSvg={selectedPageSvg}
        showLabels={true}
      />
      {pageData.template && (
        <Flexbox
          justify="space-between"
          align="center"
          margin="0 0 16px"
        >
          {pageData.template !== "blank" && (
            <ProductInfoLabel
              label="Adjust template"
              number="3"
            />
          )}
          {pageData.show && (
            <Button
              padding="4px 8px"
              backgroundcolor={colors.white}
              color={colors.gray.nineHundred}
              border={colors.borders.black}
              fontsize="0.75rem"
              onClick={() => setPageData({
                ...pageData,
                showControls: !pageData.showControls,
              })}
            >
              {pageData.showControls ? "Hide" : "Advanced"} options
            </Button>
          )}
        </Flexbox>
      )}
      {(pageData.template && pageData.template !== "blank") && (
        <ProductQuickControls 
          pageData={pageData}
          dimensions={dimensions}
          max={max}
          selectedPageSvg={selectedPageSvg}
          setLeftPageData={setLeftPageData}
          setPageData={setPageData}
          setRightPageData={setRightPageData}
        />
      )}
      <ProductInfoLabel
        label="Set quantity"
        number={pageData.template ? "4" : "3"}
        margin="0 0 16px"
      />
      <StyledLabel
        htmlFor="quantity-tracker"
      >
        Quantity
      </StyledLabel>
      <Flexbox
        flex="flex"
        margin="0 0 16px"
        ref={cartButtonRef}
      >
        <QuantityTracker
          id="quantity-tracker"
          buttonwidth="1rem"
          buttonheight="1rem"
          buttonleft="calc(50% - 40px)"
          buttonright="calc(50% - 40px)"
          counterwidth="100%"
          counterpadding="14px"
          counterfontsize="1rem"
          iconsize="0.75rem"
          setItemQuantity={setItemQuantity}
          wrapperwidth="100%"
          wrapperminwidth="100px"
        />
      </Flexbox>
      <Button
        backgroundcolor={colors.gray.nineHundred}
        border={`1px solid ${colors.gray.nineHundred}`}
        color={colors.gray.oneHundred}
        id="cart-button"
        padding="1rem"
        onClick={() => handleAddCartButton(bookData)}
        disabled={!validateCartButton()}
        width="100%"
        style={fixedButtonStyle}
      >
        {itemAdded ? (
          <span>Added to cart!</span>
        ) : (
          <span>Add to cart - {formatDollars((itemQuantity * bookData.price) / 100)}</span>
        )}
      </Button>
      <Content
        paragraphfontsize="0.875rem"
        margin="32px 0 16px"
      >
        <p>{bookData.longDescription}</p>
      </Content>
      <ProductDescription 
        bookData={bookData}
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
