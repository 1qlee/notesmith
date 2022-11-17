import React from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"

import TextLink from "../ui/TextLink"
import Content from "../ui/Content"
import { Flexbox } from "../layout/Flexbox"

const Infobox = styled.div`
  background-color: ${colors.white};
  padding: ${props => props.padding ? props.padding : "0 1rem"};
  border-radius: 0.5rem;
  border: 1px solid ${colors.gray.nineHundred};
  box-shadow: ${colors.shadow.solid};
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

const InfoItemHeading = styled.h3`
  color: ${colors.gray.nineHundred};
  font-family: ${fonts.secondary};
  font-size: 0.8rem;
  font-weight: 700;
  flex: 1;
`

const InfoItemText = styled.p`
  color: ${colors.gray.nineHundred};
  flex: 5;
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
        <Content
          headingfontfamily={fonts.secondary}
          h3fontsize="0.875rem"
          h3margin="0"
          margin="0 0 1rem 0"
        >
          <h3>Shipping information</h3>
        </Content>
        <TextLink
          color={colors.gray.nineHundred}
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
          <InfoItemHeading>Name</InfoItemHeading>
          <InfoItemText>{customer.name}</InfoItemText>
        </InfoItem>
        <InfoItem>
          <InfoItemHeading>Email</InfoItemHeading>
          <InfoItemText>{customer.email}</InfoItemText>
        </InfoItem>
        <InfoItem>
          <InfoItemHeading>Address</InfoItemHeading>
          <InfoItemText>{address.line1}, {address.line2} {address.city}, {address.state} {address.postal_code}</InfoItemText>
        </InfoItem>
        {shippingMethod && (
          <InfoItem>
            <InfoItemHeading>Shipping</InfoItemHeading>
            <InfoItemText>Ground shipping</InfoItemText>
          </InfoItem>
        )}
      </Infobox>
    </>
  )
}

export default ShippingInfo
