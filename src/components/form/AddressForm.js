import React, { useState } from "react"
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
  setActiveTab,
  setAddress,
  setAddressError,
  setCustomer,
  setShowModal,
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

  async function validateAddress() {
    // validate the user's inputted address using easypost's API
    fetch("/.netlify/functions/validate-address", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: address // send address from props
      })
    }).then(res => res.json()
    ).then(data => {
      setLoading(false)
      // data.errors is an array of error message strings
      if (data.errors) {
        throw {
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
    }).catch(errors => {
      setAddressError(errors.errors)
      // modal will handle the error message(s)
      setShowModal({
        show: true
      })
      return errors
    })
  }

  async function updateAddress() {

  }

  function handleSubmitAddress() {
    setLoading(true)
    const addressElement = elements.getElement('address')

    addressElement.getValue().then(async res => {
      const isEmailVerified = regex.email.test(customer.email)
      // regex check emailValue
      if (!isEmailVerified) {
        setEmailError("Please enter a valid email address.")
      }
      else {
        setCustomer({
          ...customer,
          name: res.value.name,
        })
      }

      if (res.complete && isEmailVerified) {
        // validate the user's inputted address using easypost's API
        const isAddressValid = validateAddress().isValid

        if (isAddressValid) {
          setAddress(res.value.address)
          setLoading(false)
          setActiveTab({
            ...activeTab,
            index: 2,
          })
        }
      }
      else {
        setLoading(false)
      }
    })
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
          padding="16px"
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
