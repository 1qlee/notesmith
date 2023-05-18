import React, { useState } from "react"
import { navigate } from "gatsby"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { colors } from "../../styles/variables"
import { CircleNotch } from "phosphor-react"
import { useFirebaseContext } from "../../utils/auth"
import { ref, set } from "firebase/database"

import { Flexbox } from "../layout/Flexbox"
import Button from "../ui/Button"
import Icon from "../ui/Icon"

function CheckoutForm({
  address,
  authKey,
  cartItems,
  clearCart,
  clientSecret,
  customer,
  pid,
  setPaymentProcessing,
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const { firebaseDb } = useFirebaseContext()
  const paymentOptions = {
    defaultValues: {
      billingDetails: {
        email: customer.email,
        name: customer.name,
      }
    }
  }

  // handle submitting the Stripe elements form
  const submitPaymentForm = async e => {
    e.preventDefault()
    setProcessing(true)
    // show loading UI state

    if (!stripe || !elements) {
      return setProcessing(false)
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();

    if (submitError) {
      return setProcessing(false)
    }

    const payment = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        // Return URL where the customer should be redirected after the authorization
        return_url: `https://www.notesmithbooks.com/checkout/`
      },
      redirect: "if_required",
    })

    if (payment.error) {
      const { error } = payment
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      console.log(error)
      setError(error)
      setProcessing(false)
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      const createdDate = payment.created
      const paymentInfo = {
        createdDate: createdDate,
      }

      purchaseShippingLabel(paymentInfo)
    }
  }

  // save each order item to the database
  // save the entire order to the database
  const saveOrderItems = async (cartItems, orderData) => {
    let cartItemsObject = {}
    const cartItemsLength = cartItems.length

    for (let i = 0; i < cartItemsLength; i++) {
      const cartItemId = cartItems[i].id
      cartItemsObject[cartItemId] = true

      await set(ref(firebaseDb, `/orderItems/${cartItemId}`), {
        ...cartItems[i],
        pid: pid,
      }).catch(() => {
        console.error("Error writing order items to the database.")
      })
    }

    // save the order to the database by its pid
    await set(ref(firebaseDb, `/orders/${pid}`), {
      ...orderData,
      pid: pid,
      orderItems: cartItemsObject,
    }).catch(() => {
      console.error("Error writing order to the database.")
    })
  }

  // fetch easypost api to purchase a shipping label
  // takes options arg to save to orders (database)
  const purchaseShippingLabel = (options) => {
    // shows loader
    setPaymentProcessing(true)

    // all purchase info is in the paymentIntent, so just send pid
    fetch("/.netlify/functions/create-shipment", {
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
      console.log("Success", data)

      // remove items from cart and clear pid from localStorage
      setError(null)
      clearCart()
      localStorage.removeItem("pid")

      // redirect the user to the orders summary page
      navigate(`/orders/${pid}?key=${authKey}`)
    }).catch(error => {
      console.log("Error", error)
      // remove items from cart and clear pid from localStorage
      setError(null)
      clearCart()
      localStorage.removeItem("pid")

      // redirect the user to the orders summary page
      navigate(
        `/orders/${pid}?key=${authKey}`,
        {
          state: {
            error: error
          }
        }
      )
    })
  }

  return (
    <form
      onSubmit={submitPaymentForm}
      id="checkout-payment-form"
    >
      <PaymentElement
        id="card-element"
        options={paymentOptions}
      />
      <Flexbox
        flex="flex"
        justifycontent="flex-end"
        alignitems="center"
        margin="2rem 0 0"
      >
        <Button
          backgroundcolor={colors.gray.nineHundred}
          className={processing ? "is-loading" : null}
          color={colors.white}
          disabled={processing || !stripe || !elements}
          form="checkout-payment-form"
          id="submit"
          padding="1rem"
          width="200px"
        >
          {processing ? (
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
