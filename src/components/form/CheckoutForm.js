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
import Notification from "../ui/Notification"

function CheckoutForm({
  address,
  authKey,
  cartItems,
  clientSecret,
  customer,
  pid,
  setPaymentProcessing,
  tax,
  toast,
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
      toast.error("Error occured. Please refresh and try again.")
      return setProcessing(false)
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();

    if (submitError) {
      // form errors will be handled by PaymentElement component so we don't have to explicitly set them here
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
      setError(error.message)
      setProcessing(false)
    } else {
      if (tax.amount) {
        createTaxRecord()
      }
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      const createdDate = payment.paymentIntent.created

      purchaseShippingLabel(createdDate)
    }
  }

  const createTaxRecord = () => {
    fetch("/.netlify/functions/create-tax-record", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pid: pid,
        tax: tax,
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      if (data.error) {
        throw data.error
      }
    }).catch(err => {
      console.log(err)
    })
  }

  // fetch easypost api to purchase a shipping label
  // takes options arg to save to orders (database)
  const purchaseShippingLabel = (createdDate) => {
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
        throw data
      }

      // extract data
      const trackingCode = data.shippingLabel.tracking_code
      const { trackingUrl, amount, authKey, tax, shipping, shipmentId, taxId, rateId } = data
      const orderData = {
        address: address,
        amount: amount,
        authKey: authKey,
        created: createdDate,
        customer: customer,
        rateId: rateId,
        shipmentId: shipmentId,
        shipping: shipping,
        tax: tax,
        taxId: taxId,
        tracking:  {
          code: trackingCode,
          url: trackingUrl
        },
      }

      const orderSaved = await saveOrderItems(cartItems, orderData)

      // if there is an order error, it means we could not save the order to the database
      if (orderSaved.error) {
        setError(null)
        setPaymentProcessing(false)
        // send the team an email to notify them of the error
        await sendOrderErrorEmail("Payment was successful, but we could not save the order to the database.")

        // redirect the user to the orders summary page including the error
        navigate(
          `/orders/${pid}?key=${authKey}`,
          {
            state: {
              orderData: orderData,
              cartItems: cartItems,
              error: orderSaved.error,
              clearCart: true,
            }
          }
        )
      }
      // otherwise, everything is good-to-go so redirect the user to the orders summary page
      else {
        setError(null)
        setPaymentProcessing(false)

        // redirect the user to the orders summary page
        navigate(
          `/orders/${pid}?key=${authKey}`,
          {
            state: {
              error: null,
              clearCart: true,
            }
          }
        )
      }
    }).catch(async data => {
      await sendShippingErrorEmail("Payment was successful, but we could not purchase the shipping label.")
      // if we have an error here that means the order was created but the shipping label was not purchased
      // we need to have a failsafe so that we know this occured
      const { amount, authKey, tax, shipping, error, taxId, shipmentId, rateId } = data
      const orderData = {
        address: address,
        created: createdDate,
        amount: amount,
        tax: tax,
        taxId: taxId,
        shipmentId: shipmentId,
        rateId: rateId,
        shipping: shipping,
        authKey: authKey,
        error: error,
      }

      const orderSaved = await saveOrderItems(cartItems, orderData)
      
      if (orderSaved.error) {
        setError(null)
        setPaymentProcessing(false)
        await sendOrderErrorEmail("Payment was successful, but we could not save the order to the database. Additionally, the shipping label was not purchased.")

        // redirect the user to the orders summary page including the error
        navigate(
          `/orders/${pid}?key=${authKey}`,
          {
            state: {
              orderData: orderData,
              cartItems: cartItems,
              error: orderSaved.error,
              clearCart: true,
            }
          }
        )
      }
      else {
        setError(null)
        setPaymentProcessing(false)

        // redirect the user to the orders summary page
        navigate(
          `/orders/${pid}?key=${authKey}`,
          {
            state: {
              error: null,
              clearCart: true,
            }
          }
        )
      }
    })
  }

  // save each order item to the database
  // save the entire order to the database
  const saveOrderItems = async (cartItems, orderData) => {
    let cartItemsObject = {}
    const cartItemsLength = cartItems.length

    for (let i = 0; i < cartItemsLength; i++) {
      const cartItemId = cartItems[i].id
      cartItemsObject[cartItemId] = true

      // if this set fails, then we won't have a saved order item
      // this will make fulfillment very difficult, so we must handle the error here
      await set(ref(firebaseDb, `/orderItems/${cartItemId}`), {
        ...cartItems[i],
        pid: pid,
      }).catch(() => {
        return {
          error: `There was an issue with saving your order items to our system. Please contact us at general@notesmithbooks.com for further assistance and include the following order id: ${pid}.`
        }
      })
    }

    // save the order to the database by its pid
    await set(ref(firebaseDb, `/orders/${pid}`), {
      ...orderData,
      pid: pid,
      orderItems: cartItemsObject,
    }).catch(() => {
      return {
        error: `There was an issue with saving your order information to our system. Please contact us at general@notesmithbooks.com for further assistance and include the following order id: ${pid}.`
      }
    })

    return {
      error: null
    }
  }

  const sendOrderErrorEmail = async (error) => {
    fetch("/.netlify/functions/send-email-order-error", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pid: pid,
        error: error,
        cartItems: cartItems,
      })
    })
  }

  const sendShippingErrorEmail = async (error) => {
    fetch("/.netlify/functions/send-email-shipping-error", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pid: pid,
        error: error,
        address: address,
        cartItems: cartItems,
      })
    })
  }

  return (
    <form
      onSubmit={submitPaymentForm}
      id="checkout-payment-form"
    >
      {error && (
        <Notification 
          backgroundcolor={colors.red.sixHundred}
          color={colors.red.oneHundred}
        >
          <p>{error}</p>
        </Notification>
      )}
      <PaymentElement
        id="card-element"
        options={paymentOptions}
        onChange={() => setError("")}
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
          color={colors.gray.oneHundred}
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
