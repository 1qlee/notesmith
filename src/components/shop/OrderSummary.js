import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { convertToDecimal } from "../../utils/helper-functions"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import { CircleNotch } from "@phosphor-icons/react"

import { Flexbox } from "../layout/Flexbox"
import Content from "../ui/Content"
import Box from "../ui/Box"
import StrikeText from "../misc/StrikeText"
import Button from "../ui/Button"
import Icon from "../ui/Icon"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"

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
  pid,
  selectedRate, 
  setCoupon,
  setSelectedRate,
  setSubtotal,
  setTax,
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

  const handleChangeCoupon = (value) => {
    setCoupon({
      ...coupon,
      loading: false,
      code: value.trim(),
      error: "",
    })
  }

  const handleCoupon = async () => {
    if (!coupon.code) {
      setCoupon({
        ...coupon,
        loading: false,
        error: "Please enter a coupon code.",
      })
    }
    else {
      setCoupon({
        ...coupon,
        loading: true,
        error: "",
      })

      fetch("/.netlify/functions/apply-coupon", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pid: pid,
          cartItems: cartItems,
          coupon: coupon.code,
        })
      }).then(res => {
        return res.json()
      }).then(data => {

        if (data.error) {
          throw data.error
        }

        const pi = data.paymentIntent
        const coupon = data.coupon

        if (pi) {
          setSelectedRate({
            rateId: pi.metadata.rateId,
            rate: pi.metadata.shipping,
          })
          setTax({
            amount: pi.metadata.tax,
            id: pi.metadata.taxId,
          })
          setSubtotal(pi.amount)
        }

        if (coupon) {
          setCoupon({
            ...coupon,
            applied: true,
            text: data.coupon && "Super mega discount",
            loading: false,
          })
        }
      }).catch(error => {
        setCoupon({
          ...coupon,
          loading: false,
          error: error,
        })
      })
    }
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
                align="center"
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
                  justify="space-between"
                  align="center"
                  width="100%"
                >
                  <Box>
                    <Content
                      smallcolor={colors.gray.sevenHundred}
                      smallmargin="0"
                      paragraphmarginbottom="0 0 4px"
                    >
                      <p>{item.name}</p>
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
                  <p style={{ whiteSpace: "nowrap", margin: "0 8px" }}>x {item.quantity}</p>
                  <p>
                    {item.originalPrice > item.price && (
                      <StrikeText>${convertToDecimal(item.originalPrice, 2)}</StrikeText>
                    )}
                    {item.formattedPrice}
                  </p>
                </Flexbox>
              </Flexbox>
            ))}
          </OrderContent>
        </OrderSection>
        <OrderSection>
          <Flexbox
            margin="16px 0"
            flex="flex"
            justify="space-between"
          >
            <p>Subtotal</p>
            <p>${convertToDecimal(subtotal, 2)}</p>
          </Flexbox>
          <Flexbox
            margin="0 0 16px"
            flex="flex"
            justify="space-between"
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
            justify="space-between"
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
              justify="space-between"
            >
              <p>Coupon ({coupon.code})</p>
              {coupon.text && (
                <p>{coupon.text}</p>
              )}
            </Flexbox>
          )}
          <Flexbox
            flex="flex"
            justify="space-between"
            align="center"
            margin="8px 0"
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
        </OrderSection>
        <StyledLabel
          htmlFor="coupon-input"
          margin="16px 0 4px"
        >
          Coupon
        </StyledLabel>
        <Flexbox
          justify="space-between"
          align="flex-start"
          width="100%"
          margin="0 0 16px"
        >
          <StyledFieldset
            margin="0 8px 0 0"
          >
            <StyledInput
              id="coupon-input"
              onChange={e => handleChangeCoupon(e.target.value)}
              placeholder="Coupon code"
              className={coupon.error && "is-error"}
              type="text"
              padding="8px"
              value={coupon.code}
              margin="0 8px 0 0"
            />
            {coupon.error && (
              <ErrorLine
                color={colors.red.sixHundred}
              >
                {coupon.error}
              </ErrorLine>
            )}
          </StyledFieldset>
          <Button
            backgroundcolor={colors.gray.nineHundred}
            color={colors.gray.oneHundred}
            padding="12px"
            width="100px"
            htmlFor="coupon-input"
            type="button"
            onClick={() => handleCoupon()}
            className={coupon.loading ? "is-loading" : null}
            disabled={coupon.loading}
          >
            {coupon.loading ? (
              <Icon>
                <CircleNotch size={16} color={colors.white} />
              </Icon>
            ) : (
              "Apply"
            )}
          </Button>
        </Flexbox>
      </Orders>
    </>
  )
}

export { Orders, OrderSection, OrderSummary}
