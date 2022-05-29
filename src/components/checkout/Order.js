import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors, convertToDecimal, spacing } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { CircleNotch } from "phosphor-react"
import { convertUnix } from "../../utils/helper-functions"
import { GatsbyImage } from "gatsby-plugin-image"

import { Container, LayoutContainer } from "../layout/Container"
import { SectionMain, Section, SectionContent } from "../layout/Section"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"
import { Grid, Cell } from "styled-css-grid"
import { Flexbox } from "../layout/Flexbox"
import Button from "../Button"
import TextLink from "../TextLink"
import Content from "../Content"
import Notification from "../ui/Notification"
import Icon from "../Icon"
import Layout from "../layout/Layout"
import Nav from "../layout/Nav"
import Seo from "../layout/Seo"

const PlaceholderLine = styled.div`
  background-color: ${colors.gray.threeHundred};
  border-radius: 0.25rem;
  height: 1rem;
  width: ${props => props.width};
  &:not(:last-child) {
    margin-bottom: 0.5rem;
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
      await firebaseDb.ref(`orders/${orderId}`).once("value").then(async snapshot => {
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
              await firebaseDb.ref(`orderItems/${orderItem}`).once("value").then(snapshot => {
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

    const response = await fetch("/.netlify/functions/resend-order-email", {
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
                      <Flexbox
                        flex="flex"
                        flexdirection="column"
                        maxwidth="600px"
                      >
                        <Content
                          margin="0 0 2rem"
                          h2margin="0 0 1rem"
                          h2fontweight="400"
                        >
                          <h2>Order Summary</h2>
                          <p>Here is the summary for your order. If you have any questions please <a href={`mailto:general@notesmithbooks.com?subject=[Order Form] ${orderId}`}>contact us</a>.</p>
                        </Content>
                        <Grid
                          columns="repeat(auto-fit,minmax(120px,1fr))"
                          columnGap={spacing.normal}
                        >
                          <Cell>
                            <StyledLabel>Order date</StyledLabel>
                            {showInfo ? (
                              <p>{convertUnix(orderInfo.createdDate)}</p>
                            ) : (
                              <PlaceholderLine width="4rem" />
                            )}
                          </Cell>
                          <Cell>
                            <Content
                              h3fontsize="1rem"
                              margin="0 0 2rem"
                              paragraphmarginbottom="0"
                            >
                              <StyledLabel>Shipping address</StyledLabel>
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
                          </Cell>
                          <Cell>
                            <Content
                              h3fontsize="1rem"
                              margin="0 0 2rem"
                              paragraphmarginbottom="0"
                            >
                              <StyledLabel>Tracking</StyledLabel>
                              {showInfo ? (
                                <TextLink
                                  href={orderInfo.tracking.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  fontfamily="Crimson Pro"
                                  fontsize="1rem"
                                  color={colors.primary.threeHundred}
                                  hovercolor={colors.primary.sixHundred}
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
                          </Cell>
                        </Grid>
                        <StyledLabel>Your order</StyledLabel>
                        <Flexbox
                          border={`1px solid ${colors.gray.threeHundred}`}
                          borderradius="0"
                          margin="0 0 2rem"
                          padding={showInfo ? "0" : "1rem"}
                        >
                          {showInfo ? (
                            <>
                              {orderItems && orderItems.map(item => (
                                <Flexbox
                                  flex="flex"
                                  borderradius="0"
                                  justifycontent="space-between"
                                  backgroundcolor={colors.white}
                                  alignitems="center"
                                  padding="1rem"
                                  key={item.id}
                                >
                                  <GatsbyImage
                                    image={item.image.gatsbyImageData}
                                    alt="product thumbnail"
                                  />
                                  <p>{item.name}</p>
                                  <p>x{item.quantity}</p>
                                  <p>{item.formattedValue}</p>
                                </Flexbox>
                              ))}
                            </>
                          ) : (
                            <PlaceholderLine width="12rem" />
                          )}
                          {showInfo ? (
                            <>
                              <Flexbox
                                flex="flex"
                                justifycontent="space-between"
                                className="has-border-top"
                                bordercolor={colors.gray.threeHundred}
                                padding="1rem"
                              >
                                <p>Subtotal</p>
                                <p>${convertToDecimal((orderInfo.totalAmount - orderInfo.shippingRate - orderInfo.taxRate), 2)}</p>
                              </Flexbox>
                              <Flexbox
                                flex="flex"
                                justifycontent="space-between"
                                padding="1rem"
                              >
                                <p>Shipping</p>
                                <p>${convertToDecimal(orderInfo.shippingRate, 2)}</p>
                              </Flexbox>
                              <Flexbox
                                flex="flex"
                                justifycontent="space-between"
                                padding="1rem"
                                bordercolor={colors.gray.threeHundred}
                                className="has-border-bottom"
                              >
                                <p>Tax</p>
                                <p>${convertToDecimal(orderInfo.taxRate, 2)}</p>
                              </Flexbox>
                              <Flexbox
                                flex="flex"
                                justifycontent="space-between"
                                alignitems="flex-end"
                                padding="1rem"
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
                              margin="1rem 0"
                            >
                              <PlaceholderLine width="6rem" />
                              <PlaceholderLine width="8rem" />
                              <PlaceholderLine width="6rem" />
                            </Content>
                          )}
                        </Flexbox>
                        {!showInfo && (
                          <Notification
                            backgroundcolor={colors.gray.oneHundred}
                            bordercolor={colors.primary.sixHundred}
                            margin="0 0 2rem"
                            padding="1rem"
                          >
                            <Content>
                              <p>Can't see your order details? Try checking your email for your order confirmation receipt and click the button inside. If you've lost the email, enter the email address associated with this order and we'll send you another one.</p>
                              <form
                                onSubmit={e => handleEmailResend(e)}
                                id="email-resend"
                              >
                                <StyledFieldset
                                  className="is-vertical"
                                  margin="1rem 0"
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
                                      padding="1rem"
                                      margin="0 0 0 0.5rem"
                                      form="email-resend"
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
                      </Flexbox>
                    )}
                  </>
                )}
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Order
