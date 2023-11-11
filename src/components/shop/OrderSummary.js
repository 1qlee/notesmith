import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { convertToDecimal } from "../../utils/helper-functions"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

import { Flexbox } from "../layout/Flexbox"
import Content from "../ui/Content"
import Box from "../ui/Box"

const Orders = styled.div`
  background-color: ${colors.white};
  border: ${colors.borders.black};
  margin-bottom: 16px;
  padding: 0 16px;
  small {
    font-size: 0.75rem;
  }
`

const OrderSection = styled.div`
  padding: 16px 0 ;
  border-bottom: ${colors.borders.black};
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
  coupon,
  selectedRate, 
  subtotal,
  tax,
}) {
  // calculate the total price of the user's cart incl shipping
  function calculateTotalPrice() {
    let calculatedPrice = subtotal

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
            h5fontweight="400"
            h5fontsize="1.25rem"
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
                <GatsbyImage
                  image={getImage(item.image)}
                  alt="product thumbnail"
                />
                <Flexbox
                  margin="0 0 0 8px"
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
                      {item.category === "notebooks" && (
                        <>
                          {item.bookId ? (
                            <small>
                              <CapitalizedWord>{item.coverColor}, Custom</CapitalizedWord>
                            </small>
                          ) : (
                            <small>
                              <CapitalizedWord>{item.coverColor},</CapitalizedWord> <CapitalizedWord>{item.leftPageData.template} left,</CapitalizedWord> <CapitalizedWord>{item.rightPageData.template} right</CapitalizedWord>
                            </small>
                          )}
                        </>
                      )}
                    </Content>
                  </Box>
                  <p>x {item.quantity}</p>
                  <p>${convertToDecimal(item.price, 2)}</p>
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
            <p>${convertToDecimal(subtotal, 2)}</p>
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
            margin="0 0 16px"
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
          {coupon.applied && (
            <Flexbox
              flex="flex"
              justifycontent="space-between"
            >
              <p>Coupon ({coupon.code})</p>
              {coupon.text && (
                <p>{coupon.text}</p>
              )}
            </Flexbox>
          )}
        </OrderSection>
        <Flexbox
          padding="16px 0"
          flex="flex"
          justifycontent="space-between"
          alignitems="center"
        >
          <p>Total</p>
          <Content
            paragraphmargin="0"
            paragraphfontsize="1.25rem"
            paragraphlineheight="1"
          >
            <p>${calculateTotalPrice()}</p>
          </Content>
        </Flexbox>
      </Orders>
    </>
  )
}

export { Orders, OrderSection, OrderSummary}
