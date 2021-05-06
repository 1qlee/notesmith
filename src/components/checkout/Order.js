import React, { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { convertToDecimal } from "../../styles/variables"

import { Container, LayoutContainer } from "../layout/Container"
import { SectionMain, Section, SectionContent } from "../layout/Section"
import Layout from "../layout/Layout"
import Loader from "../Loader"
import Nav from "../layout/Nav"
import SEO from "../layout/Seo"

const Order = ({ location, orderId }) => {
  const pid = location.pathname.slice(8)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState()
  const [customer, setCustomer] = useState()

  useEffect(() => {
    const retrieveOrder = async () => {
      setLoading(true)
      console.log("retrieving order...")
      console.log(pid)

      const response = await fetch("/.netlify/functions/retrieve-payment", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          paymentId: pid
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        // check if the paymentIntent has shipping information
        const { shipping, metadata, amount, charges } = data.paymentIntent
        setLoading(false)
        console.log(charges.data[0].created)

        // if shipping information exists, fill the form
        if (shipping) {
          const { receipt_email } = data.paymentIntent

          setAddress(shipping.address)
          setCustomer({...customer, name: shipping.name, email: receipt_email})
        }
      }).catch(err => {
        console.log(err)
      })
    }

    if (!location.state) {
      console.log('no state')
      retrieveOrder()
    }
  }, [])

  return (
    <Layout>
      <SEO title="Checkout" />
      <Nav chapterNumber={`of`} title="Order Summary"></Nav>
      <SectionMain className="has-max-height">
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <div>
                  <h1>Order Id: {orderId}</h1>
                  <h2>Order Summary</h2>
                  {loading && (
                    <Loader className="has-nav" />
                  )}
                  {location.state && (
                    <div>
                      <div>
                        <h3>Shipping address</h3>
                        <ul>
                          <li>{location.state.address.line1}</li>
                          <li>{location.state.address.city}</li>
                          <li>{location.state.address.state}</li>
                          <li>{location.state.address.postal_code}</li>
                        </ul>
                      </div>
                      <div>
                        <h3>Summary</h3>
                        <p>${convertToDecimal(location.state.totalAmount, 2)}</p>
                        <p>{location.state.shippingRate.rate}</p>
                        <p>{location.state.taxRate}</p>
                      </div>
                      <div>
                        <h3>Tracking</h3>
                        <p>{location.state.tracking.code}</p>
                        <p>{location.state.tracking.url}</p>
                      </div>
                    </div>
                  )}
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
