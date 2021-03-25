import React, { useState } from "react"
import { Link } from "gatsby"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { colors } from "../../styles/variables"
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart"
import { useFirebaseContext } from "../../utils/auth"
import { ArrowLeft } from "phosphor-react"

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledInput, StyledLabel, StyledSelect, ErrorLine } from "../form/FormComponents"
import Button from "../Button"
import Content from "../Content"
import Icon from "../Icon"
import Loader from "../Loader"
import Loading from "../../assets/loading.svg"
import TextLink from "../TextLink"

function ShippingForm({
  setActiveTab,
  setFormError,
  setShowModal,
  setProcessing,
  setAddress,
  setCustomer,
  processing,
  customer,
  address 
}) {
  const { user } = useFirebaseContext()
  const { cartDetails } = useShoppingCart()
  const [loading, setLoading] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [line1Error, setLine1Error] = useState("")
  const [cityError, setCityError] = useState("")
  const [stateError, setStateError] = useState("")
  const [postalError, setPostalError] = useState("")

  // handle submitting the shipping form
  async function submitShippingForm(e) {
    e.preventDefault()
    // show processing UI state
    setProcessing(true)

    // validate the user's inputted address using easypost's API
    const validateAddress = await fetch("/.netlify/functions/validate-shipping", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: address // send address from props
      })
    }).then(res => {
      // parse the response object
      const response = res.json()
      let errors

      // the response object is a Promise for some reason
      response.then(obj => {
        // obj contains our error
        if (obj.errors) {
          console.log("error found in response")
          throw obj.errors
        }
        else {
          console.log("no errors")
          return obj
        }
      }).then(data => {
        console.log(data)
        createPayment()
      }).catch(err => {
        console.log(err)
        setProcessing(false)
        setFormError(err)
        setShowModal({
          show: true
        })
      })

    })
  }

  async function createPayment() {
    // update the paymentIntent with shipping form data
    const payment = await fetch("/.netlify/functions/create-payment", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productData: {...cartDetails}, // always send current cart items
        paymentId: localStorage.getItem("pid"), // need pid from localStorage to update the corresponding paymentIntent
        email: customer.email,
        address: {address: {...address}, name: customer.name}, // always send shipping information
        customer: customer
      })
    }).then(res => {
      setFormError({
        msg: ""
      })
      return res.json()
    }).then(data => {
      setProcessing(false)
      setActiveTab(2)
    }).catch(err => {
      setProcessing(false)
      setFormError({
        msg: "Something went wrong processing your information."
      })
    })
  }

  async function calculateTaxes() {
    const totalTaxes = await fetch("https://sales-tax-calculator.p.rapidapi.com/rates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": "1b2b6c9896msh5cc4c7593ead3a8p1d4e1ajsn0f5400f7cf24",
        "x-rapidapi-host": "sales-tax-calculator.p.rapidapi.com"
      },
      body: JSON.stringify({
        city: address.city,
        state: address.state,
        street: address.line1,
        zip: address.postal_code
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      console.log(data)
    }).catch(err => {
      console.log(err)
    })
  }

  function validateInput(e) {
    const name = e.target.getAttribute("name")

    if (e.target.value.length === 0) {
      switch(name) {
        case "name":
          setNameError("This field is required")
          break
        case "email":
          setEmailError("This field is required")
          break
        case "line1":
          setLine1Error("This field is required")
          break
        case "city":
          setCityError("This field is required")
          break
        case "state":
          setStateError("This field is required")
          break
        case "postal_code":
          setPostalError("This field is required")
          break
        default:
          return
      }
    }
  }

  function onInputFocus(e) {
    const name = e.target.getAttribute("name")
    setFormError({
      msg: ""
    })

    switch(name) {
      case "name":
        setNameError("")
        break
      case "email":
        setEmailError("")
        break
      case "line1":
        setLine1Error("")
        break
      case "city":
        setCityError("")
        break
      case "state":
        setStateError("")
        break
      case "postal_code":
        setPostalError("")
        break
      default:
        return
    }
  }

  return (
    <form
      onSubmit={submitShippingForm}
      id="checkout-shipping-form"
      style={{width:"500px"}}
    >
      <StyledFieldset
        className="is-flex"
        margin="0 0 1rem 0"
      >
        <StyledFieldset
          className="is-vertical"
        >
          <StyledLabel htmlFor="checkout-name">Full Name</StyledLabel>
          <StyledInput
            id="checkout-name"
            borderRadius="0.25rem"
            className={nameError && "is-error"}
            name="name"
            onBlur={e => validateInput(e)}
            onChange={e => setCustomer({...customer, name: e.target.value})}
            onFocus={e => onInputFocus(e)}
            padding="1rem"
            placeholder="John Doe"
            required
            type="text"
            value={customer.name}
          />
          {nameError && (
            <ErrorLine
              color={colors.red.sixHundred}
            >
              {nameError}
            </ErrorLine>
          )}
        </StyledFieldset>
        <StyledFieldset
          className="is-vertical"
        >
          <StyledLabel htmlFor="checkout-email">Email</StyledLabel>
          <StyledInput
            id="checkout-email"
            borderRadius="0.25rem"
            className={emailError && "is-error"}
            name="email"
            onChange={e => setCustomer({...customer, email: e.target.value})}
            onBlur={e => validateInput(e)}
            onFocus={e => onInputFocus(e)}
            padding="1rem"
            placeholder="name@email.com"
            required
            type="email"
            value={customer.email}
          />
          {emailError && (
            <ErrorLine
              color={colors.red.sixHundred}
            >
              {emailError}
            </ErrorLine>
          )}
        </StyledFieldset>
      </StyledFieldset>
      <StyledFieldset
        className="is-vertical"
        margin="0 0 1rem 0"
      >
        <StyledLabel htmlFor="checkout-line1">Address Line 1</StyledLabel>
        <StyledInput
          id="checkout-line1"
          borderRadius="0.25rem"
          name="line1"
          onChange={e => setAddress({...address, line1: e.target.value})}
          onBlur={e => validateInput(e)}
          onFocus={e => onInputFocus(e)}
          className={line1Error && "is-error"}
          padding="1rem"
          placeholder="123 Main Street"
          required
          type="text"
          value={address.line1}
        />
        {line1Error && (
          <ErrorLine
            color={colors.red.sixHundred}
          >
            {line1Error}
          </ErrorLine>
        )}
      </StyledFieldset>
      <StyledFieldset
        className="is-vertical"
        margin="0 0 1rem 0"
      >
        <StyledLabel htmlFor="checkout-line2">Address Line 2</StyledLabel>
        <StyledInput
          id="checkout-line2"
          borderRadius="0.25rem"
          name="line2"
          onChange={e => setAddress({...address, line2: e.target.value})}
          padding="1rem"
          placeholder="Unit 420"
          type="text"
          value={address.line2}
        />
      </StyledFieldset>
      <StyledFieldset
        className="is-flex"
        margin="0 0 1rem 0"
      >
        <StyledFieldset
          className="is-vertical"
        >
          <StyledLabel htmlFor="checkout-city">City</StyledLabel>
          <StyledInput
            id="checkout-city"
            borderRadius="0.25rem"
            onBlur={e => validateInput(e)}
            onFocus={e => onInputFocus(e)}
            className={cityError && "is-error"}
            name="city"
            onChange={e => setAddress({...address, city: e.target.value})}
            padding="1rem"
            placeholder="New York"
            required
            type="text"
            value={address.city}
          />
          {cityError && (
            <ErrorLine
              color={colors.red.sixHundred}
            >
              {cityError}
            </ErrorLine>
          )}
        </StyledFieldset>
        <StyledFieldset
          className="is-vertical"
        >
          <StyledLabel htmlFor="checkout-state">State</StyledLabel>
          <StyledSelect
            id="checkout-state"
            borderRadius="0.25rem"
            className={stateError && "is-error"}
            name="state"
            onBlur={e => validateInput(e)}
            onChange={e => setAddress({...address, state: e.target.value})}
            onFocus={e => onInputFocus(e)}
            padding="1rem"
            placeholder="NY"
            required
            type="email"
            value={address.state}
            width="100%"
          >
            <option default value="">- Select a state -</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </StyledSelect>
          {stateError && (
            <ErrorLine
              color={colors.red.sixHundred}
            >
              {stateError}
            </ErrorLine>
          )}
        </StyledFieldset>
        <StyledFieldset
          className="is-vertical"
        >
          <StyledLabel htmlFor="checkout-postal">Postal Code</StyledLabel>
          <StyledInput
            id="checkout-postal"
            borderRadius="0.25rem"
            className={postalError && "is-error"}
            name="postal_code"
            onBlur={e => validateInput(e)}
            onChange={e => setAddress({...address, postal_code: e.target.value})}
            onFocus={e => onInputFocus(e)}
            padding="1rem"
            placeholder="12345"
            type="text"
            value={address.postal_code}
          />
          {postalError && (
            <ErrorLine
              color={colors.red.sixHundred}
            >
              {postalError}
            </ErrorLine>
          )}
        </StyledFieldset>
      </StyledFieldset>
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
          as={Link}
          to="/cart"
        >
          <Icon>
            <ArrowLeft size="1rem" />
          </Icon>
          <span>Back to cart</span>
        </TextLink>
        <Button
          disabled={processing || succeeded || loading}
          id="submit"
          backgroundcolor={colors.primary.sixHundred}
          color={colors.white}
          padding="1rem"
          className={processing || loading ? "is-loading" : null}
          form="checkout-shipping-form"
        >
          {processing || loading ? (
            <Loading height="1rem" width="1rem" />
          ) : (
            "Continue"
          )}
        </Button>
      </Flexbox>
    </form>
  )
}

export default ShippingForm
