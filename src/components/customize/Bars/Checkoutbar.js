import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { navigate } from "gatsby"
import { useShoppingCart } from 'use-shopping-cart'
import { useFirebaseContext } from "../../../utils/auth"
import products from "../../../data/products.json"

import { Flexbox } from "../../layout/Flexbox"
import { QuantityTracker, StyledLabel, StyledFieldset, SelectWrapper, StyledSelect, SelectIcon } from "../../form/FormComponents"
import Button from "../../Button"
import Content from "../../Content"
import ColorPicker from "../../shop/ColorPicker"

function Checkoutbar({
  bookData,
  setBookData,
}) {
  const { user, firebaseDb } = useFirebaseContext()
  const { addItem } = useShoppingCart()
  const [itemQuantity, setItemQuantity] = useState(1)

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

  function handleCheckoutButton(price) {
    // create a promise to add items to cart then redirect user to cart
    const addItemsToCart = new Promise((resolve, reject) => {
      // use-shopping-cart function to add items to cart
      resolve(
        addItem({
          name: price.product.name,
          description: price.product.description,
          id: price.id,
          price: price.unit_amount,
          currency: price.currency,
          image: price.product.images,
          coverColor: bookData.coverColor,
        }, itemQuantity)
      )
    })

    addItemsToCart.then(() => {
      updateBookCoverColor()
    }).then(res => {
      return navigate("/cart")
    }).catch(error => {
      console.log(error)
    })
  }

  function updateBookCoverColor(color) {
    const updates = {}
    // update the specified book by its bookId
    // only updates the title field
    updates[`/books/${bookData.id}/coverColor`] = color

    firebaseDb.ref().update(updates, error => {
      if (error) {
        console.log("Error occurred when updating book title.")
      }
    })
  }

  return (
    <Flexbox
      flex="flex"
      flexdirection="column"
      justifycontent="space-between"
      height="100%"
    >
      <Flexbox
        flex="flex"
        flexdirection="column"
        padding="1rem"
      >
        <Content
          margin="0 0 2rem 0"
          paragraphcolor={colors.primary.threeHundred}
          paragraphfontweight="500"
        >
          <h3>Summary</h3>
          <p>Below is a summary of your notebook's configurations.</p>
        </Content>
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
            <h5>Type</h5>
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
              data={products[bookData.type].colors}
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
            <h3>{calculateTotalPrice(2000)}</h3>
          </Content>
        </Flexbox>
      </Flexbox>
      <Flexbox
        padding="1rem"
        backgroundcolor={colors.white}
        className="has-border-top"
        bordercolor={colors.gray.threeHundred}
      >
        <Button
          backgroundcolor={colors.primary.sixHundred}
          borderradius="0.25rem"
          color={colors.primary.white}
          padding="1rem"
          width="100%"
          onClick={() => handleCheckoutButton(2000)}
        >
          <span>Checkout</span>
        </Button>
      </Flexbox>
    </Flexbox>
  )
}

export default Checkoutbar
