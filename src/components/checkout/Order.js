import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors, fonts, spacing } from "../../styles/variables"
import { formatDollars } from "../../utils/helper-functions"
import { useFirebaseContext } from "../../utils/auth"
import { ArrowSquareOut, CircleNotch } from "@phosphor-icons/react"
import { get, ref } from "firebase/database"
import { useShoppingCart } from "../cart/context/cartContext"
import { Container, Col, Row } from "react-grid-system"

import { SectionMain, Section, SectionContent } from "../layout/Section"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"
import { OrderSummary } from "../shop/OrderSummary"
import Box from "../ui/Box"
import Button from "../ui/Button"
import Content from "../ui/Content"
import Icon from "../ui/Icon"
import Layout from "../layout/Layout"
import Notification from "../ui/Notification"
import TextLink from "../ui/TextLink"

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
  const [retrieving, setRetrieving] = useState(true)
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
      setRetrieving(true)
      // retrieve order info from the db based on orderId
      get(ref(firebaseDb, `orders/${orderId}`)).then(async snapshot => {
        const value = snapshot.val()

        if (!value) {
          setOrderNotFound(true)
          setRetrieving(false)
        }
        else {
          // check if authkeys match, and show info if it does
          if (value.authKey === urlAuthKey) {

            // get order address from paymentIntent
            await fetch("/.netlify/functions/retrieve-payment", {
              method: "post",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                pid: value.pid,
              })
            })
            .then(res => res.json())
            .then(data => {
              setOrderInfo({
                ...value,
                address: data.paymentIntent.shipping.address
              })
            })

            // save order info to state
            setShowInfo(true)
            const orderItemsArray = []

            for (const orderItem in value.orderItems) {
              await get(ref(firebaseDb, `orderItems/${orderItem}`)).then(snapshot => {
                orderItemsArray.push(snapshot.val())
              })
            }

            setOrderItems(orderItemsArray)
            setRetrieving(false)
          }
          else {
            setRetrieving(false)
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
      setProcessing(false)
    })
  }

  return (
    <Layout 
      loaderClassName="has-nav"
      loading={retrieving}
      seoDetails={{
        title: "Order summary",
      }}
    >
      <SectionMain className="has-max-height">
        <Section>
          <SectionContent
            padding={`${spacing.section} 0`}
          >
            <Container xl lg md sm xs>
              {orderNotFound ? (
                <Row>
                  <Col xl={6} lg={6} xxl={6} md={6}>
                    {checkoutError ? (
                      <Content
                        margin="0 0 32px"
                        paragraphfontsize="1.25rem"
                      >
                        <h1>Error occured during checkout</h1>
                        <p>{checkoutError.error}</p>
                        <p>Please <b><TextLink fontsize="1.25rem" href={`mailto:support@notesmithbooks.com?subject=Error occured during checkout Order #${orderId ? orderId : "Unknown order ID"}`}>send us an email</TextLink></b> regarding this issue.</p>
                      </Content>
                    ) : (
                      <Content
                        margin="0 0 32px"
                        paragraphfontsize="1.25rem"
                      >
                        <h1>Order not found</h1>
                        <p>We couldn't find this order for you. Please try following the link in your email receipt again.
                        </p>
                          <p>If you require further assistance please <b><TextLink fontsize="1.25rem" href={`mailto:support@notesmithbooks.com?subject=Regarding Order: ${orderId ? orderId : "Unknown order ID"}`}>send us an email</TextLink></b>.</p>
                      </Content>
                    )}
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
                              <p>{new Date(orderInfo.datePaid).toLocaleString()}</p>
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
                              <>
                                {orderInfo.tracking && orderInfo.tracking.code ? (
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
                                      {orderInfo.tracking.code}
                                    </span>
                                    <Icon margin="0 0 0 4px">
                                      <ArrowSquareOut size={16} weight="fill" color={colors.gray.nineHundred} />
                                    </Icon>
                                  </Button>
                                ) : (
                                  <p>
                                    Tracking currently not available.
                                  </p>
                                )}
                              </>
                            ) : (
                              <>
                                <PlaceholderLine width="16rem" />
                              </>
                            )}
                          </Content>
                        </Box>
                        {showInfo ? (
                          <Box
                            border={colors.borders.black}
                          >
                            <OrderSummary
                              items={orderItems}
                              totalAmount={orderInfo.amount / 100}
                              subtotal={orderInfo.subtotal}
                              selectedRate={{ rate: orderInfo.shipping }}
                              formattedTotalPrice={`${formatDollars(orderInfo.subtotal / 100)}`}
                              tax={{ amount: orderInfo.tax }}
                              coupon={orderInfo.coupon}
                            />
                          </Box>
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
                          backgroundcolor={colors.gray.oneHundred}
                          borderradius="16px"
                          margin="32px 0"
                          padding="32px"
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
                                <StyledLabel
                                  htmlFor="resend-input"
                                >
                                  Email
                                </StyledLabel>
                                <Flexbox
                                  flex="flex"
                                >
                                  <StyledInput
                                    placeholder="Email address associated with this order"
                                    className={error.success ? null : "is-error"}
                                    id="resend-input"
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
                                    className={processing ? "is-retrieving" : null}
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