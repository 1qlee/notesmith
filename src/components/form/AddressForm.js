import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { colors, regex } from "../../styles/variables"
import { ArrowLeft, CircleNotch } from "phosphor-react"
import { AddressElement, useElements } from "@stripe/react-stripe-js"

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "./FormComponents"
import Button from "../ui/Button"
import Icon from "../ui/Icon"
import TextLink from "../ui/TextLink"

function AddressForm({
  activeTab,
  address,
  customer,
  pid,
  setActiveTab,
  setAddress,
  setAddressError,
  setCustomer,
  setShowModal,
  toast,
}) {
  const elements = useElements()
  const [addressElementLoaded, setAddressElementLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [addressOptions, setAddressOptions] = useState({
    mode: "shipping",
    autocomplete: {
      mode: "automatic",
    },
  })
  
  useEffect(() => {
    if (addressElementLoaded) {
      console.log(address)
      setAddressOptions({
        ...addressOptions,
        defaultValues: {
          name: customer.name,
          address: {
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country || 'US',
          },
        },
      })
      console.log(addressOptions)
    }

    console.log(addressOptions)
  }, [address, addressElementLoaded, customer])

  async function validateAddress(address) {
    // validate the user's inputted address using easypost's API
    const response = await fetch("/.netlify/functions/validate-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: address,
      })
    })
    const data = await response.json()

    if (data.errors) {
      setAddressError(data.errors)
      setShowModal({
        show: true
      })
      return {
        errors: data.errors,
        isValid: false,
      }
    }
    else {
      return {
        errors: null,
        isValid: true,
      }
    }
  }

  async function updateAddress() {
    const response = await fetch("/.netlify/functions/update-address", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        paymentId: pid,
        address: address,
        name: customer.name,
        email: customer.email,
      })
    })
    const data = await response.json()

    if (data.errors) {
      toast.error(data.errors)
    }
  }

  async function handleSubmitAddress() {
    setLoading(true)
    const addressElement = elements.getElement('address')
    const stripeAddress = await addressElement.getValue()
    const inputtedAddress = stripeAddress.value
    const isEmailVerified = regex.email.test(customer.email)

    setAddress(inputtedAddress.address)
    setCustomer({
      ...customer,
      name: inputtedAddress.name,
    })

    if (!isEmailVerified) {
      setEmailError("Please enter a valid email address.")
    }

    if (stripeAddress.complete && isEmailVerified) {
      const isAddressValid = await validateAddress(stripeAddress.value.address)

      if (isAddressValid.isValid) {
        const isAddressUpdated = await updateAddress()
        setActiveTab({
          ...activeTab,
          index: 2,
        })
      }
      setLoading(false)
    }
    else {
      setLoading(false)
    }
  }

  function handleEmailChange(value) {
    setCustomer({
      ...customer,
      email: value.trim()
    })
    setEmailError("")
  }

  return (
    <>
      <StyledFieldset
        className="is-vertical"
      >
        <StyledLabel htmlFor="address-email">Email</StyledLabel>
        <StyledInput
          id="address-email"
          className={emailError && "is-error"}
          name="email"
          onChange={e => handleEmailChange(e.target.value)}
          placeholder="address@email.com"
          required
          type="email"
          autoComplete="chrome-off"
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
      <AddressElement 
        options={addressOptions}
        onReady={e => setAddressElementLoaded(true)}
      />
      <Flexbox
        flex="flex"
        justifycontent="space-between"
        alignitems="center"
        margin="32px 0 0"
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
          backgroundcolor={colors.gray.nineHundred}
          className={loading ? "is-loading" : null}
          color={colors.gray.oneHundred}
          disabled={loading || Object.keys(address).length === 0}
          onClick={() => handleSubmitAddress()}
          padding="1rem"
          width="200px"
        >
          {loading ? (
            <Icon>
              <CircleNotch size={16} />
            </Icon>
          ) : (
            "Submit"
          )}
        </Button>
      </Flexbox>
    </>
  )
}

export default AddressForm
