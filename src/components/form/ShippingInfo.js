import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import TextLink from "../TextLink"
import { StyledLabel } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"

const Infobox = styled.div`
  background-color: ${colors.white};
  padding: ${props => props.padding ? props.padding : "0 1rem"};
  border-radius: 0.25rem;
  border: 1px solid ${colors.gray.threeHundred};
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

function ShippingInfo({
  address,
  customer,
  setActiveTab,
  setShowShippingMethod,
  shippingMethod,
}) {
  return (
    <>
      <Flexbox
        flex="flex"
        alignitems="center"
        justifycontent="space-between"
      >
        <StyledLabel>Shipping Information</StyledLabel>
        <TextLink
          color={colors.primary.threeHundred}
          hovercolor={colors.primary.sixHundred}
          onClick={() => {
            setActiveTab(1)
            setShowShippingMethod(false)
          }}
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
            <InfoItemText flex="5">Ground shipping</InfoItemText>
          </InfoItem>
        )}
      </Infobox>
    </>
  )
}

export default ShippingInfo
