import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors, convertToDecimal, fonts } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { CircleNotch } from "phosphor-react"
import { convertUnix } from "../../utils/helper-functions"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import { get, ref } from "firebase/database"

import { Container, LayoutContainer } from "../layout/Container"
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
  const params = new URLSearchParams(location.search)
  const urlAuthKey = params.get("key")
  const { loading, firebaseDb } = useFirebaseContext()
  const [orderInfo, setOrderInfo] = useState(null)
  const [orderItems, setOrderItems] = useState(null)
  const [showInfo, setShowInfo] = useState(false)
  const [orderNotFound, setOrderNotFound] = useState(false)
  const [resendEmail, setResendEmail] = useState()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState({
    show: false,
    msg: "",
    color: colors.red.sixHundred,
    success: true,
  })

  useEffect(() => {
    async function retrieveOrder() {
      // retrieve order info from the db based on orderId
      get(ref(firebaseDb, `orders/${orderId}`)).then(async snapshot => {
        console.log(orderId)
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
              get(ref(firebaseDb, `orderItems/${orderItem}`)).then(snapshot => {
                orderItemsArray.push(snapshot.val())
                console.log(snapshot.val())
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
  }, [orderId, loading])

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

  async function resendOrderEmail() {
    setProcessing(true)

    await fetch("/.netlify/functions/resend-order-email", {
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

  return (
    <Layout>
      <Seo title="Order Summary" />
      <Nav />
      <SectionMain className="has-max-height">
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <div
                  columns="600px 1fr"
                >
                  <div>
                    {orderNotFound ? (
                      <>
                        <Content>
                          <h3>We couldn't find that for you.</h3>
                          <p>Please make sure the order ID you entered is correct.</p>
                        </Content>
                        <Content
                          paragraphfontsize="1rem"
                          paragraphcolor={colors.gray.sixHundred}
                          margin="1rem 0"
                        >
                          <p>If you require further assistance please <a href={`mailto:general@notesmithbooks.com?subject=Regarding Order: ${orderId ? orderId : "Unknown order ID"}`}>send us an email</a>.</p>
                        </Content>
                      </>
                    ) : (
                      <>
                        {orderInfo && (
                          <>
                            <Content
                              margin="0 0 32px"
                              h1margin="0 0 1rem"
                              h1fontweight="400"
                              h1fontsize="3rem"
                            >
                              <h1>Order Summary</h1>
                              <p>Here is the summary for your order. If you have any questions please&nbsp;
                                <TextLink 
                                  href={`mailto:general@notesmithbooks.com?subject=[Orders] (${orderId})`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  fontfamily={fonts.primary}
                                  fontsize="1rem"
                                  fontweight="700"
                                  color={colors.gray.nineHundred}
                                >
                                  contact us
                                </TextLink>.
                              </p>
                            </Content>
                            <Orders>
                              <OrderSection>
                                <Content
                                  headingfontfamily={fonts.secondary}
                                  h3fontsize="0.75rem"
                                  h3margin="0 0 0.5rem 0"
                                  margin="0 0 16px"
                                >
                                  <h3>Order date</h3>
                                  {showInfo ? (
                                    <p>{convertUnix(orderInfo.createdDate)}</p>
                                  ) : (
                                    <PlaceholderLine width="4rem" />
                                  )}
                                </Content>
                                <Content
                                  headingfontfamily={fonts.secondary}
                                  h3fontsize="0.75rem"
                                  h3margin="0 0 0.5rem 0"
                                  margin="0 0 16px"
                                >
                                  <h3>Shipping address</h3>
                                  {showInfo ? (
                                    <>
                                      <p>{orderInfo.address.line1} {orderInfo.address.line2}</p>
                                      <p>{orderInfo.address.city}, {orderInfo.address.state} {orderInfo.address.postal_code}</p>
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
                                  headingfontfamily={fonts.secondary}
                                  h3fontsize="0.75rem"
                                  h3margin="0 0 0.5rem 0"
                                >
                                  <h3>Tracking</h3>
                                  {showInfo ? (
                                    <TextLink
                                      href={orderInfo.tracking.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      fontfamily={fonts.primary}
                                      fontsize="1rem"
                                      color={colors.gray.nineHundred}
                                    >
                                      {orderInfo.tracking.code ? orderInfo.tracking.code : "Still being updated"}
                                    </TextLink>
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
                                  {orderItems && orderItems.map(item => (
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
                                        <div>
                                          <p>{item.name}</p>
                                          <p>x{item.quantity}</p>
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
                                      <p>${convertToDecimal((orderInfo.totalAmount - orderInfo.shippingRate - orderInfo.taxRate), 2)}</p>
                                    </Flexbox>
                                    <Flexbox
                                      margin="0 0 16px"
                                      flex="flex"
                                      justifycontent="space-between"
                                    >
                                      <p>Shipping</p>
                                      <p>${convertToDecimal(orderInfo.shippingRate, 2)}</p>
                                    </Flexbox>
                                    <Flexbox
                                      flex="flex"
                                      justifycontent="space-between"
                                    >
                                      <p>Tax</p>
                                      <p>${convertToDecimal(orderInfo.taxRate, 2)}</p>
                                    </Flexbox>
                                  </OrderSection>
                                  <Flexbox
                                    flex="flex"
                                    justifycontent="space-between"
                                    alignitems="center"
                                    paragraphmarginbottom="0"
                                    padding="16px"
                                  >
                                    <p>Total</p>
                                    <Content
                                      h3margin="0"
                                      h3fontweight="400"
                                      h3color={colors.primary.nineHundred}
                                    >
                                      <h3>${convertToDecimal(orderInfo.totalAmount, 2)}</h3>
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
                      </>
                    )}
                  </div>
                </div>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Order
