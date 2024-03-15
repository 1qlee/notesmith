import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { colors } from "../../styles/variables"
import { CircleNotch } from "@phosphor-icons/react"
import { useFirebaseContext } from "../../utils/auth"
import { ref, set, push } from "firebase/database"
import updatePaymentIntent from "../../functions/updatePaymentIntent"
import sendEmailTemplate from "../../functions/sendEmailTemplate"

import { Flexbox } from "../layout/Flexbox"
import Button from "../ui/Button"
import Icon from "../ui/Icon"
import Notification from "../ui/Notification"

function CheckoutForm({
  address,
  cartItems,
  clientSecret,
  customer,
  pid,
  selectedRate,
  setPaymentProcessing,
  subtotal,
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

  useEffect(() => {
    async function getUpdate() {
      if (elements) {
        console.log("updating payment")
        await elements.fetchUpdates()
      }
    }

    getUpdate()
  }, [elements, tax, selectedRate])

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
    const { error: submitError } = await elements.submit()

    if (submitError) {
      // form errors will be handled by PaymentElement component so we don't have to explicitly set them here
      return setProcessing(false)
    }

    // attempt to make the payment
    const payment = await stripe.confirmPayment({
      elements,
      clientSecret, 
      confirmParams: {
        // Return URL where the customer should be redirected after the authorization
        return_url: `https://www.notesmithbooks.com/checkout/payment`
      },
      redirect: "if_required",
    })

    if (payment.error) {
      const { error } = payment
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setError(error.message)
      toast.error(error.message)
      setProcessing(false)
    } 
    else {
      // this will show larger loading screen
      setPaymentProcessing(true)
      
      // purchase the shipping label
      const shipment = await purchaseShippingLabel()

      // create a tax record in Stripe
      if (tax.amount) {
        createTaxRecord()
      }

      sendReceiptEmail()

      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.

      if (shipment.error) {
        // redirect the user to the orders summary page including the error
        navigate(
          `/orders/${shipment.orderId}?key=${shipment.authKey}`,
          {
            state: {
              orderData: shipment.orderData,
              cartItems: cartItems,
              error: "Your payment was successful, however there was an error saving your order to our database. We are aware of this issue, but please still contact us to make sure everything is OK.",
              clearCart: true,
            }
          }
        )
      }
      else {
        // redirect the user to the orders summary page
        navigate(
          `/orders/${shipment.orderId}?key=${shipment.authKey}`,
          {
            state: {
              error: null,
              clearCart: true,
            }
          }
        )
      }
    }
  }

  // fetch easypost api to purchase a shipping label
  // takes options arg to save to orders (database)
  const purchaseShippingLabel = async () => {
    try {
      const response = await fetch("/.netlify/functions/create-shipment", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: pid,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw data
      }

      // Extract data
      const trackingCode = data.shippingLabel.tracking_code
      const { trackingUrl, amount, authKey, tax, shipping, shipmentId, taxId, rateId, id, datePaid } = data
      const orderData = {
        amount: amount,
        authKey: authKey,
        datePaid: datePaid,
        customer: customer,
        id: id,
        rateId: rateId,
        shipmentId: shipmentId,
        shipping: +shipping,
        tax: +tax,
        taxId: taxId,
        shipped: false,
        tracking: {
          code: trackingCode,
          url: trackingUrl,
        },
      }

      return await updateOrders(cartItems, orderData)
    } catch (data) {
      // Handle errors
      await sendShippingErrorEmail("Payment was successful, but we could not purchase the shipping label.")

      const { amount, authKey, tax, shipping, error, taxId, shipmentId, rateId, id, datePaid } = data
      const orderData = {
        datePaid: datePaid,
        amount: amount,
        id: id,
        tax: +tax,
        taxId: taxId,
        shipmentId: shipmentId,
        rateId: rateId,
        shipping: +shipping,
        authKey: authKey,
        error: error,
        shipped: false,
      }

      return await updateOrders(cartItems, orderData)
    }
  }

  // save each order item to the database
  // save the entire order to the database
  const updateOrders = async (cartItems, orderData) => {
    let orderItems = {}
    const cartItemsLength = cartItems.length
    const newOrderKey = push(ref(firebaseDb, 'orders/')).key
    const { authKey, shipmentId } = orderData
    
    try {
      // add all order items to db
      for (let i = 0; i < cartItemsLength; i++) {
        const orderItemKey = push(ref(firebaseDb, 'orderItems/')).key
        orderItems[orderItemKey] = true

        await set(ref(firebaseDb, `/orderItems/${orderItemKey}`), {
          ...cartItems[i],
          pid: pid,
          id: orderItemKey,
          orderIdDb: newOrderKey, 
          orderId: orderData.id,
          shipmentId: shipmentId,
        }).catch(async (error) => {
          setError(null)
          // send the team an email to notify them of the error
          await sendEmailTemplate({
            pid: pid,
            error: error,
            cartItems: cartItems,
          })
        })
      }

      // add the order itself to db
      await set(ref(firebaseDb, `/orders/${newOrderKey}`), {
        ...orderData,
        pid: pid,
        orderItems: orderItems,
        subtotal: subtotal,
      }).then(async () => {
        const updatePayment = await updatePaymentIntent(pid, { metadata: { orderKey: newOrderKey } })

        if (updatePayment.error) {
          throw new Error(updatePayment.error)
        }
      }).catch(async (error) => {
        await sendEmailTemplate({
          pid: pid,
          error: error,
          cartItems: cartItems,
        })
      })
    
      return {
        orderId: newOrderKey,
        authKey: authKey,
        error: null,
      }
    } catch (error) {
      return {
        error: error.error,
        orderId: newOrderKey,
        orderData: orderData,
        authKey: authKey,
      }
    }
  }

  const createTaxRecord = async () => {
    try {
      const response = await fetch("/.netlify/functions/create-tax-record", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: pid,
          tax: tax,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw data.error
      }
    } catch (err) {
      return err
    }
  }

  const sendShippingErrorEmail = async (error) => {
    await fetch("/.netlify/functions/send-email-shipping-error", {
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

  const sendReceiptEmail = async () => {
    await fetch("/.netlify/functions/send-email-receipt", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pid: pid,
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
          backgroundcolor={colors.red.twoHundred}
          borderradius="8px"
          color={colors.red.nineHundred}
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
        justify="flex-end"
        align="center"
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
              <CircleNotch size={16} color={colors.white} />
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
