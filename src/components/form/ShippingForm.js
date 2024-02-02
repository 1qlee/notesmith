import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { colors, fonts } from "../../styles/variables"
import { CircleNotch } from "@phosphor-icons/react"

import { Flexbox } from "../layout/Flexbox"
import Content from "../ui/Content"
import Icon from "../ui/Icon"
import Button from "../ui/Button"

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const ShippingInfoContainer = styled.div`
  width: 100%;
`

const ShippingItemsContainer = styled.div`
  margin-bottom: 32px;
`

const ShippingItem = styled(Flexbox)`
  border-radius: 8px;
  border: ${colors.borders.black};
  transition: background-color 0.2s;
  background-color: ${colors.white};
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  &:hover {
    background-color: ${colors.gray.oneHundred};
    cursor: pointer;
  }
  &.is-selected {
    box-shadow: ${colors.shadow.focus};
    color: ${colors.gray.nineHundred};
  }
  &.is-loading {
    background-color: ${colors.white};
  }
  svg {
    &.is-loading {
      animation: ${rotate} 0.5s linear infinite;
    }
  }
`

const ShippingForm = ({
  activeCheckoutSteps,
  address,
  cartItems,
  customer,
  pid,
  selectedRate,
  setActiveCheckoutSteps,
  setAuthKey,
  setMethodValidated,
  setMethodStatus,
  setSelectedRate,
  setTax,
  toast,
}) => {
  const [loading, setLoading] = useState(false)
  const [rate, setRate] = useState({
    rate: null,
    carrier: "",
    isInternational: false,
    id: null,
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // fetch the shipping rate based on the user's address
    const createRates = async () => {
      setLoading(true)

      // fetch shipping rates for the user's cart items
      await fetch("/.netlify/functions/create-rates", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: cartItems,
          address: address,
          customer: customer,
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        if (data.error) {
          throw data.error
        }
        else {
          // save the rate to state
          setRate(data.rate)
          setLoading(false)
        }
      }).catch(error => {
        setRate({})
        setLoading(false)
        toast.error(error)
      })
    }

    if (activeCheckoutSteps === "method" && !selectedRate) {
      createRates()
    }
  }, [address, customer, activeCheckoutSteps])

  const setShippingInfo = async () => {
    try {
      const response = await fetch("/.netlify/functions/set-shipping-info", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: pid, // need pid from localStorage to update the corresponding paymentIntent
          rate: selectedRate,
        })
      })

      const data = await response.json()

      if (data.error) {
        throw data.error
      }
      else {
        setAuthKey(data.authKey)
        await createTax()
      }
    }
    catch(error) {
      toast.error(error)
      setProcessing(false)
    }
  }

  const createTax = async () => {
    try {
      const response = await fetch("/.netlify/functions/create-tax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: pid,
          cartItems: cartItems,
          address: address,
          shippingRate: selectedRate,
        })
      })

      const data = await response.json()

      if (data.error) {
        throw data.error
      }
      else {
        // we will get back tax and taxId
        setTax(data)
        setActiveCheckoutSteps("payment")
        setMethodValidated(true)
        setMethodStatus({
          msg: "Done",
          color: colors.green.sixHundred,
        })
        setLoading(false)
        setProcessing(false)
      }
    }
    catch (error) {
      setLoading(false)
      setTax({
        amount: 0,
        id: null,
      })
      toast.error(error)
      setProcessing(false)
    }
  }

  const handleSelectRate = () => {
    if (selectedRate) {
      setSelectedRate(null)
    }
    else {
      setSelectedRate(rate)
    }
  }

  const handleSelectRateKey = (e) => {
    if (e.key === "Enter") {
      handleSelectRate()
    }
  }

  // handles the submit of shipping rate
  const submitShippingInfo = () => {
    setProcessing(true)

    if (!selectedRate) {
      toast.error("Please select a shipping method")
      setProcessing(false)
    }
    else {
      setShippingInfo()
    }
  }

  return (
    <ShippingInfoContainer>
      <ShippingItemsContainer>
        {loading && (
          <ShippingItem
            className="is-loading"
            justify="flex-start"
            align="center"
            padding="1rem"
            flex="flex"
          >
            <Icon margin="0 0.5rem 0 0">
              <CircleNotch className="is-loading" size="1.25rem" color={colors.gray.sixHundred} />
            </Icon>
            <p>Calculating shipping rates...</p>
          </ShippingItem>
        )}
        {(rate.rate && !loading) && (
          <ShippingItem
            onClick={() => handleSelectRate()}
            onKeyDown={e => handleSelectRateKey(e)}
            className={selectedRate && "is-selected"}
            justify="flex-start"
            align="flex-start"
            padding="1rem"
            flex="flex"
            tabIndex={0}
          >
            <Flexbox
              flex="flex"
              justify="space-between"
              align="center"
              width="100%"
            >
              <Content
                h5fontsize="1rem"
                h5margin="0"
                smallfontfamily={fonts.secondary}
                smallfontsize="0.875rem"
                smallmargin="0"
              >
                <h5>
                  {rate.international ? (
                    "International"
                  ) : (
                    "Ground"
                  )}
                </h5>
                {rate.carrier && (
                  <small>({rate.carrier === "UPSDAP" ? "UPS" : rate.carrier})</small>
                )}
                {rate.delivery_days ? (
                  <small>{rate.delivery_days} to {rate.delivery_days + 3} business days</small>
                ) : (
                  <small>Delivery time varies</small>
                )}
              </Content>
              <Content>
                <p>
                  ${rate.formattedRate}
                </p>
              </Content>
            </Flexbox>
          </ShippingItem>
        )}
      </ShippingItemsContainer>
      <Flexbox
        flex="flex"
        justify="flex-end"
        align="center"
      >
        <Button
          disabled={!selectedRate || loading || processing}
          id="submit"
          backgroundcolor={colors.gray.nineHundred}
          color={colors.white}
          className={processing ? "is-loading" : null}
          padding="16px"
          form="checkout-shipping-form"
          onClick={() => submitShippingInfo()}
          width="200px"
        >
          {processing ? (
            <Icon>
              <CircleNotch size={16} color={colors.white} />
            </Icon>
          ) : (
            "Select"
          )}
        </Button>
      </Flexbox>
    </ShippingInfoContainer>
  )
}

export default ShippingForm
