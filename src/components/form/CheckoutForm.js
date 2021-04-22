import React, { useState } from "react"
import styled from "styled-components"
import Cookies from "js-cookie"
import { navigate } from "gatsby"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { colors } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { useFirebaseContext } from "../../utils/auth"
import { ArrowLeft } from "phosphor-react"

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledLabel, ErrorLine } from "../form/FormComponents"
import Button from "../Button"
import Icon from "../Icon"
import Loader from "../Loader"
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
  padding: "1rem",
  border: `1px solid ${colors.gray.sixHundred}`,
  marginBottom: "1rem"
}

const cardElementErrorStyle = {
  padding: "1rem",
  boxShadow: `0 0 0 2px ${colors.red.sixHundred}, inset 0 0 0 1px ${colors.paper.offWhite}`,
  marginBottom: "1rem"
}

const CardDetailsWrapper = styled.div`
  &.is-focused {
    box-shadow: 0 0 0 1px ${colors.primary.sixHundred}, inset 0 0 0 1px ${colors.paper.offWhite};
  }
`

function CheckoutForm({
  address,
  clientSecret,
  customer,
  processing,
  selectedRate,
  setActiveTab,
  setAddress,
  setCustomer,
  setLoading,
  setProcessing,
  shipment,
  taxRate,
}) {
  const { clearCart } = useShoppingCart()
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setError(event.error ? event.error.message : "")
  }

  // handle submitting the Stripe elements form
  const submitPaymentForm = async e => {
    e.preventDefault()
    // show processing UI state
    setProcessing(true)
    setLoading(true)

    // send the payment details to Stripe
    const payload = await stripe.confirmCardPayment(clientSecret, {
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
        setError(res.error.message)
        setProcessing(false)
        setLoading(false)
      }
      else {
        // purchase the shipping label
        purchaseShippingLabel()
      }
    })
  }

  const purchaseShippingLabel = async () => {
    const pid = localStorage.getItem("pid")

    const shippingLabel = await fetch("/.netlify/functions/create-shipping", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rateId: selectedRate,
        shipment: shipment,
        paymentId: pid
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      console.log(data)
      const tracking = data.shippingLabel.trackers
      // set cookies
      Cookies.set('orderId', pid, { expires: 365 })

      // clear errors, cart, localStorage
      setError(null)
      clearCart()
      localStorage.removeItem("pid")

      // redirect the user to the orders summary page
      navigate(`/orders/${pid}`, {
        state: {
          address: address,
          customer: customer,
          shippingRate: selectedRate,
          taxRate: taxRate,
          tracking:  {
            code: tracking.tracking_code,
            url: tracking.public_url
          }
        }
      })

      setProcessing(false)
      setLoading(false)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <form
      onSubmit={submitPaymentForm}
      id="checkout-payment-form"
    >
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
      >
        <TextLink
          color={colors.link.normal}
          hovercolor={colors.link.hover}
          className="has-icon"
          alignitems="flex-end"
          onClick={() => setActiveTab(2)}
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
          disabled={error || processing}
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
