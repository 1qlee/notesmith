import React, { useState } from "react"
import styled from "styled-components"
import { navigate } from "gatsby"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { colors } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { ArrowLeft, CheckSquare, Square } from "phosphor-react"
import { useFirebaseContext } from "../../utils/auth"

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"
import ShippingInfo from "./ShippingInfo"
import Button from "../Button"
import Icon from "../Icon"
import Loading from "../../assets/loading.svg"
import TextLink from "../TextLink"

const cardOptions = {
  style: {
    base: {
      color: colors.gray.nineHundred,
      fontFamily: "Crimson Pro",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: colors.gray.fiveHundred,
        fontFamily: "Crimson Pro"
      },
    },
    invalid: {
      color: colors.red.sixHundred,
      iconColor: colors.red.sixHundred
    }
  }
}

const cardElementStyle = {
  backgroundColor: `${colors.white}`,
  border: `1px solid ${colors.gray.threeHundred}`,
  borderRadius: "0.25rem",
  marginBottom: "0.5rem",
  padding: "1rem",
}

const cardElementErrorStyle = {
  backgroundColor: `${colors.white}`,
  border: `1px solid ${colors.red.sixHundred}`,
  borderRadius: "0.25rem",
  marginBottom: "0.5rem",
  padding: "1rem",
}

const CardDetailsWrapper = styled.div`
  &.is-focused {
    border-color: ${colors.gray.sixHundred};
  }
`

function CheckoutForm({
  address,
  clientSecret,
  customer,
  pid,
  processing,
  selectedRate,
  setActiveTab,
  setLoading,
  setPaymentProcessing,
  setProcessing,
  setShippingMethod,
  setShowShippingMethod,
  shipmentId,
  shippingMethod,
  taxRate,
}) {
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(false)
  const { clearCart, cartDetails } = useShoppingCart()
  const { user, firebaseDb } = useFirebaseContext()
  const elements = useElements()
  const stripe = useStripe()

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setError(event.error ? event.error.message : "")
  }

  // save each order item to the database
  const saveOrderItems = async (cartItems, orderData) => {
    let cartItemsObject = {}
    // loop through all items in the cart
    for (const cartItem in cartItems) {
      const cartItemId = cartItems[cartItem].id
      // save each cart item's ID to our dummy object so we can save it to the order later
      cartItemsObject[cartItemId] = true
      // save each item into the database by its id
      await firebaseDb.ref(`/orderItems/${cartItemId}`).set({
        ...cartItems[cartItem],
        pid: pid, // need pid to link the item to the order
      }).catch(error => {
        console.error("Error writing order items to the database.")
      })
    }

    // save the order to the database by its pid
    await firebaseDb.ref(`/orders/${pid}`).set({
      ...orderData,
      pid: pid,
      orderItems: cartItemsObject,
    })
  }

  // handle submitting the Stripe elements form
  const submitPaymentForm = async e => {
    e.preventDefault()
    // show processing UI state
    setProcessing(true)

    // send the payment details to Stripe
    await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: customer.name,
          email: customer.email
        }
      },
      receipt_email: customer.email,
    }).then(res => {
      if (res.error) {
        throw res.error
      }

      // buy the shipping label from easypost
      purchaseShippingLabel(res.paymentIntent.created)
    }).catch(error => {
      setError(error.message)
      setProcessing(false)
    })
  }

  const purchaseShippingLabel = async (createdDate) => {
    // shows loader
    setPaymentProcessing(true)

    const shippingLabel = await fetch("/.netlify/functions/create-shipment", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pid: pid,
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      if (data.error) {
        throw data.error
      }

      const trackingCode = data.shippingLabel.tracking_code
      const { trackingUrl, totalAmount, authKey, taxRate, shippingRate } = data
      const orderData = {
        address: address,
        customer: customer,
        shippingRate: shippingRate,
        taxRate: taxRate,
        totalAmount: totalAmount,
        authKey: authKey,
        createdDate: createdDate,
        tracking:  {
          code: trackingCode,
          url: trackingUrl
        },
      }

      saveOrderItems(cartDetails, orderData)

      // remove items from cart and clear pid from localStorage
      setError(null)
      clearCart()
      localStorage.removeItem("pid")

      // redirect the user to the orders summary page
      navigate(`/orders/${pid}?key=${authKey}`, {
        state: {
          address: address,
          customer: customer,
          shippingRate: shippingRate,
          taxRate: taxRate,
          totalAmount: totalAmount,
          tracking:  {
            code: trackingCode,
            url: trackingUrl
          }
        }
      })
    }).catch(error => {
      setError(error)
    })
  }

  return (
    <form
      onSubmit={submitPaymentForm}
      id="checkout-payment-form"
    >
      <ShippingInfo
        address={address}
        customer={customer}
        setActiveTab={setActiveTab}
        shippingMethod={shippingMethod}
        setShowShippingMethod={setShowShippingMethod}
      />
      <StyledFieldset>
        <StyledLabel htmlFor="card-element">Card Information</StyledLabel>
      </StyledFieldset>
      <CardDetailsWrapper
        className={focused && "is-focused"}
        style={error ? cardElementErrorStyle : cardElementStyle}
      >
        <CardElement
          id="card-element"
          options={cardOptions}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </CardDetailsWrapper>
      {error && (
        <ErrorLine
          role="alert"
          color={colors.red.sixHundred}
          margin="0 0 1rem 0"
        >
          <span>{error}</span>
        </ErrorLine>
      )}
      <Flexbox
        flex="flex"
        justifycontent="space-between"
        alignitems="center"
        margin="2rem 0 0"
      >
        <TextLink
          color={colors.primary.threeHundred}
          hovercolor={colors.primary.sixHundred}
          className="has-icon"
          alignitems="flex-end"
          onClick={() => {
            setActiveTab(1)
            setProcessing(false)
            setShowShippingMethod(true)
            setShippingMethod(null)
          }}
        >
          <Icon>
            <ArrowLeft size="1rem" />
          </Icon>
          <span>Edit shipping</span>
        </TextLink>
        <Button
          backgroundcolor={colors.primary.sixHundred}
          className={processing ? "is-loading" : null}
          color={colors.white}
          disabled={error || processing || !taxRate}
          form="checkout-payment-form"
          id="submit"
          padding="1rem"
          width="200px"
        >
          {processing ? (
            <Loading height="1rem" width="1rem" />
          ) : (
            "Pay now"
          )}
        </Button>
      </Flexbox>
    </form>
  )
}

export default CheckoutForm
