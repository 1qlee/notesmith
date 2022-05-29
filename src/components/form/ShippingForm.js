import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { Loader } from "@googlemaps/js-api-loader"
import { colors } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { CheckCircle, Circle, CircleNotch, ArrowLeft } from "phosphor-react"

import { Flexbox } from "../layout/Flexbox"
import { StyledLabel } from "../form/FormComponents"
import ShippingInfo from "./ShippingInfo"
import Icon from "../Icon"
import Content from "../Content"
import TextLink from "../TextLink"
import Button from "../Button"

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

const ShippingItem = styled(Flexbox)`
  &:hover {
    background-color: ${colors.primary.hover};
    cursor: pointer;
  }
  &.is-selected {
    background-color: ${colors.primary.active};
  }
  &.is-loading {
    background-color: ${colors.gray.oneHundred};
  }
  svg {
    &.is-loading {
      animation: ${rotate} 0.5s linear infinite;
    }
  }
  &:first-child,
  &:last-child {
    border-radius: 0.25rem;
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

  // load Google Maps API
  const loader = new Loader({
    apiKey: process.env.GATSBY_GOOGLE_MAPS_API,
    version: "weekly",
  });

  useEffect(() => {
    // fetch the cheapest shipping rate based on the user's address
    const createRates = async () => {
      setFormError("")
      setLoading(true)

      // fetch shipping rates for the user's cart items
      const shippingPrice = await fetch("/.netlify/functions/create-rates", {
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
      // load Google Maps API constructor
      loader.load().then(async google => {
        const geocoder = new google.maps.Geocoder()
        // call API geocode endpoint to get county information from address
        await geocoder.geocode({ "address": `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}` }, (results, status) => {
          if (status === "OK") {
            // tax is sometimes determined by 'sublocality' or 'locality' at its highest specificity
            const locality = results[0].address_components.find(elem => elem.types.find(type => type === "sublocality" || type === "locality"))
            // otherwise it is simply determined by county
            const county = results[0].address_components.find(elem => elem.types.find(type => type === "administrative_area_level_2"))
            const taxCounties = { locality: locality.long_name, county: county.long_name }

            fetchTax(taxCounties)
          }
          else {
            setProcessing(false)
            console.log("Geocode request was not successful: " + status)
          }
        })
      }).then(res => {
        setProcessing(false)
        setShowShippingMethod(false)
        setActiveTab(2)
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

  const fetchTax = async (taxCounties) => {
    await fetch("/.netlify/functions/create-tax", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: pid, // need pid from localStorage to update the corresponding paymentIntent
        locality: taxCounties.locality,
        county: taxCounties.county,
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
      <div>
        <StyledLabel>Shipping method</StyledLabel>
        <Flexbox
          borderradius="0"
          border={`1px solid ${colors.gray.threeHundred}`}
          margin="0 0 2rem"
        >
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
              onClick={index => {
                setShippingMethod(cheapestRate.id)
                setSelectedRate(cheapestRate)
              }}
              className={shippingMethod === cheapestRate.id ? "is-selected" : null}
              justifycontent="flex-start"
              alignitems="flex-start"
              padding="1rem"
              flex="flex"
            >
              {shippingMethod === cheapestRate.id ? (
                <Icon margin="0 0.5rem 0 0">
                  <CheckCircle color={colors.primary.sixHundred} size="1rem" weight="bold" />
                </Icon>
              ) : (
                <Icon margin="0 0.5rem 0 0">
                  <Circle size="1rem" />
                </Icon>
              )}
              <Flexbox
                flex="flex"
                justifycontent="space-between"
                width="100%"
              >
                <Content
                  paragraphcolor={colors.gray.nineHundred}
                  paragraphlineheight="1"
                  paragraphmarginbottom="0.25rem"
                  smallcolor={colors.gray.sixHundred}
                  smallfontsize="0.875rem"
                  smallmargin="0"
                >
                  <p>Ground shipping</p>
                  {cheapestRate.delivery_days && (
                    <small>{cheapestRate.delivery_days} to {cheapestRate.delivery_days + 3} business days</small>
                  )}
                </Content>
                <p>${cheapestRate.rate}</p>
              </Flexbox>
            </ShippingItem>
          )}
        </Flexbox>
        <Flexbox
          flex="flex"
          justifycontent="space-between"
          alignitems="center"
        >
          <TextLink
            color={colors.primary.threeHundred}
            hovercolor={colors.primary.sixHundred}
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
            backgroundcolor={colors.primary.sixHundred}
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
      </div>
    </ShippingInfoContainer>
  )
}

export default ShippingForm
