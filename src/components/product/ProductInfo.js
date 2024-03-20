import React, { useEffect, useState, useRef } from "react"
import { colors  } from "../../styles/variables"
import { useShoppingCart } from '../cart/context/cartContext'
import { v4 as uuidv4 } from 'uuid'
import { Tooltip } from "react-tooltip"
import { throttle } from "lodash"
import { isBrowser } from "../../utils/helper-functions"

import Button from "../ui/Button"
import ColorPicker from "../shop/ColorPicker"
import Content from "../ui/Content"
import PageIcons from "../customize/PageIcons"
import { Flexbox } from "../layout/Flexbox"
import ProductQuickControls from "./ProductQuickControls"
import ProductDescription from "./ProductDescription"
import Tag from "../ui/Tag"
import VolumeQuantitySelect from "../shop/VolumeQuantitySelect"

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
}) => {
  const cartButtonRef = useRef(null)
  const { addItem, handleCartClick, shouldDisplayCart } = useShoppingCart()
  const [buttonFixed, setButtonFixed] = useState(false)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [volumeQuantity, setVolumeQuantity] = useState(0)
  const [formattedSubtotal, setFormattedSubtotal] = useState("$30.00")
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

      return () => {
        document.removeEventListener('scroll', handleScroll)
      }
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
        camelName: bookData.camelName,
        category: bookData.category,
        coverColor: bookData.coverColor,
        currency: "USD",
        custom: bookData.custom,
        discounts: {
          type: bookData.discount,
        },
        height: bookData.heightPixel,
        id: uuidv4(), // unique cart item id
        image: cartThumbnail,
        leftPageData: leftPageData,
        name: bookData.name,
        numOfPages: bookData.numOfPages,
        price: bookData.price,
        price_id: bookData.stripePriceId,
        printed: false,
        rightPageData: rightPageData,
        size: bookData.size,
        slug: bookData.slug,
        weight: bookData.weight,
        width: bookData.widthPixel,
      }, { count: itemQuantity })

      if (!shouldDisplayCart) {
        handleCartClick()
      }
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
              backgroundcolor={colors.white}
              border={colors.borders.black}
              color={colors.gray.nineHundred}
              fontsize="0.75rem"
              id="show-controls"
              padding="4px 8px"
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
        <>
          {pageData.showControls ? (
            <Content
              margin="0 0 16px"
            >
              <p>Showing advanced options...</p>
            </Content>
          ) : (
            <ProductQuickControls
              pageData={pageData}
              dimensions={dimensions}
              max={max}
              setLeftPageData={setLeftPageData}
              setPageData={setPageData}
              setRightPageData={setRightPageData}
            />
          )}
        </>
      )}
      <ProductInfoLabel
        label="Set quantity"
        number={pageData.template ? "4" : "3"}
        margin="0 0 16px"
      />
      <Flexbox
        flex="flex"
        margin="0 0 16px"
        ref={cartButtonRef}
      >
        <VolumeQuantitySelect
          volumeQuantity={volumeQuantity}
          setVolumeQuantity={setVolumeQuantity}
          itemQuantity={itemQuantity}
          setItemQuantity={setItemQuantity}
          setSubtotal={setFormattedSubtotal}
          bookData={bookData}
        />
      </Flexbox>
      <Flexbox
        align="flex-end"
        justify="space-between"
        margin="0 0 16px"
      >
        <Content
          pargraphmargin="0"
          paragraphlineheight="1"
          paragraphfontweight="700"
          margin="0 8px 0 0"
        >
          <p>Subtotal</p>
        </Content>
        <Content
          h3margin="0"
          headinglineheight="1"
          h3fontsize="1.25rem"
          h3fontweight="400"
        >
          <h3>
            {formattedSubtotal}
          </h3>
        </Content>
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
          <span>Add to cart</span>
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
          content="You must select a layout first."
          place="top"
          variant="error"
        />
      )}
    </>
  )
}

export default ProductInfo
