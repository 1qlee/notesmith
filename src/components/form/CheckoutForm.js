import React, { useState } from "react"
import { navigate } from "gatsby"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { colors } from "../../styles/variables"
import { CircleNotch } from "@phosphor-icons/react"
import { useFirebaseContext } from "../../utils/auth"
import { ref, set, push } from "firebase/database"

import { Flexbox } from "../layout/Flexbox"
import Button from "../ui/Button"
import Icon from "../ui/Icon"
import Notification from "../ui/Notification"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"

function CheckoutForm({
  address,
  authKey,
  cartItems,
  clientSecret,
  coupon,
  customer,
  pid,
  setCoupon,
  setPaymentProcessing,
  setSelectedRate,
  setSubtotal,
  setTax,
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
    const { error: submitError } = await elements.submit()

    if (submitError) {
      // form errors will be handled by PaymentElement component so we don't have to explicitly set them here
      return setProcessing(false)
    }

    // purchase the shipping label first so we can reference the shipment in paymentIntent metadata
    const shipment = await purchaseShippingLabel()

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
      setProcessing(false)
    } else {
      setPaymentProcessing(true)
      
      if (tax.amount) {
        createTaxRecord()
      }
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
      console.log(err)
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
        shipping: shipping,
        tax: tax,
        taxId: taxId,
        shipped: false,
        tracking: {
          code: trackingCode,
          url: trackingUrl,
        },
      }

      const responseFromSaveOrderItems = await saveOrderItems(cartItems, orderData)
      return responseFromSaveOrderItems
    } catch (data) {
      // Handle errors
      await sendShippingErrorEmail("Payment was successful, but we could not purchase the shipping label.")

      const { amount, authKey, tax, shipping, error, taxId, shipmentId, rateId, id, datePaid } = data
      const orderData = {
        datePaid: datePaid,
        amount: amount,
        id: id,
        tax: tax,
        taxId: taxId,
        shipmentId: shipmentId,
        rateId: rateId,
        shipping: shipping,
        authKey: authKey,
        error: error,
        shipped: false,
      }

      const responseFromSaveOrderItems = await saveOrderItems(cartItems, orderData)
      return responseFromSaveOrderItems;
    }
  }

  // save each order item to the database
  // save the entire order to the database
  const saveOrderItems = async (cartItems, orderData) => {
    let orderItems = {}
    const cartItemsLength = cartItems.length
    const newOrderKey = push(ref(firebaseDb, 'orders/')).key
    const { authKey } = orderData
    
    try {
      // add all order items to db
      for (let i = 0; i < cartItemsLength; i++) {
        const orderItemKey = push(ref(firebaseDb, 'orderItems/')).key
        orderItems[orderItemKey] = true

        await set(ref(firebaseDb, `/orderItems/${orderItemKey}`), {
          ...cartItems[i],
          pid: pid,
          id: orderItemKey,
        }).catch(async () => {
          setError(null)
          // send the team an email to notify them of the error
          await sendOrderErrorEmail("Payment was successful, but there was an error adding order items to the database.")

          throw {
            error: "Could not add order item to database.",
          }
        })
      }

      // add the order itself to db
      await set(ref(firebaseDb, `/orders/${newOrderKey}`), {
        ...orderData,
        pid: pid,
        orderItems: orderItems,
      }).then(async () => {
        const response = await fetch("/.netlify/functions/update-payment", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pid: pid,
            data: { orderKey: newOrderKey },
          }),
        })

        const data = await response.json()

        if (data.error) {
          throw data.error
        }
      }).catch(async () => {
        await sendOrderErrorEmail("Payment was successful, but there was an error adding order to the database.")

        throw {
          error: "Could not add order to database.",
        }
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


  const sendOrderErrorEmail = async (error) => {
    await fetch("/.netlify/functions/send-email-order-error", {
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

  const handleChangeCoupon = (value) => {
    setCoupon({
      ...coupon,
      loading: false,
      code: value.trim(),
      error: "",
    })
  }

  const handleCoupon = async () => {
    if (!coupon.code) {
      setCoupon({
        ...coupon,
        loading: false,
        error: "Please enter a coupon code.",
      })
    }
    else {
      setCoupon({
        ...coupon,
        loading: true,
        error: "",
      })

      fetch("/.netlify/functions/apply-coupon", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pid: pid,
          cartItems: cartItems,
          coupon: coupon.code,
        })
      }).then(res => {
        return res.json()
      }).then(data => {

        if (data.error) {
          throw data.error
        }

        const pi = data.paymentIntent
        const coupon = data.coupon

        if (pi) {
          setSelectedRate({
            rateId: pi.metadata.rateId,
            rate: pi.metadata.shipping,
          })
          setTax({
            amount: pi.metadata.tax,
            id: pi.metadata.taxId,
          })
          setSubtotal(pi.amount)
        }

        if (coupon) {
          setCoupon({
            ...coupon,
            applied: true,
            text: data.coupon && "Super mega discount",
            loading: false,
          })
        }
      }).catch(error => {
        setCoupon({
          ...coupon,
          loading: false,
          error: error,
        })
      })
    }
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
      <StyledLabel
        htmlFor="coupon-input"
        margin="16px 0 8px"
      >
        Coupon
      </StyledLabel>
      <Flexbox
        justify="space-between"
        align="flex-start"
        width="100%"
      >
        <StyledFieldset
          margin="0 8px 0 0"
        >
          <StyledInput
            id="coupon-input"
            onChange={e => handleChangeCoupon(e.target.value)}
            placeholder="Coupon code"
            className={coupon.error && "is-error"}
            type="text"
            value={coupon.code}
            fontsize="1rem"
            margin="0 8px 0 0"
          />
          {coupon.error && (
            <ErrorLine
              color={colors.red.sixHundred}
            >
              {coupon.error}
            </ErrorLine>
          )}
        </StyledFieldset>
        <Button
          backgroundcolor={colors.gray.nineHundred}
          color={colors.gray.oneHundred}
          padding="20px"
          width="100px"
          htmlFor="coupon-input"
          type="button"
          onClick={() => handleCoupon()}
          className={coupon.loading ? "is-loading" : null}
          disabled={coupon.loading}
        >
          {coupon.loading ? (
            <Icon>
              <CircleNotch size={16} color={colors.white} />
            </Icon>
          ) : (
            "Apply"
          )}
        </Button>
      </Flexbox>
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
