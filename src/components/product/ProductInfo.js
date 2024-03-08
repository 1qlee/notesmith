import React, { useEffect, useState, useRef } from "react"
import { colors,  } from "../../styles/variables"
import { useShoppingCart } from '../cart/context/cartContext'
import { CaretDown } from "@phosphor-icons/react"
import { v4 as uuidv4 } from 'uuid'
import { Tooltip } from "react-tooltip"
import { throttle } from "lodash"
import { isBrowser, formatDollars } from "../../utils/helper-functions"

import Button from "../ui/Button"
import ColorPicker from "../shop/ColorPicker"
import Content from "../ui/Content"
import PageIcons from "../customize/PageIcons"
import { Flexbox } from "../layout/Flexbox"
import { QuantityTracker, SelectWrapper, StyledFieldset, StyledLabel, StyledSelect, SelectIcon, SelectLabel } from "../form/FormComponents"
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
  const discountSelectRef = useRef(null)
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
  let subtotal = calculateSubtotal()

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

  function calculateSubtotal() {
    let price = bookData.price

    if (itemQuantity >= 5 && itemQuantity < 10) {
      price = bookData.price * .95 * itemQuantity
    }
    else if (itemQuantity >= 10 && itemQuantity < 20) {
      price = bookData.price * .9 * itemQuantity
    }
    else if (itemQuantity >= 20) {
      price = bookData.price * .85 * itemQuantity
    }
    else {
      price = bookData.price * itemQuantity
    }

    return formatDollars(price / 100)
  }

  function calculatePrice(quantity) {
    let price = bookData.price

    if (quantity >= 5 && quantity < 10) {
      price = bookData.price * .95
    }
    else if (quantity >= 10 && quantity < 20) {
      price = bookData.price * .9
    }
    else if (quantity >= 20) {
      price = bookData.price * .85
    }

    return formatDollars(price / 100)
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
              pageData = { pageData }
              dimensions = { dimensions }
              max = { max }
              selectedPageSvg = { selectedPageSvg }
              setLeftPageData = { setLeftPageData }
              setPageData = { setPageData }
              setRightPageData = { setRightPageData }
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
        <StyledFieldset
          flex="0"
        >
          <StyledLabel
            htmlFor="quantity-tracker"
          >
            Quantity
          </StyledLabel>
          <QuantityTracker
            id="quantity-tracker"
            buttonwidth="1rem"
            buttonheight="1rem"
            buttonleft="calc(50% - 40px)"
            buttonright="calc(50% - 40px)"
            counterwidth="100px"
            counterpadding="14px"
            counterfontsize="1rem"
            iconsize="0.75rem"
            setItemQuantity={setItemQuantity}
            itemQuantity={itemQuantity}
          />
        </StyledFieldset>
        <StyledFieldset
          margin="0 0 0 16px"
        >
          <StyledLabel>Volume discounts</StyledLabel>
          <SelectWrapper>
            <StyledSelect 
              fontsize="1rem"
              width="100%"
              onChange={(e) => setItemQuantity(+e.target.value)}
              ref={discountSelectRef}
              id="yo"
            >
              <option value={5}>5 - {calculatePrice(5)} each</option>
              <option value={10}>10 - {calculatePrice(10)} each</option>
              <option value={20}>20 - {calculatePrice(20)} each</option>
            </StyledSelect>
            <SelectIcon
              top="20px"
              right="8px"
            >
              <CaretDown size="1rem" />
            </SelectIcon>
            <SelectLabel
              right="32px"
              htmlFor="yo"
            >
              This is a test
            </SelectLabel>
          </SelectWrapper>
        </StyledFieldset>
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
          <h3>{subtotal}</h3>
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
          content="You must choose a page layout first."
          place="top"
          variant="error"
        />
      )}
    </>
  )
}

export default ProductInfo
