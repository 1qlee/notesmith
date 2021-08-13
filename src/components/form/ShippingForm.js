import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { CheckCircle, Circle, ArrowLeft } from "phosphor-react"

import { Flexbox } from "../layout/Flexbox"
import { StyledLabel } from "../form/FormComponents"
import Icon from "../Icon"
import Loading from "../../assets/loading.svg"
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

const Infobox = styled.div`
  background-color: ${colors.white};
  padding: ${props => props.padding ? props.padding : "0 1rem"};
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px ${colors.shadow.float};
  margin-bottom: 2rem;
`

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${colors.gray.threeHundred};
  padding: 1rem 0;
  &:last-child {
    border-bottom: none;
  }
`

const InfoItemText = styled.p`
  color: ${props => props.color};
  flex: ${props => props.flex};
  margin: ${props => props.margin ? props.margin : 0};
`

const ShippingItem = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 0.25rem;
  padding: 1rem;
  &:hover {
    background-color: ${colors.primary.hover};
    cursor: pointer;
  }
  &.is-selected {
    background-color: ${colors.primary.active};
  }
  &.is-loading {
    box-shadow: 0 2px 0 ${colors.green.sixHundred}, 0 -2px 0 ${colors.green.sixHundred}, 2px 0 0 ${colors.green.sixHundred}, -2px 0 0 ${colors.green.sixHundred};
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
  customer,
  processing,
  selectedRate,
  setActiveTab,
  setAuthKey,
  setFormError,
  setProcessing,
  setSelectedRate,
  setShipmentId,
  setTaxRate,
  shipmentId,
}) => {
  const { cartDetails } = useShoppingCart()
  const [loading, setLoading] = useState(false)
  const [cheapestRate, setCheapestRate] = useState()
  const [shippingMethod, setShippingMethod] = useState()
  const pid = localStorage.getItem("pid")

  useEffect(() => {
    // fetch the cheapest shipping rate based on the user's address
    const createRates = async () => {
      setLoading(true)

      // fetch shipping rates for the user's cart items
      const shippingPrice = await fetch("/.netlify/functions/create-rates", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: {...address},
          name: customer.name,
          email: customer.email,
          productData: cartDetails
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        // save the cheapest rate to state
        setCheapestRate(data.cheapestRate)
        // save the shipment id to state
        setShipmentId(data.shipmentId)
        setLoading(false)
      }).catch(err => {
        setFormError(err.msg)
      })
    }

    createRates()
  }, [])

  // calculate taxes using Taxjar's API
  const calculateTaxes = async () => {
    const totalTaxes = await fetch("/.netlify/functions/create-tax", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: pid, // need pid from localStorage to update the corresponding paymentIntent
        address: address,
        shippingRate: cheapestRate.rate,
        productData: cartDetails,
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      setTaxRate(data.tax)
      setProcessing(false)
      setActiveTab(3)
    }).catch(error => {
      setProcessing(false)
      setFormError(error.msg)
    })
  }

  const setShippingInfo = async () => {
    await fetch("/.netlify/functions/set-shipping-info", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: pid, // need pid from localStorage to update the corresponding paymentIntent
        shipmentId: shipmentId,
        shippingRate: selectedRate
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      setAuthKey(data.authKey)
      calculateTaxes()
    }).catch(error => {
      setProcessing(false)
      setFormError(error.msg)
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
      <Flexbox
        flex="flex"
        alignitems="center"
        justifycontent="space-between"
        padding="0 1rem 0 0"
      >
        <StyledLabel>Shipping Information</StyledLabel>
        <TextLink
          color={colors.link.normal}
          hovercolor={colors.link.hover}
          onClick={() => setActiveTab(1)}
          margin="0 0 0.5rem 0"
        >
          Edit
        </TextLink>
      </Flexbox>
      <Infobox>
        <InfoItem>
          <InfoItemText color={colors.gray.sixHundred} flex="1">Name</InfoItemText>
          <InfoItemText flex="5">{customer.name}</InfoItemText>
        </InfoItem>
        <InfoItem>
          <InfoItemText color={colors.gray.sixHundred} flex="1">Email</InfoItemText>
          <InfoItemText flex="5">{customer.email}</InfoItemText>
        </InfoItem>
        <InfoItem>
          <InfoItemText color={colors.gray.sixHundred} flex="1">Ship to</InfoItemText>
          <InfoItemText flex="5">{address.line1}, {address.line2} {address.city}, {address.state} {address.postal_code}</InfoItemText>
        </InfoItem>
        {shippingMethod && (
          <InfoItem>
            <InfoItemText color={colors.gray.sixHundred} flex="1">Shipping</InfoItemText>
            <InfoItemText flex="5">{cheapestRate.service} ({cheapestRate.carrier})</InfoItemText>
          </InfoItem>
        )}
      </Infobox>
      {activeTab === 2 && (
        <>
          <StyledLabel>Shipping method</StyledLabel>
          <Infobox
            padding="0"
          >
            {loading && (
              <ShippingItem className="is-loading">
                <Loading className="is-loading" height="1rem" width="1rem" style={{stroke: colors.green.sixHundred, fill: colors.green.sixHundred}} />
                <InfoItemText flex="1" margin="0 0.5rem">Calculating shipping rates...</InfoItemText>
              </ShippingItem>
            )}
            {cheapestRate && !loading && (
              <ShippingItem
                onClick={index => {
                  setShippingMethod(cheapestRate.id)
                  setSelectedRate(cheapestRate)
                }}
                className={shippingMethod === cheapestRate.id ? "is-selected" : null}
              >
                {shippingMethod === cheapestRate.id ? (
                  <Icon>
                    <CheckCircle size="1rem" />
                  </Icon>
                ) : (
                  <Icon>
                    <Circle size="1rem" />
                  </Icon>
                )}
                <InfoItemText flex="1" margin="0 0.5rem">{cheapestRate.service} ({cheapestRate.carrier})</InfoItemText>
                <InfoItemText flex="0">${cheapestRate.rate}</InfoItemText>
              </ShippingItem>
            )}
          </Infobox>
          <Flexbox
            flex="flex"
            justifycontent="space-between"
            alignitems="center"
          >
            <TextLink
              color={colors.link.normal}
              hovercolor={colors.link.hover}
              className="has-icon"
              alignitems="flex-end"
              onClick={() => setActiveTab(1)}
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
              <Loading height="1rem" width="1rem" />
            ) : (
              "Continue"
            )}
            </Button>
          </Flexbox>
        </>
      )}
    </ShippingInfoContainer>
  )
}

export default ShippingForm
