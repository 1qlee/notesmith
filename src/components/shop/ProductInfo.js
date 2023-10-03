import React, { useState } from "react"
import { Link } from "gatsby"
import { colors,  } from "../../styles/variables"
import { useShoppingCart } from '../../hooks/useShoppingCart'
import { v4 as uuidv4 } from 'uuid'
import { useFirebaseContext } from "../../utils/auth"
import 'react-tooltip/dist/react-tooltip.css';

import Notification from "../ui/Notification"
import { Flexbox } from "../layout/Flexbox"
import { QuantityTracker, StyledLabel } from "../form/FormComponents"
import Button from "../ui/Button"
import ColorPicker from "./ColorPicker"
import Content from "../ui/Content"
import PageIcons from "../customize/PageIcons"
import ProductInfoBox from "./ProductInfoBox"

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
  // <s><span style={{color: colors.gray.sixHundred}}>${bookData.price / 100}</span></s> ${bookData.preorderPrice / 100}
  const { user } = useFirebaseContext()
  const { addItem } = useShoppingCart()
  const showWarningMsg = !rightPageData.template || !leftPageData.template
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
      {user && (
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
      )}
      {showWarningMsg ? (
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
      ) : (
          <Notification
            backgroundcolor={colors.red.twoHundred}
          >
            <Content
              margin="0 0 0 8px"
              paragraphmargin="0"
              paragraphcolor={colors.red.nineHundred}
              paragraphfontsize="0.875rem"
              linktextdecoration="underline"
            >
              <p>Only users who have been granted early access may purchase notebooks at this time. If you would like to get early access please <Link to="/waitlist">sign up here</Link>.</p>
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
