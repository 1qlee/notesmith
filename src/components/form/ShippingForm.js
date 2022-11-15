import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { colors, fonts } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { CheckCircle, Circle, CircleNotch, ArrowLeft } from "phosphor-react"

import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"
import ShippingInfo from "./ShippingInfo"
import Icon from "../Icon"
import TextLink from "../TextLink"
import Button from "../Button"
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
  margin-bottom: 2rem;
`

const ShippingItem = styled(Flexbox)`
  border: 1px solid ${colors.gray.nineHundred}; 
  border-radius: 0.5rem;
  box-shadow: ${colors.shadow.solid};
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    background-color: ${colors.gray.oneHundred};
    cursor: pointer;
  }
  &.is-selected {
    transform: translate(3px, 3px);
    box-shadow: 1px 1px 0 ${colors.gray.nineHundred};
    background-color: ${colors.yellow.threeHundred};
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
  address,
  customer,
  processing,
  selectedRate,
  setAddress,
  setActiveTab,
  setAuthKey,
  setFormError,
  setProcessing,
  setSelectedRate,
  setShipmentId,
  setShowShippingMethod,
  shippingMethod,
  setShippingMethod,
  setTaxRate,
  shipmentId,
}) => {
  const { cartDetails } = useShoppingCart()
  const [loading, setLoading] = useState(false)
  const [cheapestRate, setCheapestRate] = useState()
  const [allRates, setAllRates] = useState()
  const pid = localStorage.getItem("pid")

  useEffect(() => {
    // fetch the cheapest shipping rate based on the user's address
    const createRates = async () => {
      setFormError("")
      setLoading(true)

      // fetch shipping rates for the user's cart items
      await fetch("/.netlify/functions/create-rates", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: pid,
          cartItems: cartDetails,
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        if (data.error) {
          throw data.error
        }
        // save the cheapest rate to state
        setCheapestRate(data.cheapestRate)
        // save all rates to state
        setAllRates(data.allRates)
        // save the shipment id to state
        setShipmentId(data.shipmentId)
        setLoading(false)
      }).catch(error => {
        setLoading(false)
        setFormError(error)
      })
    }

    createRates()
  }, [address, customer, cartDetails])

  const setShippingInfo = async () => {
    setFormError("")

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
      calculateTaxes()
    }).catch(error => {
      setProcessing(false)
      setFormError(error)
    })
  }

  // calculate taxes for customers in New York
  const calculateTaxes = async () => {
    setFormError("")
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
        setShowShippingMethod(false)
        setActiveTab(2)
      }).catch(err => {
        console.log(err)
      })
    }
    else {
      // set tax to zero
      setZeroTax()
      setProcessing(false)
      setShowShippingMethod(false)
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
      setFormError(error)
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
      setFormError(error)
    })
  }

  // handles the submit of shipping rate
  const submitShippingInfo = () => {
    setProcessing(true)

    if (!shippingMethod) {
      setFormError({
        msg: "Please select a shipping method."
      })
      setProcessing(false)
    }
    else {
      setShippingInfo()
    }
  }

  return (
    <ShippingInfoContainer>
      <ShippingInfo
        address={address}
        customer={customer}
        setActiveTab={setActiveTab}
        shippingMethod={shippingMethod}
        setShowShippingMethod={setShowShippingMethod}
      />
      <Content
        headingfontfamily={fonts.secondary}
        h3fontsize="0.875rem"
        h3margin="0"
        margin="0 0 1rem 0"
      >
        <h3>Shipping method</h3>
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
        {cheapestRate && !loading && (
          <ShippingItem
            onClick={() => {
              setShippingMethod(cheapestRate.id)
              setSelectedRate(cheapestRate)
            }}
            className={shippingMethod === cheapestRate.id ? "is-selected" : null}
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
              <Flexbox
                flex="flex"
                alignitems="center"
              >
                {shippingMethod === cheapestRate.id ? (
                  <Icon margin="0 0.5rem 0 0">
                    <CheckCircle color={colors.gray.nineHundred} size="1rem" weight="fill" />
                  </Icon>
                ) : (
                  <Icon margin="0 0.5rem 0 0">
                    <Circle size="1rem" />
                  </Icon>
                )}
                <div>
                  <p>Ground shipping</p>
                  {cheapestRate.delivery_days && (
                    <small>{cheapestRate.delivery_days} to {cheapestRate.delivery_days + 3} business days</small>
                  )}
                </div>
              </Flexbox>
              <Tag
                color={colors.gray.oneHundred}
                backgroundcolor={colors.gray.nineHundred}
                fontfamily={fonts.secondary}
              >
                ${cheapestRate.rate}
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
            setShowShippingMethod(false)
          }}
        >
          <Icon>
            <ArrowLeft size="1rem" />
          </Icon>
          <span>Back to info</span>
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
          "Continue"
        )}
        </Button>
      </Flexbox>
    </ShippingInfoContainer>
  )
}

export default ShippingForm
