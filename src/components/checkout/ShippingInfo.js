import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import TextLink from "../TextLink"

const Infobox = styled.div`
  padding: 0 1rem;
  border: 1px solid ${colors.gray.threeHundred};
  border-radius: 0.25rem;
  margin-bottom: 2rem;
  width: 500px;
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
  margin: 0;
`

const ShippingInfo = ({ address, customer, setActiveTab }) => {
  const [loading, setLoading] = useState(false)
  const [rates, setRates] = useState()

  useEffect(() => {
    async function createShippingLabels() {
      setLoading(true)

      const shippingPrice = await fetch("/.netlify/functions/create-shipping", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: {...address},
          name: customer.name,
          email: customer.email
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        setLoading(false)
        setRates(data.rates)
      }).catch(err => {
        console.log(err)
      })
    }

    createShippingLabels()
  }, [])

  return (
    <>
      <Infobox>
        <InfoItem>
          <InfoItemText color={colors.gray.sixHundred} flex="1">Name</InfoItemText>
          <InfoItemText flex="5">{customer.name}</InfoItemText>
          <TextLink
            color={colors.link.normal}
            hovercolor={colors.link.hover}
            onClick={() => setActiveTab(1)}
          >
            Edit
          </TextLink>
        </InfoItem>
        <InfoItem>
          <InfoItemText color={colors.gray.sixHundred} flex="1">Email</InfoItemText>
          <InfoItemText flex="5">{customer.email}</InfoItemText>
          <TextLink
            color={colors.link.normal}
            hovercolor={colors.link.hover}
            onClick={() => setActiveTab(1)}
          >
            Edit
          </TextLink>
        </InfoItem>
        <InfoItem>
          <InfoItemText color={colors.gray.sixHundred} flex="1">Ship to</InfoItemText>
          <InfoItemText flex="5">{address.line1}, {address.line2} {address.city}, {address.state} {address.postal_code}</InfoItemText>
          <TextLink
            color={colors.link.normal}
            hovercolor={colors.link.hover}
            onClick={() => setActiveTab(1)}
          >
            Edit
          </TextLink>
        </InfoItem>
      </Infobox>
      <Infobox>
        {loading && (
          <p>Calculating shipping rates...</p>
        )}
        {rates && !loading && (
          <>
            {rates.map(test => (
              <InfoItem>
                <input type="radio" />
                <InfoItemText flex="1">{test.service}</InfoItemText>
                <InfoItemText flex="0">{test.rate}</InfoItemText>
              </InfoItem>
            ))}
          </>
        )}
      </Infobox>
    </>
  )
}

export default ShippingInfo
