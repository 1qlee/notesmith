import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { colors, fonts } from "../../styles/variables"
import { convertToDecimal } from "../../utils/helper-functions"
import { CircleNotch } from "@phosphor-icons/react"

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
  border: ${colors.borders.black};
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
  setSelectedRate,
  setTax,
  toast,
}) => {
  const [loading, setLoading] = useState(false)
  const [shipmentId, setShipmentId] = useState("")
  const [shippingRate, setShippingRate] = useState({})
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

    if (activeAccordionTab === "method" && !selectedRate) {
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
      toast.error(error)
      setProcessing(false)
    })
  }

  const createTax = async () => {
    fetch("/.netlify/functions/create-tax", {
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

      // we will get back tax and taxId
      setTax(data)
      setActiveAccordionTab("payment")
      setMethodValidated(true)
      setMethodStatus({
        msg: "Done",
        color: colors.gray.oneHundred,
        background: colors.gray.nineHundred,
      })
      setLoading(false)
      setProcessing(false)
    }).catch(error => {
      setLoading(false)
      setTax({
        amount: 0,
        id: null,
      })
      toast.error(error)
      setProcessing(false)
    })
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
            onClick={() => setSelectedRate(shippingRate)}
            className={selectedRate && "is-selected"}
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
                paragraphmargin="0"
                paragraphfontweight="700"
                paragraphcolor={selectedRate ? colors.gray.twoHundred : colors.gray.nineHundred}
                smallcolor={selectedRate ? colors.gray.twoHundred : colors.gray.nineHundred}
                smallfontfamily={fonts.secondary}
                smallfontsize="0.75rem"
                smallmargin="0"
              >
                <p>
                  {shippingRate.international ? (
                    "International shipping"
                  ) : (
                    "Ground shipping"
                  )}
                </p>
                {shippingRate.delivery_days ? (
                  <small>{shippingRate.delivery_days} to {shippingRate.delivery_days + 3} business days</small>
                ) : (
                  <small>Delivery time varies</small>
                )}
              </Content>
              <Tag
                color={selectedRate ? colors.gray.nineHundred : colors.gray.oneHundred}
                backgroundcolor={selectedRate ? colors.gray.oneHundred : colors.gray.nineHundred}
                fontfamily={fonts.secondary}
                fontweight="400"
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
          disabled={!selectedRate || loading || processing}
          id="submit"
          backgroundcolor={colors.gray.nineHundred}
          color={colors.white}
          className={(loading || processing)? "is-loading" : null}
          padding="16px"
          form="checkout-shipping-form"
          onClick={() => submitShippingInfo()}
          width="200px"
        >
          {(loading || processing) ? (
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
