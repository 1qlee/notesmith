import React, { useState } from "react"
import { colors, regex } from "../../styles/variables"
import { CircleNotch } from "@phosphor-icons/react"
import { AddressElement, useElements } from "@stripe/react-stripe-js"

import { Flexbox } from "../layout/Flexbox"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "./FormComponents"
import Button from "../ui/Button"
import Icon from "../ui/Icon"

function AddressForm({
  address,
  customer,
  pid,
  setActiveCheckoutSteps,
  setAddress,
  setAddressError,
  setAddressStatus,
  setCustomer,
  setMethodValidated,
  setMethodStatus,
  setSelectedRate,
  setShippingValidated,
  setShowModal,
  setTax,
  shippingValidated,
  toast,
}) {
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const isInternational = address.country !== "US"
  const intlAddressOptions = {
    mode: "shipping",
    autocomplete: {
      mode: "automatic",
    },
    fields: {
      phone: "always",
    },
    validation: {
      phone: {
        required: "always",
      }
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
      phone: address.phone,
    },
  }
  const domesticAddressOptions = {
    mode: "shipping",
    autocomplete: {
      mode: "automatic",
    },
    fields: {
      phone: "never",
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

  async function validateAddress(address, name, phone) {
    // validate the user's inputted address using easypost's API
    const response = await fetch("/.netlify/functions/validate-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: address,
        name: name,
        phone: phone,
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
      setAddress(data.address)
      return {
        errors: null,
        isValid: true,
      }
    }
  }

  async function updateReceiptEmail() {
    const response = await fetch("/.netlify/functions/update-receipt-email", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        pid: pid,
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
    const { name, phone, address } = inputtedAddress
    const isEmailVerified = regex.email.test(customer.email)

    // reset any existing shipping methods
    setSelectedRate(null)
    setTax({})
    setMethodValidated(false)
    setMethodStatus({
      msg: "Required",
      color: colors.red.sixHundred,
    })
    setAddress(address)

    if (isInternational) {
      setCustomer({
        ...customer,
        name: name,
        phone: phone,
      })
    }
    else {
      setCustomer({
        ...customer,
        name: name,
      })
    }

    if (!isEmailVerified) {
      setEmailError("Please enter a valid email address.")
    }

    if (stripeAddress.complete && isEmailVerified) {
      const isAddressValid = await validateAddress(address, name, phone)

      if (isAddressValid.isValid) {
        await updateReceiptEmail()
        setActiveCheckoutSteps("method")
        setShippingValidated(true)
        setAddressStatus({
          msg: "Done",
          color: colors.green.sixHundred,
        })
      }
      setLoading(false)
    }
    else {
      setShippingValidated(false)
      setAddressStatus({
        msg: "Required",
        color: colors.red.sixHundred,
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
    const { phone, address } = e.value
    
    if (phone) {
      setAddress({
        ...address,
      })
      setCustomer({
        ...customer,
        phone: phone,
      })
    }
    else {
      setAddress(address)
    }

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
          color: colors.green.sixHundred,
        })
      }

      if (!shippingValidated) {
        setAddressStatus({
          msg: "Required",
          color: colors.red.sixHundred,
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
          fontsize="1rem"
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
      <AddressElement
        options={isInternational ? intlAddressOptions : domesticAddressOptions}
        onChange={e => handleAddressChange(e)}
      />
      <Flexbox
        flex="flex"
        justify="flex-end"
        align="center"
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
