import React, { useState } from "react"
import { Link } from "gatsby"
import { colors } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { useFirebaseContext } from "../../utils/auth"
import { ArrowLeft, CaretDown } from "phosphor-react"

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledInput, StyledLabel, SelectWrapper, SelectIcon, StyledSelect, ErrorLine } from "../form/FormComponents"
import Button from "../Button"
import Icon from "../Icon"
import Loading from "../../assets/loading.svg"
import TextLink from "../TextLink"

function InformationForm({
  setActiveTab,
  setFormError,
  setShowModal,
  setProcessing,
  setAddress,
  setCustomer,
  setLoading,
  processing,
  customer,
  address,
  loading
}) {
  const { cartDetails } = useShoppingCart()
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [line1Error, setLine1Error] = useState("")
  const [cityError, setCityError] = useState("")
  const [stateError, setStateError] = useState("")
  const [postalError, setPostalError] = useState("")

  // handle submitting the shipping form
  async function submitInformationForm(e) {
    e.preventDefault()
    // show processing UI state
    setProcessing(true)

    // validate the user's inputted address using easypost's API
    const validateAddress = await fetch("/.netlify/functions/validate-address", {
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

      // the response object is a Promise for some reason
      response.then(obj => {
        // if the response contains any errors, throw an Error
        if (obj.errors) {
          throw obj.errors
        }
        else {
          return obj
        }
      }).then(data => {
        // call the function to update paymentIntent with the user's information
        updatePaymentInfo()
      }).catch(err => {
        setProcessing(false)
        setFormError(err)
        // modal will handle the error message(s)
        setShowModal({
          show: true
        })
      })

    })
  }

  async function updatePaymentInfo() {
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
      onSubmit={submitInformationForm}
      id="checkout-shipping-form"
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
            className={nameError && "is-error"}
            name="name"
            onBlur={e => validateInput(e)}
            onChange={e => setCustomer({...customer, name: e.target.value})}
            onFocus={e => onInputFocus(e)}
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
            className={emailError && "is-error"}
            name="email"
            onChange={e => setCustomer({...customer, email: e.target.value})}
            onBlur={e => validateInput(e)}
            onFocus={e => onInputFocus(e)}
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
          name="line1"
          onChange={e => setAddress({...address, line1: e.target.value})}
          onBlur={e => validateInput(e)}
          onFocus={e => onInputFocus(e)}
          className={line1Error && "is-error"}
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
          name="line2"
          onChange={e => setAddress({...address, line2: e.target.value})}
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
            onBlur={e => validateInput(e)}
            onFocus={e => onInputFocus(e)}
            className={cityError && "is-error"}
            name="city"
            onChange={e => setAddress({...address, city: e.target.value})}
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
          <SelectWrapper>
            <StyledLabel htmlFor="checkout-state">State</StyledLabel>
            <StyledSelect
              id="checkout-state"
              className={stateError && "is-error"}
              name="state"
              onBlur={e => validateInput(e)}
              onChange={e => setAddress({...address, state: e.target.value})}
              onFocus={e => onInputFocus(e)}
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
            <SelectIcon>
              <CaretDown size="1rem" />
            </SelectIcon>
          </SelectWrapper>
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
            className={postalError && "is-error"}
            name="postal_code"
            onBlur={e => validateInput(e)}
            onChange={e => setAddress({...address, postal_code: e.target.value})}
            onFocus={e => onInputFocus(e)}
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
        justifycontent="space-between"
        alignitems="center"
      >
        <TextLink
          color={colors.gray.sixHundred}
          hovercolor={colors.gray.nineHundred}
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
          disabled={processing}
          id="submit"
          backgroundcolor={colors.primary.sixHundred}
          color={colors.white}
          padding="1rem"
          className={processing ? "is-loading" : null}
          form="checkout-shipping-form"
          type="submit"
          width="200px"
        >
          {processing ? (
            <Loading height="1rem" width="1rem" />
          ) : (
            "Continue"
          )}
        </Button>
      </Flexbox>
    </form>
  )
}

export default InformationForm
