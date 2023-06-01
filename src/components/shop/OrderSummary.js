import React from "react"
import styled from "styled-components"
import { colors, convertToDecimal, fonts } from "../../styles/variables"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

import { Flexbox } from "../layout/Flexbox"
import Content from "../ui/Content"
import Box from "../ui/Box"
import Tag from "../ui/Tag"

const Orders = styled.div`
  background-color: ${colors.white};
  border: ${colors.borders.black};
  margin-bottom: 16px;
  padding: 0 16px;
  p {
    font-size: 1rem;
  }
  small {
    font-size: 0.75rem;
  }
`

const OrderSection = styled.div`
  padding: 16px 0 ;
  border-bottom: 2px solid ${colors.gray.nineHundred};
`

const OrderContent = styled.div`
  overflow-y: auto;
  max-height: 300px;
`

const CapitalizedWord = styled.span`
  text-transform: capitalize;
`

function OrderSummary({ 
  cartItems,
  selectedRate, 
  tax,
  totalPrice,
}) {
  // calculate the total price of the user's cart incl shipping
  function calculateTotalPrice() {
    let calculatedPrice = totalPrice

    if (selectedRate) {
      calculatedPrice += parseFloat(selectedRate.rate)
    }
    if (tax.amount) {
      calculatedPrice += parseFloat(tax.amount)
    }

    return convertToDecimal(calculatedPrice, 2) // converts to a float value
  }

  return (
    <>
      <Orders>
        <OrderSection>
          <Content
            h5margin="0"
          >
            <h5>Order Summary</h5>
          </Content>
        </OrderSection>
        <OrderSection>
          <OrderContent>
            {cartItems.length > 0 && cartItems.map(item => (
              <Flexbox
                alignitems="center"
                flex="flex"
                key={item.id}
              >
                <Tag
                  padding="3px 6px"
                  margin="0 4px 0 0"
                  backgroundcolor={colors.gray.twoHundred}
                  color={colors.gray.nineHundred}
                >x{item.quantity}</Tag>
                <GatsbyImage
                  image={getImage(item.image)}
                  alt="product thumbnail"
                />
                <Flexbox
                  flex="flex"
                  justifycontent="space-between"
                  width="100%"
                >
                  <Box>
                    <p>{item.name}</p>
                    <Content
                      smallcolor={colors.gray.sevenHundred}
                      margin="4px 0 0"
                      smallmargin="0"
                    >
                      {item.category === "notebooks" && item.custom ? (
                        <small>
                          <CapitalizedWord>{item.coverColor}, Custom</CapitalizedWord>
                        </small>
                      ) : (
                        <small>
                          <CapitalizedWord>{item.coverColor},</CapitalizedWord> <CapitalizedWord>{item.leftPageData.template} left,</CapitalizedWord> <CapitalizedWord>{item.rightPageData.template} right</CapitalizedWord>
                        </small>
                      )}
                    </Content>
                  </Box>
                  <p>${convertToDecimal(item.price * item.quantity, 2)}</p>
                </Flexbox>
              </Flexbox>
            ))}
          </OrderContent>
        </OrderSection>
        <OrderSection>
          <Flexbox
            margin="0 0 16px"
            flex="flex"
            justifycontent="space-between"
          >
            <p>Subtotal</p>
            <p>${convertToDecimal(totalPrice, 2)}</p>
          </Flexbox>
          <Flexbox
            margin="0 0 16px"
            flex="flex"
            justifycontent="space-between"
          >
            <p>Shipping</p>
            {selectedRate ? (
              <p>${convertToDecimal(selectedRate.rate, 2)}</p>
            ) : (
              <p>---</p>
            )}
          </Flexbox>
          <Flexbox
            flex="flex"
            justifycontent="space-between"
          >
            <p>Taxes</p>
            {tax.amount ? (
              <p>${convertToDecimal(tax.amount, 2)}</p>
            ) : (
              <p>---</p>
            )}
          </Flexbox>
        </OrderSection>
        <Flexbox
          padding="16px 0"
          flex="flex"
          justifycontent="space-between"
          alignitems="flex-end"
        >
          <p>Total</p>
          <h3>${calculateTotalPrice()}</h3>
        </Flexbox>
      </Orders>
    </>
  )
}

export { Orders, OrderSection, OrderSummary}
