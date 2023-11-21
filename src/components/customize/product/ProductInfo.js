import React, { useState } from "react"
import { colors,  } from "../../../styles/variables"
import { useShoppingCart } from '../../../hooks/useShoppingCart'
import { formatDollars } from "../../../utils/helper-functions"
import { v4 as uuidv4 } from 'uuid'
import { useFirebaseContext } from "../../../utils/auth"
import { Tooltip } from "react-tooltip"

import Button from "../../ui/Button"
import ColorPicker from "../../shop/ColorPicker"
import Content from "../../ui/Content"
import Icon from "../../ui/Icon"
import Notification from "../../ui/Notification"
import PageIcons from "../PageIcons"
import TextLink from "../../ui/TextLink"
import { Flexbox } from "../../layout/Flexbox"
import { Info } from "@phosphor-icons/react"
import { Link } from "gatsby"
import { QuantityTracker, StyledLabel } from "../../form/FormComponents"

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
  const { user } = useFirebaseContext()
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemAdded, setItemAdded] = useState(false)
  let discount = applyDiscounts(bookData.price, +itemQuantity)
  let discountRate = discount.rate || 0
  let discountPrice = discount.price || 0
  let discountSaved = discount.saved || 0
  let discountPct = discount.pct || 0
  let discountAmount = discount.amount || 0

  function applyDiscounts(price, quantity) {
    let totalAmount = price * quantity
    let discountRate = 0.25
    let discountPrice = price * (1 - discountRate)
    let discountPct = discountRate * 100
    let discountAmount = discountPrice * quantity
    let discountSaved = totalAmount * discountRate

    // if (itemQuantity > 1 && itemQuantity < 10) {
    //   discount = 0.10
    // } else if (itemQuantity >= 10 && itemQuantity < 20) {
    //   discount = 0.15
    // } else if (itemQuantity >= 20) {
    //   discount = 0.20
    // }

    return {
      price: discountPrice,
      saved: discountSaved,
      amount: discountAmount,
      pct: discountPct,
      rate: discountRate,
    }
  }

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
        justify="space-between"
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
              "Back to editing"
            )}
          </a>
        </Content>
      </Flexbox>
      <Flexbox
        flex="flex"
        flexwrap="wrap"
        justify="flex-start"
        align="center"
        margin="0 0 16px"
      >
        <PageIcons
          checkActiveVar={pageData.template}
          data={pageData}
          iconMargin="0 24px 24px 0"
          isProductPage={true}
          hideNone
          leftPageData={leftPageData}
          rightPageData={rightPageData}
          setData={setPageData}
          showLabels={false}
        />
      </Flexbox>
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
        {discountSaved !== 0 && (
          <Content
            paragraphmargin="0 0 8px"
            paragraphcolor={colors.green.sixHundred}
            paragraphfontweight="700"
          >
            <p id="discount-text">{formatDollars(discountSaved / 100)} off.</p>
          </Content>
        )}
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
          counterpadding="1rem"
          counterfontsize="1rem"
          iconsize="0.625rem"
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
            <span>Add to cart - {formatDollars(discountAmount / 100)}</span>
          )}
        </Button>
      </Flexbox>
      <Notification
        backgroundcolor={colors.yellow.twoHundred}
      >
        <Icon
          className="is-pulsating"
          margin="2px 0 0"
          pulseColor={colors.yellow.sixHundred}
        >
          <Info
            color={colors.yellow.nineHundred}
            size={20}
          />
        </Icon>
        <Content
          margin="0 0 0 8px"
          paragraphmargin="0"
          paragraphcolor={colors.yellow.nineHundred}
          paragraphfontsize="1rem"
        >
          {user ? (
            <p>You can access more advanced editing features when you create a book from your <Link to="/account/books"><TextLink color={colors.yellow.nineHundred}>accounts page</TextLink></Link>.</p>
          ) : (
            <p>Sign up for a Notesmith account and get access to more advanced customization features.</p>
          )}
        </Content>
      </Notification>
      <Tooltip 
        anchorSelect="#discount-text"
        content={`${discountPct}% discount.`}
        place="top"
        variant="success"
      />
      {!validateCartButton() && (
        <Tooltip
          anchorSelect="#cart-button"
          content="You must apply templates to both left and right pages before adding to cart."
          place="top"
          variant="error"
        />
      )}
    </>
  )
}

export default ProductInfo
