import React, { useState } from "react"
import { colors } from "../../../styles/variables"
import { useShoppingCart } from 'use-shopping-cart'
import { useFirebaseContext } from "../../../utils/auth"
import { navigate } from "gatsby"
import { CircleNotch } from "phosphor-react"

import { Flexbox } from "../../layout/Flexbox"
import { QuantityTracker } from "../../form/FormComponents"
import { ControlsContent, ControlsFooter } from "../Controls"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"
import ColorPicker from "../../shop/ColorPicker"

function Checkoutbar({
  bookData,
  pageData,
  productData,
  productImageData,
  setBookData,
  toast,
}) {
  const { firebaseDb } = useFirebaseContext()
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  async function handleCheckoutButton(book, coverColor) {
    setLoading(true)
    // create a promise to add items to cart then redirect user to cart
    await addItem({
      name: book.name,
      description: book.description,
      id: book.stripePriceId,
      price: book.price,
      currency: "USD",
      coverColor: coverColor,
      images: productImageData,
    }, { count: itemQuantity })
    .then(async () => {
      await updateBookCoverColor(coverColor)
      setLoading(false)
      return navigate("/cart")
    }).catch(error => {
      toast.error("Something went wrong! Please try again.")
    })
  }

  const calculateTotalPrice = (price, dash) => {
    const totalPrice = (itemQuantity * price) / 100

    if (totalPrice && dash) {
      return (
        <span>${totalPrice} -&nbsp;</span>
      )
    }
    else {
      return (
        <span>${totalPrice}</span>
      )
    }
  }

  async function updateBookCoverColor(color) {
    const updates = {}
    // update the specified book by its bookId
    // only updates the title field
    updates[`/books/${bookData.id}/coverColor`] = color

    await firebaseDb.ref().update(updates, error => {
      if (error) {
        console.log("Error occurred when updating book title.")
      }
    })
  }

  return (
    <>
      <ControlsContent>
        <Flexbox
          flex="flex"
          flexwrap="wrap"
          justifycontent="space-between"
          alignitems="center"
          margin="0 0 1rem"
        >
          <Content
            padding="0"
            margin="0"
            h3fontsize="1rem"
            h3margin="0 0 0.25rem"
          >
            <h3>Type</h3>
            <p>{bookData.name}</p>
          </Content>
          <Content
            padding="0"
            margin="0"
            h5fontsize="0.625rem"
            h5margin="0 0 0.25rem"
            paragraphcolor={colors.primary.threeHundred}
            paragraphfontweight="500"
          >
            <h5>Size</h5>
            <p>{`${bookData.widthInch}" x ${bookData.heightInch}" (${bookData.size})`}</p>
          </Content>
        </Flexbox>
        <Flexbox
          flex="flex"
          flexwrap="wrap"
          justifycontent="space-between"
          alignitems="center"
          margin="0 0 1rem"
        >
          <Content
            padding="0"
            margin="0"
            h5fontsize="0.625rem"
            h5margin="0 0 0.5rem"
          >
            <h5>Cover</h5>
            <ColorPicker
              data={productData.colors}
              selectedColor={bookData.coverColor}
              cbFunction={color => setBookData({
                ...bookData,
                coverColor: color,
              })}
            />
          </Content>
        </Flexbox>
        <Flexbox
          flex="flex"
          flexwrap="wrap"
          justifycontent="space-between"
          alignitems="center"
          margin="0 0 1rem"
        >
          <Content
            padding="0"
            margin="0"
            h5fontsize="0.625rem"
            h5margin="0 0 0.25rem"
            paragraphcolor={colors.primary.threeHundred}
            paragraphfontweight="500"
          >
            <h5>Pages</h5>
            <p>{bookData.numOfPages} total</p>
          </Content>
        </Flexbox>
        <Flexbox
          flex="flex"
          alignitems="center"
          justifycontent="space-between"
          margin="0.5rem 0"
          padding="0 0 2rem 0"
          className="has-border-bottom"
          bordercolor={colors.gray.threeHundred}
        >
          <Content
            padding="0"
            margin="0"
            h5fontsize="0.625rem"
            h5margin="0 0 0.5rem"
            paragraphcolor={colors.primary.threeHundred}
            paragraphfontweight="500"
          >
            <h5>Quantity</h5>
            <QuantityTracker
              buttonwidth="1rem"
              buttonheight="1rem"
              counterwidth="6rem"
              counterfontsize="0.825rem"
              iconsize="0.625rem"
              setItemQuantity={setItemQuantity}
              counterpadding="0.5rem"
            />
          </Content>
        </Flexbox>
        <Flexbox
          flex="flex"
          alignitems="flex-end"
          justifycontent="space-between"
          margin="0.5rem 0"
        >
          <Content
            padding="0"
            margin="0"
            h4margin="0"
            h4fontweight="400"
          >
            <h4>Subtotal</h4>
          </Content>
          <Content
            padding="0"
            margin="0"
            h3margin="0"
            h3fontweight="400"
            h3color={colors.primary.sixHundred}
          >
            <h3>{calculateTotalPrice(productData.price)}</h3>
          </Content>
        </Flexbox>
      </ControlsContent>
      <ControlsFooter>
        <Button
          backgroundcolor={colors.gray.nineHundred}
          color={colors.gray.oneHundred}
          padding="1rem"
          width="100%"
          disabled={loading}
          className={loading ? "is-loading" : null}
          onClick={() => handleCheckoutButton(productData, bookData.coverColor)}
        >
          {loading ? (
            <Icon width="3rem">
              <CircleNotch size="1rem" />
            </Icon>
          ) : (
            "Add to cart"
          )}
        </Button>
      </ControlsFooter>
    </>
  )
}

export default Checkoutbar
