import React from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"

import TextLink from "../ui/TextLink"
import Content from "../ui/Content"
import { Flexbox } from "../layout/Flexbox"

const Infobox = styled.div`
  background-color: ${colors.white};
  margin-bottom: 2rem;
`

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
`

const InfoItemHeading = styled.h3`
  color: ${colors.gray.nineHundred};
  font-family: ${fonts.secondary};
  font-size: 1rem;
  font-weight: 500;
  flex: 1;
  line-height: 1.5;
`

const InfoItemText = styled.p`
  color: ${colors.gray.nineHundred};
  flex: 5;
  line-height: 1.5;
`

function ShippingInfo({
  activeTab,
  address,
  customer,
  setActiveTab,
  shippingMethod,
}) {
  return (
    <>
      <Flexbox
        flex="flex"
        align="center"
        justify="space-between"
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
          onClick={() => setActiveTab({
            ...activeTab,
            index: 1,
          })}
          margin="0 0 8px"
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
            <InfoItemText>Ground</InfoItemText>
          </InfoItem>
        )}
      </Infobox>
    </>
  )
}

export { ShippingInfo, InfoItem, InfoItemHeading, InfoItemText, Infobox}
