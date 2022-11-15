import React, { useState } from "react"
import { Link } from "gatsby"
import { colors } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { ArrowLeft, CaretDown } from "phosphor-react"
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector'

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledInput, StyledLabel, SelectWrapper, SelectIcon, StyledSelect, ErrorLine } from "../form/FormComponents"
import Button from "../Button"
import Icon from "../Icon"
import Loading from "../../assets/loading.svg"
import TextLink from "../TextLink"

function InformationForm({
  address,
  customer,
  loading,
  processing,
  setAddress,
  setAddressError,
  setCustomer,
  setFormError,
  setLoading,
  setProcessing,
  setShowModal,
  setShowShippingMethod,
  showShippingMethod,
}) {
  const { cartDetails } = useShoppingCart()
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [line1Error, setLine1Error] = useState("")
  const [cityError, setCityError] = useState("")
  const [stateError, setStateError] = useState("")
  const [postalError, setPostalError] = useState("")
  const whiteList = [
    "AR",
    "AT",
    "AU",
    "BE",
    "BR",
    "CA",
    "CH",
    "CN",
    "DE",
    "DK",
    "ES",
    "FI",
    "FR",
    "GB",
    "GR",
    "HU",
    "ID",
    "IE",
    "IL",
    "IN",
    "IS",
    "IT",
    "JP",
    "KR",
    "LU",
    "MX",
    "NL",
    "NO",
    "PH",
    "PT",
    "SE",
    "US",
  ]

  // handle submitting the shipping form
  async function submitInformationForm(e) {
    setFormError("")
    e.preventDefault()
    // show processing UI state
    setProcessing(true)

    // validate the user's inputted address using easypost's API
    await fetch("/.netlify/functions/validate-address", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: address // send address from props
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      // data.errors is an array of error message strings
      if (data.errors) {
        throw data.errors
      }
      // call the function to update paymentIntent with the user's information
      updatePaymentInfo()
    }).catch(errors => {
      setProcessing(false)
      setAddressError(errors)
      // modal will handle the error message(s)
      setShowModal({
        show: true
      })
    })
  }

  async function updatePaymentInfo() {
    setFormError("")
    // update the paymentIntent with shipping form data
    await fetch("/.netlify/functions/create-payment", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cartItems: {...cartDetails}, // always send current cart items
        paymentId: localStorage.getItem("pid"), // need pid from localStorage to update the corresponding paymentIntent
        email: customer.email,
        address: {address: {...address}, name: customer.name}, // always send shipping information
        customer: customer
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      if (data.error) {
        throw data.error
      }

      setProcessing(false)
      setShowShippingMethod(true)
    }).catch(error => {
      setProcessing(false)
      setFormError(error)
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
    setFormError("")

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

  function handleAddressAutofill(res) {
    if (res) {
      const address = res.features[0].properties
      const { address_line1, address_line2, district, full_address, postcode, country, country_code, place, region, region_code } = address

      setAddress({
        line1: address_line1,
        line2: address_line2,
        city: place,
        state: "",
        postal_code: "",
        country: "",
      })
    }
    else {
      return
    }
  }

  return (
    <form
      onSubmit={submitInformationForm}
      id="checkout-shipping-form"
    >
      <Flexbox
        flex="flex"
      >
        <StyledFieldset
          margin="0 16px 16px 0"
        >
          <StyledLabel htmlFor="checkout-name">Full Name</StyledLabel>
          <StyledInput
            id="checkout-name"
            className={nameError && "is-error"}
            name="name"
            onBlur={e => validateInput(e)}
            onChange={e => setCustomer({ ...customer, name: e.target.value })}
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
            onChange={e => setCustomer({ ...customer, email: e.target.value })}
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
      </Flexbox>
      <StyledFieldset
        className="is-vertical"
        margin="0 0 1rem 0"
      >
        <StyledLabel htmlFor="checkout-line1">Address Line 1</StyledLabel>
        <StyledInput 
          id="checkout-line1"
          name="line1"
          onChange={e => setAddress({ ...address, line1: e.target.value })}
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
        className="is-vertical"
        margin="0 0 1rem 0"
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
      <Flexbox
        flex="flex"
      >
        <StyledFieldset
          margin="0 16px 16px 0"
        >
          <SelectWrapper>
            <StyledLabel htmlFor="checkout-country">Country</StyledLabel>
            <StyledSelect
              as={CountryDropdown}
              id="checkout-country"
              name="country"
              onChange={value => setAddress({ ...address, country: value })}
              required
              value={address.country}
              valueType="short"
              whitelist={whiteList}
            />
            <SelectIcon>
              <CaretDown size="1rem" />
            </SelectIcon>
          </SelectWrapper>
        </StyledFieldset>
        <StyledFieldset
          margin="0 16px 16px 0"
        >
          <SelectWrapper>
            <StyledLabel htmlFor="checkout-state">State / Region</StyledLabel>
            <StyledSelect
              as={RegionDropdown}
              className={stateError && "is-error"}
              country={address.country}
              countryValueType="short"
              disableWhenEmpty={true}
              id="checkout-state"
              name="state"
              onChange={value => setAddress({ ...address, state: value })}
              required
              value={address.state}
              width="100%"
            />
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
        <StyledFieldset>
          <StyledLabel htmlFor="checkout-postal">Postal Code</StyledLabel>
          <StyledInput
            id="checkout-postal"
            className={postalError && "is-error"}
            name="postal_code"
            onBlur={e => validateInput(e)}
            onFocus={e => onInputFocus(e)}
            onChange={e => setAddress({...address, postal_code: e.target.value})}
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
      </Flexbox>
      <Flexbox
        flex="flex"
        justifycontent="space-between"
        alignitems="center"
      >
        <TextLink
          color={colors.gray.nineHundred}
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
          backgroundcolor={colors.gray.nineHundred}
          color={colors.gray.oneHundred}
          padding="1rem"
          className={processing ? "is-loading" : null}
          form="checkout-shipping-form"
          type="submit"
          width="11.75rem"
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
