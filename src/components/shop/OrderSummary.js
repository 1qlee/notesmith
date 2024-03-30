import React, { useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { convertToDecimal, capitalizeString } from "../../utils/helper-functions"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import { CircleNotch } from "@phosphor-icons/react"
import { useShoppingCart } from "../cart/context/cartContext"

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
  coupon,
  formattedTotalPrice,
  items,
  selectedRate,
  subtotal,
  tax,
  totalAmount,
}) {
  // calculate the total price of the user's cart incl shipping
  function calculateTotalPrice() {
    let newTotalPrice = subtotal

    if (selectedRate) {
      newTotalPrice += parseFloat(selectedRate.rate)
    }
    if (tax.amount) {
      newTotalPrice += parseFloat(tax.amount)
    }

    return convertToDecimal(newTotalPrice, 2) // converts to a float value
  }

  function handleSpacingView(data) {
    const { template } = data
    const gridTemplate = template === "dot" || template === "graph" || template === "cross"

    if (template === "blank") {
      return
    }
    else if (gridTemplate) {
      return `(Rows: ${data.rowSpacing}mm, Columns: ${data.columnSpacing}mm)`
    }
    else {
      return `(${data.spacing}mm)`
    }
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
                            {item.leftPageData && (
                              <p>
                                Left-side pages:&nbsp;
                                <span>
                                  {capitalizeString(item.leftPageData.template)} {handleSpacingView(item.leftPageData.pageData)}
                                </span>
                              </p>
                            )}
                            {item.rightPageData && (
                              <p>Right-side pages:&nbsp;
                                <span>
                                  {capitalizeString(item.rightPageData.template)} {handleSpacingView(item.rightPageData.pageData)}
                                </span>
                              </p>
                            )}
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
                    {item.discounts?.price ? (
                      <p>
                        <StrikeText
                          color={colors.gray.sixHundred}
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
        padding="16px"
      >
        <Flexbox
          margin="0 0 16px"
          flex="flex"
          justify="space-between"
        >
          <p>Subtotal</p>
          <p>
            {coupon && coupon.applied ? (
              <span>
                <StrikeText
                  color={colors.gray.sixHundred}
                  margin="0 4px 0 0"
                >
                  {formattedTotalPrice}
                </StrikeText>
                ${convertToDecimal(subtotal, 2)}
              </span>
            ) : (
              <span>{formattedTotalPrice}</span>
            )}
          </p>
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
            margin="0 0 16px"
          >
            <p>Coupon</p>
            {coupon.text && (
              <p>({coupon.name}) {coupon.text}</p>
            )}
          </Flexbox>
        )}
        <Flexbox
          flex="flex"
          justify="space-between"
          align="center"
        >
          <p>Total</p>
          <Content
            paragraphmargin="0"
            paragraphfontsize="1.25rem"
            paragraphlineheight="1"
            paragraphfontweight="500"
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
  address,
  cartItems,
  coupon,
  pid,
  selectedRate, 
  setCoupon,
  setTax,
  tax,
}) {
  const { totalPrice, formattedTotalPrice } = useShoppingCart()
  const [subtotal, setSubtotal] = useState(totalPrice)

  const handleChangeCoupon = (value) => {
    setCoupon({
      ...coupon,
      loading: false,
      code: value.trim(),
      error: "",
    })
  }

  const handleCoupon = async (e) => {
    e.preventDefault()

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
      }).then(async data => {

        if (data.error) {
          throw data.error
        }

        const couponData = data.coupon

        if (couponData) {
          setCoupon({
            ...coupon,
            applied: true,
            code: "",
            loading: false,
            name: couponData.code,
            originalSubtotal: subtotal,
            text: couponData.text,
          })

          if (data.subtotal) {
            setSubtotal(data.subtotal)
          }

          if (tax.amount) {
            try {
              const response = await fetch("/.netlify/functions/create-tax", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  pid: pid,
                  cartItems: cartItems,
                  address: address,
                })
              })

              const data = await response.json()

              if (data.error) {
                throw data.error
              }
              else {
                setTax(data)
              }
            }
            catch (error) {
              setTax({
                amount: 0,
                id: null,
              })
            }
          }
        }
      }).catch(error => {
        console.log("🚀 ~ handleCoupon ~ error:", error)
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
          items={cartItems}
          selectedRate={selectedRate}
          totalPrice={totalPrice}
          formattedTotalPrice={formattedTotalPrice}
          subtotal={subtotal}
          tax={tax}
          coupon={coupon}
        />
        <form
          id="coupon-form"
          onSubmit={e => handleCoupon(e)}
        >
          <Flexbox
            justify="space-between"
            align="flex-end"
            width="100%"
            margin="0 0 16px"
            padding="0 16px"
            className="has-border-top"
          >
            <StyledFieldset
              margin="0"
            >
              <StyledLabel
                htmlFor="coupon-input"
                margin="16px 0 4px"
              >
                Coupon
              </StyledLabel>
              <Flexbox>
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
                <Button
                  backgroundcolor={colors.gray.nineHundred}
                  color={colors.gray.oneHundred}
                  padding="12px"
                  width="100px"
                  htmlFor="coupon-form"
                  type="submit"
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
              {coupon.error && (
                <ErrorLine
                  color={colors.red.sixHundred}
                >
                  {coupon.error}
                </ErrorLine>
              )}
            </StyledFieldset>
          </Flexbox>
        </form>
      </Box>
    </>
  )
}

export { OrderBox, OrderSummary }
