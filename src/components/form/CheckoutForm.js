import React, { useState, useEffect } from "react"
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
  activeAccordionTab,
  address,
  clearCart,
  cartItems,
  customer,
  pid,
  loading,
  setPaymentProcessing,
  setLoading,
  toast,
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState("")
  const [focused, setFocused] = useState(false)
  const [amountToPay, setAmountToPay] = useState(null)
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
    async function finalizePayment() {
      const response = await fetch("/.netlify/functions/finalize-payment", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pid: pid,
        })
      })
      const data = response.json()

      if (data.error) {
        toast.error(data.error)
        setLoading(false)
      }
      else {
        console.log(data)
      }
    }
    
    if (activeAccordionTab === "payment") {
      finalizePayment()
    }
  }, [pid])

  // handle submitting the Stripe elements form
  const submitPaymentForm = async e => {
    console.log(e)
    e.preventDefault()
    // show loading UI state
    setLoading(true)

    if (!stripe || !elements) {
      console.log("abort")
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    const payment = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `/order/`
      }
    })

    if (payment.error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setError(error.message);
    } else {
      console.log(payment)
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }

    // send the payment details to Stripe
    // await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
    //     return_url: `/order/`,
    //   }
    // }).then(res => {
    //   if (res.error) {
    //     throw res.error
    //   }
    //   console.log(res)

    //   const createdDate = res.paymentIntent.created
    //   const paymentInfo = {
    //     createdDate: createdDate,
    //   }

    //   // buy the shipping label from easypost
    //   // send it payment info to save to the order
    //   purchaseShippingLabel(paymentInfo)
    // }).catch(error => {
    //   setError(error.message)
    //   setLoading(false)
    // })
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
        options={paymentOptions}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
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
          disabled={loading || !stripe || !elements}
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
