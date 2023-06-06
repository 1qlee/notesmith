import React, { useState } from "react"
import { colors, fonts } from "../../../styles/variables"
import { useShoppingCart } from 'use-shopping-cart'
import { useFirebaseContext } from "../../../utils/auth"
import { navigate } from "gatsby"
import { CircleNotch } from "phosphor-react"
import { update, ref } from "firebase/database"
import { v4 as uuidv4 } from 'uuid'

import { Flexbox } from "../../layout/Flexbox"
import { QuantityTracker } from "../../form/FormComponents"
import { ControlsContent, ControlsFooter } from "../Controls"
import Icon from "../../ui/Icon"
import Button from "../../ui/Button"
import Content from "../../ui/Content"
import ColorPicker from "../../shop/ColorPicker"
import Box from "../../ui/Box"

function Checkoutbar({
  bookData,
  productData,
  productImages,
  setBookData,
  toast,
}) {
  const { firebaseDb } = useFirebaseContext()
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  function getImageThumbnail() {
    // this is an exact match for "color-0"
    const filteredImage = productImages.nodes.filter(img => img.name === `${bookData.coverColor}-0`)
    return filteredImage[0]
  }

  function handleCheckoutButton(coverColor) {
    setLoading(true)
    // create a promise to add items to cart then redirect user to cart
    addItem({
      category: productData.category,
      coverColor: coverColor,
      currency: "USD",
      custom: true,
      bookId: bookData.id,
      description: productData.description,
      id: uuidv4(),
      image: getImageThumbnail(),
      name: productData.name,
      price_id: productData.stripePreorderPriceId,
      price: productData.preorderPrice,
      slug: productData.slug,
      weight: productData.weight,
    }, { count: itemQuantity })
    .then(async () => {
      await updateBookCoverColor(coverColor)
      setLoading(false)
      return navigate("/cart")
    }).catch(() => {
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

    await update(ref(firebaseDb), updates).then(error => {
      if (error) {
        throw error
      }
    }).catch(error => {
      console.log(error)
      toast.error("Something went wrong! Please try again.")
    })
  }

  return (
    <>
      <ControlsContent>
        <Flexbox
          flexdirection="column"
          justifycontent="space-between"
          height="100%"
        >
          <Box>
            <Content
              padding="0"
              margin="0 0 16px"
              h5fontweight="700"
            >
              <h5>{productData.name}</h5>
              <p>{productData.description}</p>
            </Content>
            <Content
              padding="0"
              margin="0 0 16px"
              h5fontweight="700"
              h5fontsize="1rem"
            >
              <h5>Cover color</h5>
              <ColorPicker
                data={productData.colors}
                selectedColor={bookData.coverColor}
                cbFunction={color => setBookData({
                  ...bookData,
                  coverColor: color,
                })}
              />
            </Content>
          </Box>
          <Box>
            <Flexbox
              alignitems="center"
              justifycontent="space-between"
              margin="0 0 16px"
              padding="32px 0 0"
              className="has-border-top"
            >
              <Content
                padding="0"
                margin="0"
                h5margin="0 8px 0 0"
                h5fontsize="1rem"
                h5fontweight="700"
              >
                <h5>Quantity</h5>
              </Content>
              <QuantityTracker
                buttonwidth="1rem"
                buttonheight="1rem"
                counterwidth="6rem"
                counterfontsize="0.825rem"
                iconsize="0.625rem"
                setItemQuantity={setItemQuantity}
                counterpadding="0.5rem"
                />
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
                h5margin="0"
                h5fontweight="700"
                h5fontsize="1rem"
              >
                <h5>Subtotal</h5>
              </Content>
              <Content
                padding="0"
                margin="0"
                h4margin="0"
                h4fontweight="700"
              >
                <h4>{calculateTotalPrice(productData.price)}</h4>
              </Content>
            </Flexbox>
          </Box>
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
          onClick={() => handleCheckoutButton(bookData.coverColor)}
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
