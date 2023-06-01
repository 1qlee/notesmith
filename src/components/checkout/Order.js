import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors, convertToDecimal, fonts, spacing, widths } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { ArrowSquareOut, CircleNotch } from "phosphor-react"
import { convertUnix } from "../../utils/helper-functions"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import { get, ref } from "firebase/database"
import { useShoppingCart } from "use-shopping-cart"
import { Container, Col, Row } from "react-grid-system"

import { SectionMain, Section, SectionContent } from "../layout/Section"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"
import { Orders, OrderSection } from "../shop/OrderSummary"
import Button from "../ui/Button"
import TextLink from "../ui/TextLink"
import Content from "../ui/Content"
import Notification from "../ui/Notification"
import Icon from "../ui/Icon"
import Layout from "../layout/Layout"
import Nav from "../layout/Nav"
import Seo from "../layout/Seo"
import Tag from "../ui/Tag"

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
        console.log(orderId)
        const value = snapshot.val()
        console.log(value)

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
    <Layout>
      <Seo title="Order Summary" />
      <Nav />
      <SectionMain className="has-max-height">
        <Section>
          <SectionContent
            padding={`${spacing.large} 0`}
          >
            <Container xs sm md lg xl>
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
                        h1margin="0 0 16px"
                        h1fontweight="400"
                        h1fontsize="3rem"
                      >
                        <h1>Order Summary</h1>
                        <p>Here is the summary for your order. We accept returns within 14 days of purchase. If you would like to return your order, please&nbsp;
                          <TextLink
                            as="button"
                            padding="0"
                            fontfamily={fonts.primary}
                            fontsize="1rem"
                            fontweight="700"
                            color={colors.gray.nineHundred}
                            onClick={() => createReturnLabel()}
                          >
                            submit a return request
                          </TextLink>.  If you have any other questions regarding this order please feel free to&nbsp;
                          <TextLink
                            href={`mailto:general@notesmithbooks.com?subject=[Orders] (${orderId})`}
                            target="_blank"
                            rel="noopener noreferrer"
                            fontfamily={fonts.primary}
                            fontsize="1rem"
                            fontweight="700"
                            color={colors.gray.nineHundred}
                          >
                            send us an email
                          </TextLink>.
                        </p>
                      </Content>
                      <Orders>
                        <OrderSection>
                          <Content
                            h5fontweight="800"
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
                            h5fontweight="800"
                            h5margin="0 0 8px"
                            margin="0 0 16px"
                            paragraphmarginbottom="0"
                          >
                            <h5>Shipping address</h5>
                            {showInfo ? (
                              <>
                                <p>{orderInfo.address.line1 || orderInfo.address.street1} {orderInfo.address.line2 || orderInfo.address.street2}</p>
                                <p>{orderInfo.address.city}, {orderInfo.address.state} {orderInfo.address.postal_code || orderInfo.address.zip}</p>
                              </>
                            ) : (
                              <>
                                <PlaceholderLine width="4rem" />
                                <PlaceholderLine width="8rem" />
                                <PlaceholderLine width="5rem" />
                                <PlaceholderLine width="8rem" />
                              </>
                            )}
                          </Content>
                          <Content
                            h5fontweight="800"
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
                                <PlaceholderLine width="4rem" />
                                <PlaceholderLine width="8rem" />
                              </>
                            )}
                          </Content>
                        </OrderSection>
                        {showInfo ? (
                          <OrderSection>
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
                                  <Tag
                                    padding="3px 6px"
                                    margin="0 4px 0 0"
                                    backgroundcolor={colors.gray.twoHundred}
                                    color={colors.gray.nineHundred}
                                  >
                                    x{item.quantity}
                                  </Tag>
                                  <GatsbyImage
                                    image={getImage(item.image)}
                                    alt="product thumbnail"
                                  />
                                  <div>
                                    <p>{item.name}</p>
                                  </div>
                                </Flexbox>
                                <p>{item.formattedValue}</p>
                              </Flexbox>
                            ))}
                          </OrderSection>
                        ) : (
                          <PlaceholderLine width="12rem" />
                        )}
                        {showInfo ? (
                          <>
                            <OrderSection>
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
                            </OrderSection>
                            <Flexbox
                              flex="flex"
                              justifycontent="space-between"
                              alignitems="center"
                              paragraphmarginbottom="0"
                              padding="16px 0"
                            >
                              <p>Total</p>
                              <Content
                                h4margin="0"
                              >
                                <h4>${convertToDecimal(orderInfo.amount, 2)}</h4>
                              </Content>
                            </Flexbox>
                          </>
                        ) : (
                          <Content
                            margin="16px 0"
                          >
                            <PlaceholderLine width="6rem" />
                            <PlaceholderLine width="8rem" />
                            <PlaceholderLine width="6rem" />
                          </Content>
                        )}
                      </Orders>
                      {!showInfo && (
                        <Notification
                          backgroundcolor={colors.gray.oneHundred}
                          bordercolor={colors.primary.sixHundred}
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
                                    borderradius="0"
                                    bordercolor={colors.primary.sixHundred}
                                    className={error.success ? null : "is-error"}
                                    id="email"
                                    type="email"
                                    name="email"
                                    autocomplete="email"
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
                                    color={colors.white}
                                    backgroundcolor={colors.primary.sixHundred}
                                    borderradius="0"
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
