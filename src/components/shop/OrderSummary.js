import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { convertToDecimal, calculateDiscounts } from "../../utils/helper-functions"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import { CircleNotch } from "@phosphor-icons/react"

import { Flexbox } from "../layout/Flexbox"
import Content from "../ui/Content"
import Box from "../ui/Box"
import StrikeText from "../misc/StrikeText"
import Button from "../ui/Button"
import Icon from "../ui/Icon"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"

const CapitalizedWord = styled.span`
  text-transform: capitalize;
`

function OrderSummary({ 
  items,
  selectedRate,
  subtotal,
  tax,
  coupon,
  totalAmount,
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
    <Box>
      <Content
        h5margin="0"
        h5fontweight="400"
        h5fontsize="1.25rem"
        padding="16px"
        borderbottom={colors.borders.black}
      >
        <h5>Order Summary</h5>
      </Content>
      <Box
        borderbottom={colors.borders.black}
      >
        <Box
          overflow="hidden auto"
          maxheight="300px"
          className="has-styled-scrollbar"
          padding="0 16px"
        >
          {items.length > 0 && items.map(item => (
            <Flexbox
              align="flex-start"
              flex="flex"
              key={item.id}
              padding="16px 0"
            >
              <Link
                to={`/products/${item.category}/${item.slug}/${item.coverColor}`}
              >
                <GatsbyImage
                  image={getImage(item.image)}
                  alt="product thumbnail"
                />
              </Link>
              <Flexbox
                margin="0 0 0 8px"
                flex="flex"
                justify="space-between"
                align="flex-start"
                width="100%"
              >
                <Box flex="2">
                  <Content
                    smallcolor={colors.gray.sevenHundred}
                    smallmargin="0"
                    paragraphmargin="0"
                    margin="0"
                  >
                    <Link
                      to={`/products/${item.category}/${item.slug}/${item.coverColor}`}
                    >
                      <p>{item.name}</p>
                    </Link>
                  </Content>
                  <Content
                    paragraphfontsize="0.75rem"
                    paragraphcolor={colors.gray.sevenHundred}
                    paragraphmargin="0"
                  >
                    {item.category === "notebooks" && (
                      <>
                        {item.bookId ? (
                          <>
                            <p>
                              Cover: <CapitalizedWord>{item.coverColor}</CapitalizedWord>
                            </p>
                            <p>
                              Pages: Custom
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              Cover: <CapitalizedWord>{item.coverColor}</CapitalizedWord>
                            </p>
                            <p>
                              Left-side pages: <CapitalizedWord>{item.leftPageData.template} {item.leftPageData.pageData.template !== "blank" && (`(${item.leftPageData.pageData.spacing}mm)`)}</CapitalizedWord>
                            </p>
                            <p>
                              Right-side pages: <CapitalizedWord>{item.rightPageData.template} {item.rightPageData.pageData.template !== "blank" && (`(${item.rightPageData.pageData.spacing}mm)`)}</CapitalizedWord>
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </Content>
                </Box>
                <Box
                  flex="1"
                >
                  <Content
                    paragraphtextalign="center"
                    margin="0 8px"
                  >
                    <p style={{ whiteSpace: "nowrap" }}>x {item.quantity}</p>
                  </Content>
                </Box>
                <Box flex="1">
                  <Content
                    paragraphtextalign="right"
                  >
                    {item.quantity >= item.discounts.minQuantity ? (
                      <p>
                        <StrikeText
                          color={colors.green.sixHundred}
                          margin="0"
                        >
                          ${convertToDecimal(item.price, 2)}
                        </StrikeText>
                        <span style={{ marginLeft: "8px" }}>{item.discounts.formattedPrice}</span>
                      </p>
                    ) : (
                      <p>${convertToDecimal(item.price, 2)}</p>
                    )}
                  </Content>
                </Box>
              </Flexbox>
            </Flexbox>
          ))}
        </Box>
      </Box>
      <Box
        padding="0 16px"
      >
        <Flexbox
          padding="16px 0"
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
        {coupon && coupon.applied && (
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
            <p>
              {totalAmount ? (
                <span>${totalAmount}</span>
              ) : (
                <span>${calculateTotalPrice()}</span>
              )}
            </p>
          </Content>
        </Flexbox>
      </Box>
    </Box>
  )
}

function OrderBox({ 
  items,
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
          cartItems: items,
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
      <Box
        backgroundcolor={colors.white}
        border={colors.borders.black}
      >
        <OrderSummary 
          items={items}
          selectedRate={selectedRate}
          subtotal={subtotal}
          tax={tax}
          coupon={coupon}
        />
        <Flexbox
          justify="space-between"
          align="flex-end"
          width="100%"
          margin="0 0 16px"
          padding="0 16px"
          className="has-border-top"
        >
          <StyledFieldset
            margin="0 8px 0 0"
          >
            <StyledLabel
              htmlFor="coupon-input"
              margin="16px 0 4px"
            >
              Coupon
            </StyledLabel>
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
      </Box>
    </>
  )
}

export { OrderBox, OrderSummary }
