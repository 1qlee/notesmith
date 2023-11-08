import React, { useState } from "react"
import { colors,  } from "../../../styles/variables"
import { useShoppingCart } from '../../../hooks/useShoppingCart'
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
  const usdPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(bookData.price / 100)
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemAdded, setItemAdded] = useState(false)

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
          hideNone
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
          id="cart-button"
          margin="0 0 0 1rem"
          padding="1rem"
          onClick={() => handleAddCartButton(bookData)}
          onMouseOver={(e) => handleHoverCartButton(e)}
          width="100%"
        >
          {itemAdded ? (
            <span>Done!</span>
          ) : (
            <span>Add to cart - {usdPrice}</span>
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
