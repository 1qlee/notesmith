import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { colors, convertToDecimal, fonts } from "../../styles/variables"
import { CircleNotch } from "phosphor-react"

import { Flexbox } from "../layout/Flexbox"
import Content from "../ui/Content"
import Icon from "../ui/Icon"
import Button from "../ui/Button"
import Tag from "../ui/Tag"

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
  transition: background-color 0.2s;
  background-color: ${colors.gray.twoHundred};
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  &:hover {
    background-color: ${colors.gray.threeHundred};
    cursor: pointer;
  }
  &.is-selected {
    background-color: ${colors.gray.nineHundred};
  }
  &.is-loading {
    background-color: ${colors.gray.oneHundred};
  }
  svg {
    &.is-loading {
      animation: ${rotate} 0.5s linear infinite;
    }
  }
`

const ShippingForm = ({
  activeAccordionTab,
  address,
  cartItems,
  customer,
  pid,
  selectedRate,
  setActiveAccordionTab,
  setAuthKey,
  setMethodValidated,
  setMethodStatus,
  setProcessing,
  setSelectedRate,
  setShippingMethod,
  setTaxRate,
  shippingMethod,
  toast,
}) => {
  const [loading, setLoading] = useState(false)
  const [shipmentId, setShipmentId] = useState("")
  const [shippingRate, setShippingRate] = useState({})

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
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        if (data.error) {
          throw data.error
        }
        // save the rate to state
        setShippingRate(data.rate)
        // save the shipment id to state
        setShipmentId(data.shipmentId)
        setLoading(false)
      }).catch(error => {
        setLoading(false)
        toast.error(error)
      })
    }

    if (activeAccordionTab === "method" && Object.keys(shippingMethod).length === 0) {
      createRates()
    }
  }, [address, customer, activeAccordionTab])

  const setShippingInfo = async () => {
    await fetch("/.netlify/functions/set-shipping-info", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: pid, // need pid from localStorage to update the corresponding paymentIntent
        shipmentId: shipmentId,
        rateId: selectedRate.id,
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      if (data.error) {
        throw data.error
      }

      setAuthKey(data.authKey)
      createTax()
    }).catch(error => {
      setProcessing(false)
      toast.error(error)
    })
  }

  const createTax = async () => {
    await fetch("/.netlify/functions/create-tax", {
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
    }).then(res => {
      return res.json()
    }).then(data => {
      if (data.error) {
        throw data.error
      }

      setTaxRate(data.totalTax.amount)
      setActiveAccordionTab("payment")
      setMethodValidated(true)
      setMethodStatus({
        msg: "Done",
        color: colors.green.oneHundred,
        background: colors.green.sixHundred,
      })
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      toast.error(error)
    })
  }

  const handleRateSelect = () => {
    setShippingMethod(shippingRate.id)
    setSelectedRate(shippingRate)
  }

  // handles the submit of shipping rate
  const submitShippingInfo = () => {
    setLoading(true)

    if (!shippingMethod) {
      toast.error("Please select a shipping method")
      setLoading(false)
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
            justifycontent="flex-start"
            alignitems="center"
            padding="1rem"
            flex="flex"
          >
            <Icon margin="0 0.5rem 0 0">
              <CircleNotch className="is-loading" size="1.25rem" color={colors.gray.sixHundred} />
            </Icon>
            <p>Calculating shipping rates...</p>
          </ShippingItem>
        )}
        {shippingRate && !loading && (
          <ShippingItem
            onClick={() => handleRateSelect()}
            className={shippingMethod === shippingRate.id && "is-selected"}
            justifycontent="flex-start"
            alignitems="flex-start"
            padding="1rem"
            flex="flex"
          >
            <Flexbox
              flex="flex"
              justifycontent="space-between"
              alignitems="center"
              width="100%"
            >
              <Content
                paragraphfontfamily={fonts.secondary}
                paragraphfontsize="0.875rem"
                paragraphmarginbottom="0"
                paragraphfontweight="700"
                paragraphcolor={shippingMethod === shippingRate.id ? colors.gray.twoHundred : colors.gray.nineHundred}
                smallcolor={shippingMethod === shippingRate.id ? colors.gray.twoHundred : colors.gray.nineHundred}
                smallfontfamily={fonts.secondary}
                smallfontsize="0.75rem"
                smallmargin="0"
              >
                <p>
                  {shippingRate.service === "Priority" ? (
                    "Ground shipping"
                  ) : (
                    "International shipping"
                  )}
                </p>
                {shippingRate.delivery_days && (
                  <small>{shippingRate.delivery_days} to {shippingRate.delivery_days + 3} business days</small>
                )}
              </Content>
              <Tag
                color={shippingMethod === shippingRate.id ? colors.gray.nineHundred : colors.gray.oneHundred}
                backgroundcolor={shippingMethod === shippingRate.id ? colors.gray.oneHundred : colors.gray.nineHundred}
                fontfamily={fonts.secondary}
                fontsize="0.875rem"
              >
                ${convertToDecimal(shippingRate.rate, 2)}
              </Tag>
            </Flexbox>
          </ShippingItem>
        )}
      </ShippingItemsContainer>
      <Flexbox
        flex="flex"
        justifycontent="flex-end"
        alignitems="center"
      >
        <Button
          disabled={!shippingMethod || loading}
          id="submit"
          backgroundcolor={colors.gray.nineHundred}
          color={colors.white}
          className={loading ? "is-loading" : null}
          padding="16px"
          form="checkout-shipping-form"
          onClick={() => submitShippingInfo()}
          width="200px"
        >
          {loading ? (
            <Icon>
              <CircleNotch size={16} color={colors.white} />
            </Icon>
          ) : (
            "Submit"
          )}
        </Button>
      </Flexbox>
    </ShippingInfoContainer>
  )
}

export default ShippingForm
