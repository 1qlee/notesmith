import React, { useState } from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { colors } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { useFirebaseContext } from "../../utils/auth"
import { ArrowLeft } from "phosphor-react"

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledLabel, ErrorLine } from "../form/FormComponents"
import Button from "../Button"
import Icon from "../Icon"
import Loading from "../../assets/loading.svg"
import TextLink from "../TextLink"

const cardStyle = {
  style: {
    base: {
      color: colors.gray.nineHundred,
      fontFamily: "Crimson Pro",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: colors.gray.fiveHundred,
        fontFamily: "Crimson Pro"
      }
    },
    invalid: {
      color: colors.red.sixHundred,
      iconColor: colors.red.sixHundred
    }
  }
}

const cardElementStyle = {
  padding: "1rem",
  boxShadow: `inset 0 1px 3px ${colors.shadow.inset}, inset 0 0 1px ${colors.shadow.inset}`,
  borderRadius: "0.25rem",
  marginBottom: "1rem"
}

const cardElementErrorStyle = {
  padding: "1rem",
  boxShadow: `0 0 0 2px ${colors.red.sixHundred}, inset 0 0 0 1px ${colors.paper.cream}`,
  borderRadius: "0.25rem",
  marginBottom: "1rem"
}

function CheckoutForm({ setActiveTab, clientSecret, customer, setCustomer, address, setAddress }) {
  const { clearCart } = useShoppingCart()
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
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
        console.log(res.error.message)
      }
      else {
        console.log(res)
        setError(null)
        setProcessing(false)
        setSucceeded(true)
        localStorage.removeItem("pid")
        clearCart()
      }
    })
  }

  return (
    <form
      onSubmit={submitPaymentForm}
      id="checkout-payment-form"
      style={{width:"500px"}}
    >
      <StyledFieldset>
        <StyledLabel htmlFor="card-element">Card Information</StyledLabel>
      </StyledFieldset>
      <div style={error ? cardElementErrorStyle : cardElementStyle}>
        <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
      </div>
      {error && (
        <ErrorLine
          role="alert"
          color={colors.red.sixHundred}
          margin="0 0 1rem 0"
        >
          <span>{error}</span>
        </ErrorLine>
      )}
      {succeeded && (
        <p>
          Payment succeeded, see the result in your
          <a
            href={`https://dashboard.stripe.com/test/payments`}
          >
            {" "}
            Stripe dashboard.
          </a> Refresh the page to pay again.
        </p>
      )}
      <Flexbox
        flex="flex"
        justifyContent="space-between"
        alignitems="center"
      >
        <TextLink
          color={colors.link.normal}
          hovercolor={colors.link.hover}
          className="has-icon"
          alignitems="flex-end"
          onClick={() => setActiveTab(1)}
        >
          <Icon>
            <ArrowLeft size="1rem" />
          </Icon>
          <span>Edit shipping</span>
        </TextLink>
        <Button
          disabled={error || processing || succeeded}
          id="submit"
          backgroundcolor={colors.primary.sixHundred}
          color={colors.white}
          padding="1rem"
          className={processing ? "is-loading" : null}
          form="checkout-payment-form"
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
