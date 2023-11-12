import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors, fonts, spacing, widths } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { ArrowSquareOut, CircleNotch } from "@phosphor-icons/react"
import { convertUnix, convertToDecimal } from "../../utils/helper-functions"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import { get, ref } from "firebase/database"
import { useShoppingCart } from "../../hooks/useShoppingCart"
import { Container, Col, Row } from "react-grid-system"

import { SectionMain, Section, SectionContent } from "../layout/Section"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"
import Button from "../ui/Button"
import TextLink from "../ui/TextLink"
import Content from "../ui/Content"
import Notification from "../ui/Notification"
import Icon from "../ui/Icon"
import Layout from "../layout/Layout"
import Tag from "../ui/Tag"
import Box from "../ui/Box"

const PlaceholderLine = styled.div`
  background-color: ${colors.gray.threeHundred};
  border-radius: 4px;
  height: 16px;
  width: ${props => props.width};
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`

const Order = ({ location, orderId }) => {
  const { clearCart } = useShoppingCart()
  const params = new URLSearchParams(location.search)
  const urlAuthKey = params.get("key")
  const { state } = location
  const { loading, firebaseDb } = useFirebaseContext()
  const [orderInfo, setOrderInfo] = useState({
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      zip: "",
      street1: "",
      street2: "",
    }
  })
  const [orderItems, setOrderItems] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const [orderNotFound, setOrderNotFound] = useState(false)
  const [resendEmail, setResendEmail] = useState()
  const [processing, setProcessing] = useState(false)
  const [checkoutError, setCheckoutError] = useState()
  const [error, setError] = useState({
    show: false,
    msg: "",
    color: colors.red.sixHundred,
    success: true,
  })

  useEffect(() => {
    if (state && state.clearCart) {
      clearCart()
      localStorage.removeItem("pid")
    }

    if (state && state.error) {
      setCheckoutError(state.error)
      setOrderInfo(state.orderData)
    }

    async function retrieveOrder() {
      // retrieve order info from the db based on orderId
      get(ref(firebaseDb, `orders/${orderId}`)).then(async snapshot => {
        const value = snapshot.val()

        if (!value) {
          setOrderNotFound(true)
        }
        else {
          // check if authkeys match, and show info if it does
          if (value.authKey === urlAuthKey) {
            // save order info to state
            setShowInfo(true)
            setOrderInfo(value)
            const orderItemsArray = []

            for (const orderItem in value.orderItems) {
              await get(ref(firebaseDb, `orderItems/${orderItem}`)).then(snapshot => {
                orderItemsArray.push(snapshot.val())
              })
            }

            setOrderItems(orderItemsArray)
          }
          else {
            setShowInfo(false)
            setOrderInfo({})
          }
        }
      })
    }

    if (!loading) {
      retrieveOrder()
    }
  }, [orderId, loading, location])

  function handleEmailResend(e) {
    e.preventDefault()
    if (!resendEmail) {
      setError({
        show: true,
        msg: "Please enter an email.",
        color: colors.red.sixHundred,
        success: false,
      })
    }

    if (resendEmail === orderInfo.customer.email) {
      resendOrderEmail()
    }
    else {
      setError({
        show: true,
        msg: "Email did not match.",
        color: colors.red.sixHundred,
        success: false,
      })
    }
  }

  function resendOrderEmail() {
    setProcessing(true)

    fetch("/.netlify/functions/resend-order-email", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pid: orderId
      })
    }).then(res => {
      setError({
        show: true,
        msg: "Success! Check your email!",
        color: colors.green.sixHundred,
        success: true,
      })
      setProcessing(false)
    }).catch(error => {
      console.log(error)
      setProcessing(false)
    })
  }

  function createReturnLabel() {
    console.log("create return label")
    fetch("/.netlify/functions/create-return-label", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: orderInfo.address,
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      console.log(data)
    }).catch(error => {
      console.log(error)
    })
  }

  return (
    <Layout 
      title="Order Summary" 
    >
      <SectionMain className="has-max-height">
        <Section>
          <SectionContent
            padding={`${spacing.section} 0`}
          >
            <Container xl lg md sm xs>
              {orderNotFound ? (
                <Row justify="center">
                  <Col xl={6} lg={6} xxl={6} md={6}>
                    <Content
                      headingtextalign="center"
                      paragraphtextalign="center"
                    >
                      <h3>Order not found</h3>
                    </Content>
                    <Notification
                      backgroundcolor={colors.gray.twoHundred}
                      color={colors.gray.sixHundred}
                      display="block"
                      margin="0 auto"
                      maxwidth={widths.notification}
                    >
                      <p>We couldn't find this order for you. Please make sure the order ID you entered is correct.</p>
                      <p>If you require further assistance please <b><TextLink fontsize="0.75rem" href={`mailto:general@notesmithbooks.com?subject=Regarding Order: ${orderId ? orderId : "Unknown order ID"}`}>send us an email</TextLink></b>.</p>
                    </Notification>
                  </Col>
                </Row>
              ) : (
                <Col xl={6} lg={6} xxl={6} md={6}>
                  {orderInfo && (
                    <>
                      <Content
                        margin="0 0 32px"
                        paragraphfontsize="1.25rem"
                      >
                        <h1>Order summary</h1>
                        <p>Here is the summary for your order. If you have any questions regarding this order please feel free to&nbsp;
                          <TextLink
                            href={`mailto:general@notesmithbooks.com?subject=[Orders] (${orderId})`}
                            target="_blank"
                            rel="noopener noreferrer"
                            fontfamily={fonts.primary}
                            fontsize="1.25rem"
                            fontweight="700"
                            color={colors.gray.nineHundred}
                          >
                            send us an email
                          </TextLink>.
                        </p>
                      </Content>
                      <Box>
                        <Box
                          margin="0 0 32px"
                        >
                          <Content
                            h5fontweight="700"
                            h5margin="0 0 8px"
                            margin="0 0 16px"
                          >
                            <h5>Order date</h5>
                            {showInfo ? (
                              <p>{convertUnix(orderInfo.created)}</p>
                            ) : (
                              <PlaceholderLine width="4rem" />
                            )}
                          </Content>
                          <Content
                            h5fontweight="700"
                            h5margin="0 0 8px"
                            margin="0 0 16px"
                            paragraphmargin="0"
                          >
                            <h5>Shipping address</h5>
                            {showInfo ? (
                              <>
                                <p>{orderInfo.address.line1 || orderInfo.address.street1} {orderInfo.address.line2 || orderInfo.address.street2}
                                <span>{orderInfo.address.city}, {orderInfo.address.state} {orderInfo.address.postal_code || orderInfo.address.zip}</span>
                                </p>
                              </>
                            ) : (
                              <>
                                <PlaceholderLine width="12rem" />
                              </>
                            )}
                          </Content>
                          <Content
                            h5fontweight="700"
                            h5margin="0 0 8px"
                          >
                            <h5>Tracking</h5>
                            {showInfo ? (
                              <Button
                                as="a"
                                href={orderInfo.tracking && orderInfo.tracking.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                color={colors.gray.nineHundred}
                                backgroundcolor={colors.gray.twoHundred}
                                padding="3px 6px"
                              >
                                <span>
                                  {orderInfo.tracking && orderInfo.tracking.code ? orderInfo.tracking.code : "Still being updated"}
                                </span>
                                <Icon margin="0 0 0 4px">
                                  <ArrowSquareOut size={16} weight="fill" color={colors.gray.nineHundred} />
                                </Icon>
                              </Button>
                            ) : (
                              <>
                                <PlaceholderLine width="16rem" />
                              </>
                            )}
                          </Content>
                        </Box>
                        {showInfo && (
                          <Box
                            borderbottom={colors.borders.black}
                            padding="0 0 16px"
                          >
                            <Content
                              h5margin="0 0 8px"
                            >
                              <h5>Items</h5>
                            </Content>
                            {orderItems.map(item => (
                              <Flexbox
                                flex="flex"
                                borderradius="0"
                                justifycontent="space-between"
                                backgroundcolor={colors.white}
                                alignitems="center"
                                key={item.id}
                              >
                                <Flexbox
                                  flex="flex"
                                  alignitems="center"
                                >
                                  <GatsbyImage
                                    image={getImage(item.image)}
                                    alt="product thumbnail"
                                  />
                                  <p>{item.name}</p>
                                </Flexbox>
                                <p>x {item.quantity}</p>
                                <p>{item.formattedPrice}</p>
                              </Flexbox>
                            ))}
                          </Box>
                        )}
                        {showInfo ? (
                          <>
                            <Box
                              margin="32px 0 0"
                              borderbottom={colors.borders.black}
                              padding="0 0 32px"
                            >
                              <Flexbox
                                margin="0 0 16px"
                                flex="flex"
                                justifycontent="space-between"
                              >
                                <p>Subtotal</p>
                                <p>${convertToDecimal((orderInfo.amount - orderInfo.shipping - orderInfo.tax), 2)}</p>
                              </Flexbox>
                              <Flexbox
                                margin="0 0 16px"
                                flex="flex"
                                justifycontent="space-between"
                              >
                                <p>Shipping</p>
                                <p>${convertToDecimal(orderInfo.shipping, 2)}</p>
                              </Flexbox>
                              <Flexbox
                                flex="flex"
                                justifycontent="space-between"
                              >
                                <p>Tax</p>
                                <p>${convertToDecimal(orderInfo.tax, 2)}</p>
                              </Flexbox>
                              {orderInfo.coupon && (
                                <Flexbox
                                  flex="flex"
                                  justifycontent="space-between"
                                  margin="16px 0 0"
                                >
                                  <p>Coupon</p>
                                  <p>${convertToDecimal(orderInfo.coupon, 2)}</p>
                                </Flexbox>
                              )}
                            </Box>
                            <Flexbox
                              flex="flex"
                              justifycontent="space-between"
                              alignitems="center"
                              paragraphmargin="0"
                              margin="32px 0"
                            >
                              <p>Total</p>
                              <Content
                                  paragraphmargin="0"
                                  paragraphfontsize="1.25rem"
                                  paragraphlineheight="1"
                              >
                                <p>${convertToDecimal(orderInfo.amount, 2)}</p>
                              </Content>
                            </Flexbox>
                          </>
                        ) : (
                          <Content
                            margin="16px 0"
                            h5fontweight="700"
                            h5margin="0 0 8px"
                          >
                            <h5>Items</h5>
                            <PlaceholderLine width="6rem" />
                            <PlaceholderLine width="8rem" />
                            <PlaceholderLine width="6rem" />
                            <PlaceholderLine width="8rem" />
                          </Content>
                        )}
                      </Box>
                      {!showInfo && (
                        <Notification
                          backgroundcolor={colors.yellow.oneHundred}
                          margin="0 0 2rem"
                          padding="16px"
                        >
                          <Content>
                            <p>Can't see your order details? Try checking your email for your order confirmation receipt and click the button inside. If you've lost the email, enter the email address associated with this order and we'll send you another one.</p>
                            <form
                              onSubmit={e => handleEmailResend(e)}
                              id="email-resend"
                            >
                              <StyledFieldset
                                className="is-vertical"
                                margin="16px 0"
                              >
                                <StyledLabel>Email</StyledLabel>
                                <Flexbox
                                  flex="flex"
                                  width="100%"
                                >
                                  <StyledInput
                                    placeholder="Email address associated with this order"
                                    className={error.success ? null : "is-error"}
                                    id="email"
                                    type="email"
                                    name="email"
                                    autocomplete="email"
                                    fontsize="1rem"
                                    required
                                    onChange={e => {
                                      setError({
                                        show: false,
                                        msg: "",
                                        color: colors.red.sixHundred,
                                        success: true,
                                      })
                                      setResendEmail(e.target.value)
                                    }}
                                    width="100%"
                                  />
                                  <Button
                                    form="email-resend"
                                    padding="16px"
                                    margin="0 0 0 8px"
                                    type="submit"
                                    disabled={processing}
                                    className={processing ? "is-loading" : null}
                                  >
                                    {processing ? (
                                      <Icon width="46px">
                                        <CircleNotch size="1rem" color={colors.white} />
                                      </Icon>
                                    ) : (
                                      "Resend"
                                    )}
                                  </Button>
                                </Flexbox>
                                {error.show && (
                                  <ErrorLine color={error.color}>
                                    <span>{error.msg}</span>
                                  </ErrorLine>
                                )}
                              </StyledFieldset>
                            </form>
                          </Content>
                        </Notification>
                      )}
                    </>
                  )}
                </Col>
              )}
            </Container>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Order
