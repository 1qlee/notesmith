import React, { useState } from "react"
import { colors, regex } from "../../styles/variables"
import { CircleNotch } from "phosphor-react"
import { AddressElement, useElements } from "@stripe/react-stripe-js"

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "./FormComponents"
import Button from "../ui/Button"
import Icon from "../ui/Icon"

function AddressForm({
  address,
  customer,
  pid,
  setActiveAccordionTab,
  setAddress,
  setAddressError,
  setAddressStatus,
  setCustomer,
  setMethodValidated,
  setMethodStatus,
  setSelectedRate,
  setShippingMethod,
  setShippingValidated,
  setShowModal,
  shippingValidated,
  toast,
}) {
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const addressOptions = {
    mode: "shipping",
    autocomplete: {
      mode: "automatic",
    },
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
  }

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
        pid: pid,
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

    // reset any existing shipping methods
    setSelectedRate(null)
    setShippingMethod(null)
    setMethodValidated(false)
    setMethodStatus({
      msg: "Submit required",
      color: colors.red.oneHundred,
      background: colors.red.sixHundred,
    })

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
        await updateAddress()
        setActiveAccordionTab("method")
        setShippingValidated(true)
        setAddressStatus({
          msg: "Done",
          color: colors.green.oneHundred,
          background: colors.green.sixHundred,
        })
      }
      setLoading(false)
    }
    else {
      setShippingValidated(false)
      setAddressStatus({
        msg: "Submit required",
        color: colors.red.oneHundred,
        background: colors.red.sixHundred,
      })
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

  function handleAddressChange(e) {
    if (e.complete) {
      const changedAddress = e.value.address
      const addressHasChanged = JSON.stringify(changedAddress) !== JSON.stringify(address)
      const nameHasChanged = e.value.name !== customer.name
      // compared changedAddress to address to see if any values have changed
      if ((addressHasChanged || nameHasChanged) && shippingValidated) {
        setAddressStatus({
          msg: "Submit changes",
          color: colors.yellow.oneHundred,
          background: colors.yellow.sixHundred,
        })
      }
      else {
        setAddressStatus({
          msg: "Done",
          color: colors.green.oneHundred,
          background: colors.green.sixHundred,
        })
      }

      if (!shippingValidated) {
        setAddressStatus({
          msg: "Submit required",
          color: colors.red.oneHundred,
          background: colors.red.sixHundred,
        })
      }
    }
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
        onChange={e => handleAddressChange(e)}
      />
      <Flexbox
        flex="flex"
        justifycontent="flex-end"
        alignitems="center"
        margin="32px 0 0"
      >
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
