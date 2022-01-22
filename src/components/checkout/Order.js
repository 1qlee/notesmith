import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors, convertToDecimal, spacing } from "../../styles/variables"
import Loading from "../../assets/loading.svg"

import { Container, LayoutContainer } from "../layout/Container"
import { SectionMain, Section, SectionContent } from "../layout/Section"
import { StyledFieldset, StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"
import { Grid, Cell } from "styled-css-grid"
import { Flexbox } from "../layout/Flexbox"
import Button from "../Button"
import Content from "../Content"
import Layout from "../layout/Layout"
import Loader from "../Loader"
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
  const isBrowser = typeof window !== "undefined"
  const params = new URLSearchParams(location.search)
  const urlAuthKey = params.get("key")
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState()
  const [customer, setCustomer] = useState()
  const [createdDate, setCreatedDate] = useState()
  const [price, setPrice] = useState()
  const [product, setProduct] = useState()
  const [tracking, setTracking] = useState()
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
    const retrieveOrder = async () => {
      const response = await fetch("/.netlify/functions/retrieve-order", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pid: orderId
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        const { shipping, metadata, amount, charges, receipt_email } = data.paymentIntent
        const { orderItem, productItem } = data
        const date = new Date(charges.data[0].created * 1000)

        // if an authKey is provided in the URL then show personal information
        if (urlAuthKey === metadata.authKey) {
          setShowInfo(true)
          // wipe the authKey from the URL
          isBrowser && window.history.replaceState({}, "", `/orders/${orderId}`)
        }
        else {
          setShowInfo(false)
        }

        setCreatedDate(date.toLocaleString())
        setAddress(shipping.address)
        setCustomer({...customer, name: shipping.name, email: receipt_email})
        setProduct({
          name: productItem.name,
          description: productItem.description,
          images: productItem.images
        })
        setPrice({
          unit_amount: orderItem.unit_amount,
          quantity: metadata.quantity,
          shippingRate: metadata.shippingRate,
          taxRate: metadata.taxRate,
          totalAmount: amount
        })
        setTracking({
          url: metadata.trackingUrl,
          code: metadata.tracking
        })
        setLoading(false)
      }).catch(err => {
        setLoading(false)
        setOrderNotFound(true)
      })
    }

    retrieveOrder()
  }, [orderId, location.state])

  function handleEmailResend(e) {
    e.preventDefault()
    if (resendEmail === customer.email) {
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
                    {loading ? (
                      <Loader className="has-nav" />
                    ) : (
                      <Flexbox
                        flex="flex"
                        flexdirection="column"
                        maxwidth="600px"
                      >
                        <Content
                          margin="0 0 1rem"
                          h2margin="0"
                          h2fontweight="400"
                          paragraphcolor={colors.gray.sixHundred}
                          paragraphmarginbottom="0"
                        >
                          <h2>Order Summary</h2>
                          <p>{createdDate}</p>
                        </Content>
                        <Content
                          margin="0 0 2rem"
                        >
                          {showInfo ? (
                            <p>{location.state ? location.state.msg : "Here is the summary for your Notesmith order."}</p>
                          ) : (
                            <p>Can't see your order details? Try checking your email for your order confirmation receipt and click the button inside. If you've lost the email, enter the email address associated with this order and we'll send you another one.</p>
                          )}
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
                                  borderradius="0.25rem"
                                  className={error.success ? null : "is-error"}
                                  id="email"
                                  type="email"
                                  name="email"
                                  autocomplete="email"
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
                                  borderradius="0.25rem"
                                  padding="1rem"
                                  margin="0 0 0 0.5rem"
                                  form="email-resend"
                                  type="submit"
                                  disabled={processing}
                                  className={processing ? "is-loading" : null}
                                >
                                  {processing ? (
                                    <Loading height="1rem" width="46px" />
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
                        <Grid
                          columns="repeat(auto-fit,minmax(120px,1fr))"
                          columnGap={spacing.normal}
                        >
                          <Cell>
                            <Content
                              h3fontsize="1rem"
                              margin="0 0 2rem"
                              paragraphmarginbottom="0"
                            >
                              <StyledLabel>Shipping address</StyledLabel>
                              {showInfo ? (
                                <>
                                  <p>{address.line1} {address.line2}</p>
                                  <p>{address.city}, {address.state} {address.postal_code}</p>
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
                                <>
                                  <Flexbox
                                    flex="flex"
                                    justifycontent="space-between"
                                  >
                                    <p>Code</p>
                                    <p>{tracking.code ? tracking.code : "Still being updated"}</p>
                                  </Flexbox>
                                  <Flexbox
                                    flex="flex"
                                    justifycontent="space-between"
                                  >
                                    {tracking.url && (
                                      <>
                                        <p>Link</p>
                                        <a href={tracking.url} target="_blank" rel="noopener noreferrer">Tracking service</a>
                                      </>
                                    )}
                                  </Flexbox>
                                </>
                              ) : (
                                <>
                                  <PlaceholderLine width="4rem" />
                                  <PlaceholderLine width="8rem" />
                                </>
                              )}
                            </Content>
                          </Cell>
                        </Grid>
                        <Content
                          h3fontsize="1rem"
                          margin="0"
                          paragraphmarginbottom="0"
                        >
                          <StyledLabel>Order</StyledLabel>
                          <Flexbox
                            flex="flex"
                            boxshadow={`0 1px 2px ${colors.shadow.float}`}
                            borderradius="0.25rem"
                            justifycontent="space-between"
                            backgroundcolor={colors.white}
                            alignitems="center"
                            padding="1rem"
                          >
                            {showInfo ? (
                              <>
                                <img src={product.images[0]} width="100" alt={product.name} />
                                <p>{product.name}</p>
                                <p>x {price.quantity}</p>
                                <p>${convertToDecimal(price.unit_amount * price.quantity, 2)}</p>
                              </>
                            ) : (
                              <PlaceholderLine width="12rem" />
                            )}
                          </Flexbox>
                        </Content>
                        <Content
                          h3fontsize="1rem"
                          margin="0"
                          paragraphmarginbottom="0"
                        >
                          {showInfo ? (
                            <>
                              <Flexbox
                                flex="flex"
                                justifycontent="space-between"
                                padding="1rem"
                              >
                                <p>Shipping</p>
                                <p>${convertToDecimal(price.shippingRate, 2)}</p>
                              </Flexbox>
                              <Flexbox
                                flex="flex"
                                justifycontent="space-between"
                                padding="1rem"
                                bordercolor={colors.gray.threeHundred}
                                className="has-border-bottom"
                              >
                                <p>Tax</p>
                                <p>${convertToDecimal(price.taxRate, 2)}</p>
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
                                  <h3>${convertToDecimal(price.totalAmount, 2)}</h3>
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
                        </Content>
                        <Content
                          margin="1rem"
                          paragraphfontsize="1rem"
                          paragraphcolor={colors.gray.sixHundred}
                        >
                          <p>If you have any questions regarding this order, please <a href={`mailto:general@notesmithbooks.com?subject=Regarding Order: ${orderId}`}>send us an email</a>.</p>
                        </Content>
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
