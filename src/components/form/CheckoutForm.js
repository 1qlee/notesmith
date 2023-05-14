import React, { useState } from "react"
import { navigate } from "gatsby"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { colors } from "../../styles/variables"
import { ArrowLeft, CircleNotch } from "phosphor-react"
import { useFirebaseContext } from "../../utils/auth"

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledLabel, ErrorLine } from "../form/FormComponents"
import ShippingInfo from "./ShippingInfo"
import Button from "../ui/Button"
import Icon from "../ui/Icon"
import TextLink from "../ui/TextLink"

function CheckoutForm({
  address,
  clearCart,
  cartItems,
  customer,
  pid,
  loading,
  setPaymentProcessing,
  setLoading,
}) {
  const stripe = useStripe()
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(false)
  const { firebaseDb } = useFirebaseContext()
  const paymentOptions = {
    defaultValues: {
      billingDetails: {
        email: customer.email,
        name: customer.name,
      }
    }
  }

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setError(event.error ? event.error.message : "")
  }

  // save each order item to the database
  // save the entire order to the database
  const saveOrderItems = async (cartItems, orderData) => {
    let cartItemsObject = {}
    const cartItemsLength = cartItems.length

    for (let i = 0; i < cartItemsLength; i++) {
      const cartItemId = cartItems[i].id
      cartItemsObject[cartItemId] = true

      await firebaseDb.ref(`/orderItems/${cartItemId}`).set({
        ...cartItems[i],
        pid: pid,
      }).catch(() => {
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
    // show loading UI state
    setLoading(true)

    // send the payment details to Stripe
    await stripe.confirmPayment({
      payment_method: {
        // card: elements.getElement(CardElement),
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

      const createdDate = res.paymentIntent.created
      const paymentInfo = {
        createdDate: createdDate,
      }

      // buy the shipping label from easypost
      // send it payment info to save to the order
      purchaseShippingLabel(paymentInfo)
    }).catch(error => {
      setError(error.message)
      setLoading(false)
    })
  }

  // fetch easypost api to purchase a shipping label
  // takes options arg to save to orders (database)
  const purchaseShippingLabel = async (options) => {
    // shows loader
    setPaymentProcessing(true)

    // all purchase info is in the paymentIntent, so just send pid
    await fetch("/.netlify/functions/create-shipment", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pid: pid,
      })
    }).then(res => {
      return res.json()
    }).then(async data => {
      if (data.error) {
        throw data.error
      }

      // extract data
      const trackingCode = data.shippingLabel.tracking_code
      const { trackingUrl, totalAmount, authKey, taxRate, shippingRate } = data
      const orderData = {
        ...options,
        address: address,
        authKey: authKey,
        customer: customer,
        shippingRate: shippingRate,
        taxRate: taxRate,
        totalAmount: totalAmount,
        tracking:  {
          code: trackingCode,
          url: trackingUrl
        },
      }

      await saveOrderItems(cartItems, orderData)

      // remove items from cart and clear pid from localStorage
      setError(null)
      clearCart()
      localStorage.removeItem("pid")

      // redirect the user to the orders summary page
      navigate(`/orders/${pid}?key=${authKey}`)
    }).catch(error => {
      setError(error)
    })
  }

  return (
    <form
      onSubmit={submitPaymentForm}
      id="checkout-payment-form"
    >
      <PaymentElement
        id="card-element"
        onChange={handleChange}
        options={paymentOptions}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
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
        justifycontent="flex-end"
        alignitems="center"
        margin="2rem 0 0"
      >
        <Button
          backgroundcolor={colors.gray.nineHundred}
          className={loading ? "is-loading" : null}
          color={colors.white}
          disabled={error || loading}
          form="checkout-payment-form"
          id="submit"
          padding="1rem"
          width="200px"
        >
          {loading ? (
            <Icon>
              <CircleNotch size="1rem" color={colors.white} />
            </Icon>
          ) : (
            "Pay now"
          )}
        </Button>
      </Flexbox>
    </form>
  )
}

export default CheckoutForm
