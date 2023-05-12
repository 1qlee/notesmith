import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { colors, convertToDecimal, fonts } from "../../styles/variables"
import { CircleNotch, ArrowLeft } from "phosphor-react"

import { Flexbox } from "../layout/Flexbox"
import Content from "../ui/Content"
import ShippingInfo from "./ShippingInfo"
import Icon from "../ui/Icon"
import TextLink from "../ui/TextLink"
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
  activeTab,
  address,
  cartItems,
  customer,
  processing,
  selectedRate,
  setActiveTab,
  setAuthKey,
  setProcessing,
  setSelectedRate,
  setShipmentId,
  shippingMethod,
  setShippingMethod,
  setTaxRate,
  shipmentId,
  toast,
}) => {
  const [loading, setLoading] = useState(false)
  const [shippingRate, setShippingRate] = useState({})
  const pid = localStorage.getItem("pid")

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

    createRates()
  }, [address, customer])

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
    console.log(selectedRate)
    setLoading(true)
    await fetch("/.netlify/functions/create-tax", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      setLoading(false)
    }).catch(error => {
      setProcessing(false)
      toast.error(error)
    })
  }


  // calculate taxes for customers in New York
  const calculateTaxes = async () => {
    // check if customer's shipping address' state is New York
    if (address.state === "New York") {
      await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address.line1} ${address.line2} ${address.city} ${address.state} ${address.postal_code}.json?country=${address.country}&proximity=ip&types=address&access_token=${process.env.GATSBY_MAPBOX_ACCESS_API}`)
      .then(res => {
        return res.json()
      }).then(data => {
        // find the array that holds county level info
        const countyInfo = data.features[0].context.find(elem => elem.id.slice(0,8) === "district")
        const countyName = countyInfo.text

        fetchTax(countyName)
      }).then(() => {
        setProcessing(false)
        setActiveTab(2)
      }).catch(err => {
        console.log(err)
      })
    }
    else {
      // set tax to zero
      setZeroTax()
      setProcessing(false)
      setActiveTab(2)
    }
  }

  const fetchTax = async (countyName) => {
    await fetch("/.netlify/functions/create-tax", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: pid, // need pid from localStorage to update the corresponding paymentIntent
        county: countyName,
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      if (data.error) {
        throw data.error
      }

      setTaxRate(data.tax)
    }).catch(error => {
      setProcessing(false)
      toast.error(error)
    })
  }

  const setZeroTax = async () => {
    await fetch("/.netlify/functions/set-zero-tax", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: pid, // need pid from localStorage to update the corresponding paymentIntent
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      if (data.error) {
        throw data.error
      }

      setTaxRate(0)
    }).catch(error => {
      setProcessing(false)
      toast.error(error)
    })
  }

  // handles the submit of shipping rate
  const submitShippingInfo = () => {
    setProcessing(true)

    if (!shippingMethod) {
      toast.error("Please select a shipping method")
      setProcessing(false)
    }
    else {
      setShippingInfo()
    }
  }

  return (
    <ShippingInfoContainer>
      <ShippingInfo
        activeTab={activeTab}
        address={address}
        customer={customer}
        setActiveTab={setActiveTab}
        shippingMethod={shippingMethod}
      />
      <Content
        headingfontfamily={fonts.secondary}
        h3fontsize="0.875rem"
        h3margin="0"
        margin="0 0 1rem 0"
      >
        <h3>Shipping method (select one)</h3>
      </Content>
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
            onClick={() => {
              setShippingMethod(shippingRate.id)
              setSelectedRate(shippingRate)
            }}
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
        justifycontent="space-between"
        alignitems="center"
      >
        <TextLink
          className="has-icon"
          alignitems="flex-end"
          onClick={() => {
            setProcessing(false)
            setActiveTab({
              index: 1,
              heading: "Shipping address",
              text: "Please enter your shipping information below to continue."
            })
            setShippingMethod("")
            setSelectedRate(null)
            setAuthKey("")
          }}
        >
          <Icon>
            <ArrowLeft size="1rem" />
          </Icon>
          <span>Back to address</span>
        </TextLink>
        <Button
          disabled={!shippingMethod || processing}
          id="submit"
          backgroundcolor={colors.gray.nineHundred}
          color={colors.white}
          className={processing ? "is-loading" : null}
          padding="1rem"
          form="checkout-shipping-form"
          onClick={() => submitShippingInfo()}
          width="200px"
        >
        {processing ? (
          <Icon>
            <CircleNotch size="1rem" color={colors.white} />
          </Icon>
        ) : (
          "Continue to checkout"
        )}
        </Button>
      </Flexbox>
    </ShippingInfoContainer>
  )
}

export default ShippingForm
