import React, { useState } from "react"
import styled from "styled-components"
import { navigate } from "gatsby"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { colors } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { ArrowLeft } from "phosphor-react"

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledLabel, ErrorLine } from "../form/FormComponents"
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
  padding: "1rem",
  borderRadius: "0.25rem",
  boxShadow: `0 1px 2px ${colors.shadow.float}`,
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
  authKey,
  clientSecret,
  customer,
  processing,
  selectedRate,
  setActiveTab,
  setAddress,
  setCustomer,
  setProcessing,
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
    const pid = localStorage.getItem("pid")
    e.preventDefault()
    // show processing UI state
    setProcessing(true)

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
      }
      else {
        // clear errors, cart, localStorage
        setError(null)
        clearCart()
        localStorage.removeItem("pid")

        navigate(`/orders/${pid}?key=${authKey}`, {
          state: {
            msg: "Congratulations, your order has been successfully completed! We will get started on preparing your order right away. Please note that it may take 5 to 10 business days for our custom products to ship."
          }
        })
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
        pid: pid
      })
    }).then(res => {
      // clear errors, cart, localStorage
      setError(null)
      clearCart()
      localStorage.removeItem("pid")

      return res.json()
    }).then(data => {
      const trackingCode = data.shippingLabel.tracking_code
      const { trackingUrl, totalAmount, authKey } = data

      // redirect the user to the orders summary page
      navigate(`/orders/${pid}?key=${authKey}`, {
        state: {
          address: address,
          customer: customer,
          shippingRate: selectedRate,
          taxRate: taxRate,
          totalAmount: totalAmount,
          tracking:  {
            code: trackingCode,
            url: trackingUrl
          }
        }
      })
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
          color={colors.gray.sixHundred}
          hovercolor={colors.gray.nineHundred}
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
