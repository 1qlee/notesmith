import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors, convertToDecimal, spacing } from "../../styles/variables"
import { Question } from "phosphor-react"

import { Container, LayoutContainer } from "../layout/Container"
import { SectionMain, Section, SectionContent } from "../layout/Section"
import { Grid, Cell } from "styled-css-grid"
import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"
import Layout from "../layout/Layout"
import Loader from "../Loader"
import Nav from "../layout/Nav"
import SEO from "../layout/Seo"
import Notification from "../ui/Notification"
import Icon from "../Icon"

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
  const [error, setError] = useState(false)

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
        setError(true)
      })
    }

    retrieveOrder()
  }, [orderId, location.state])

  return (
    <Layout>
      <SEO title="Order Summary" />
      <Nav chapterNumber="33" title="Order Summary"></Nav>
      <SectionMain className="has-max-height">
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                {error ? (
                  <Flexbox
                    flex="flex"
                    flexdirection="center"
                    alignitems="center"
                  >
                    <Content>
                      <h3>We couldn't find that for you.</h3>
                    </Content>
                  </Flexbox>
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
                            <p>Can't see your order details? Try checking your email for your order confirmation receipt and click the button inside. If you've lost the email, enter your email address below and we'll send you another one.</p>
                          )}
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
                              <h3>Shipping address</h3>
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
                              <h3>Tracking</h3>
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
                          <h3>Order</h3>
                          <Flexbox
                            flex="flex"
                            border={`1px solid ${colors.gray.sixHundred}`}
                            justifycontent="space-between"
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
                                bordercolor={colors.gray.sixHundred}
                                className="has-border-bottom"
                              >
                                <p>Tax</p>
                                <p>${convertToDecimal(price.taxRate, 2)}</p>
                              </Flexbox>
                              <Flexbox
                                flex="flex"
                                justifycontent="space-between"
                                padding="1rem"
                              >
                                <p>Total</p>
                                <p>${convertToDecimal(price.totalAmount, 2)}</p>
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
                        <Notification
                          backgroundcolor={colors.paper.cream}
                          color={colors.primary.sevenHundred}
                          bordercolor='transparent'
                        >
                          <Flexbox
                            flex="flex"
                            alignitems="center"
                          >
                            <Icon>
                              <Question color={colors.primary.sevenHundred} size="1.25rem" />
                            </Icon>
                            <Content
                              paragraphcolor={colors.primary.sevenHundred}
                              paragraphfontsize="1rem"
                            >
                              <p>If you have any questions or require additional assistance, please <a href={`mailto:general@notesmithbooks.com?subject=Regarding Order: ${orderId}`}>send us an email</a>.</p>
                            </Content>
                          </Flexbox>
                        </Notification>
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
