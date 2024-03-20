import React, { useState } from "react"
import { colors } from "../../../styles/variables"
import { useShoppingCart } from "../../cart/context/cartContext"
import { useFirebaseContext } from "../../../utils/auth"
import { navigate } from "gatsby"
import { CircleNotch } from "@phosphor-icons/react"
import { update, ref } from "firebase/database"
import { v4 as uuidv4 } from 'uuid'

import { Flexbox } from "../../layout/Flexbox"
import { QuantityTracker } from "../../form/FormComponents"
import { ControlsContent, ControlsFooter } from "../Controls"
import VolumeQuantitySelect from "../../shop/VolumeQuantitySelect"
import Icon from "../../ui/Icon"
import Button from "../../ui/Button"
import Content from "../../ui/Content"
import ColorPicker from "../../shop/ColorPicker"
import Box from "../../ui/Box"

function Checkoutbar({
  bookData,
  canvasPages,
  productData,
  productThumbnails,
  setBookData,
  toast,
}) {
  const { firebaseDb } = useFirebaseContext()
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)
  const [volumeQuantity, setVolumeQuantity] = useState(0)
  const [formattedSubtotal, setFormattedSubtotal] = useState("")
  const [loading, setLoading] = useState(false)

  function getImageThumbnail() {
    // this is an exact match for "color-0"
    const filteredImage = productThumbnails.nodes.filter(img => img.name === `${bookData.coverColor}-0`)
    return filteredImage[0]
  }

  function handleCheckoutButton(coverColor) {
    setLoading(true)
    // create a promise to add items to cart then redirect user to cart
    addItem({
      bookId: bookData.id,
      camelName: productData.camelName,
      category: productData.category,
      coverColor: coverColor,
      currency: "USD",
      custom: true,
      discounts: {
        type: productData.discount,
      },
      height: productData.heightPixel,
      id: uuidv4(),
      image: getImageThumbnail(),
      name: productData.name,
      numOfPages: productData.numOfPages,
      pages: [...canvasPages],
      price: productData.price,
      price_id: productData.stripePriceId,
      printed: false,
      size: productData.size,
      slug: productData.slug,
      weight: productData.weight,
      width: productData.widthPixel,
    }, { count: itemQuantity })
    .then(async () => {
      await updateBookCoverColor(coverColor)
      setLoading(false)
      return navigate("/cart")
    }).catch(() => {
      toast.error("Something went wrong! Please try again.")
    })
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
      toast.error("Something went wrong! Please try again.")
    })
  }

  return (
    <>
      <ControlsContent>
        <Flexbox
          flexdirection="column"
          justify="space-between"
          height="100%"
        >
          <Box>
            <Content
              padding="0"
              margin="0 0 16px"
              h5margin="0 0 16px"
            >
              <h5>{productData.name}</h5>
              <p>{productData.description}</p>
            </Content>
            <Content
              padding="0"
              h5fontweight="700"
              h5fontsize="1rem"
              h5margin="0 0 16px"
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
            <VolumeQuantitySelect
              volumeQuantity={volumeQuantity}
              setVolumeQuantity={setVolumeQuantity}
              itemQuantity={itemQuantity}
              setItemQuantity={setItemQuantity}
              setSubtotal={setFormattedSubtotal}
              bookData={productData}
              stacked
            />
            <Flexbox
              align="flex-end"
              justify="space-between"
              margin="32px 0 16px"
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
            <span>Add to cart</span>
          )}
        </Button>
      </ControlsFooter>
    </>
  )
}

export default Checkoutbar
