import React, { useEffect, useState } from "react"
import { Link, navigate } from "gatsby"
import { colors, spacing } from "../styles/variables"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useShoppingCart } from "use-shopping-cart"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Flexbox } from "../components/layout/Flexbox"
import { Grid, Cell } from "styled-css-grid"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../components/ui/Modal"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import { StyledFieldset, StyledLabel, ErrorLine } from "../components/form/FormComponents"
import Breadcrumb from "../components/Breadcrumb"
import Button from "../components/Button"
import CheckoutForm from "../components/form/CheckoutForm"
import Content from "../components/Content"
import InformationForm from "../components/form/InformationForm"
import Layout from "../components/layout/Layout"
import Loader from "../components/Loader"
import Nav from "../components/layout/Nav"
import OrderSummary from "../components/shop/OrderSummary"
import SEO from "../components/layout/Seo"
import ShippingInfo from "../components/checkout/ShippingInfo"
import TextLink from "../components/TextLink"

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY_TEST)

const Checkout = ({ location }) => {
  const { cartDetails } = useShoppingCart()
  const [activeTab, setActiveTab] = useState(1)
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [formError, setFormError] = useState("")
  const [selectedRate, setSelectedRate] = useState()
  const [taxRate, setTaxRate] = useState()
  const [shipment, setShipment] = useState()
  const [showModal, setShowModal] = useState({
    show: false
  })
  const [customer, setCustomer] = useState({
    name: "",
    email: ""
  })
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US"
  })
  const isCartEmpty = Object.keys(cartDetails).length === 0 && cartDetails.constructor === Object

  // if the cart is empty, redirect the user to cart
  if (isCartEmpty) {
    navigate("/cart")
  }

  useEffect(() => {
    // let params = (new URL(document.location)).searchParams
    // let step = params.get("step")
    // console.log(step)
    // switch(step) {
    //   case "information":
    //     setActiveTab(1)
    //     break
    //   case "shipping":
    //     setActiveTab(2)
    //     break
    //   case "payment":
    //     setActiveTab(3)
    //     break
    //   default:
    //     setActiveTab(1)
    // }

    // to get an existing paymentIntent from Stripe
    async function retrievePaymentIntent() {
      // show loading screen
      setLoading(true)

      // call on the retrieve-payment function defined in Netlify
      const response = await fetch("/.netlify/functions/retrieve-payment", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // use the pid in localStorage
          paymentId: localStorage.getItem("pid")
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        const { isPaymentPaid } = data
        const { shipping, client_secret } = data.paymentIntent

        // if this pid is old (aka paid already), remove it from localStorage
        if (isPaymentPaid) {
          localStorage.removeItem("pid")
          setLoading(false)
          // create a fresh paymentIntent
          createPaymentIntent()
        }
        else {
          setLoading(false)
          setClientSecret(client_secret)

          // if shipping information exists, fill the form
          if (shipping) {
            const { receipt_email } = data.paymentIntent

            setAddress(shipping.address)
            setCustomer({...customer, name: shipping.name, email: receipt_email})
          }
        }
      }).catch(err => {
        setFormError(err.msg)
      })
    }

    // to create a new paymentIntent in Stripe
    async function createPaymentIntent() {
      // show loading screen
      setLoading(true)

      // call on the create-payment function defined in Netlify
      const response = await fetch("/.netlify/functions/create-payment", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // send all cart items
          productData: {...cartDetails}
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        setClientSecret(data.clientSecret)
        setLoading(false)

        // set a pid value in localStorage based on newly created paymentIntent
        localStorage.setItem('pid', data.paymentId)
      }).catch(err => {
        console.log(err.msg)
        setFormError(err.msg)
      })
    }

    // if pid exists in localStorage, retrieve it from Stripe
    if (localStorage.getItem("pid")) {
      retrievePaymentIntent()
    }
    // otherwise, create a new one
    else {
      createPaymentIntent()
    }
  }, [])

  // copy of the function in InformationForm to create a paymentIntent w user's information
  async function forceShippingSubmit() {
    // hide the error modal
    setProcessing(true)
    setShowModal({
      show: false
    })
    // update the paymentIntent with shipping form data
    const payment = await fetch("/.netlify/functions/create-payment", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productData: {...cartDetails}, // always send current cart items
        paymentId: localStorage.getItem("pid"), // need pid from localStorage to update the corresponding paymentIntent
        email: customer.email,
        address: {address: {...address}, name: customer.name}, // always send shipping information
        customer: customer
      })
    }).then(res => {
      setFormError({
        msg: ""
      })
      return res.json()
    }).then(data => {
      setProcessing(false)
      setActiveTab(2)
    }).catch(err => {
      setProcessing(false)
      setFormError({
        msg: "Something went wrong processing your information."
      })
    })
  }

  return (
    <Layout>
      <SEO title="Checkout" />
      <Nav chapterNumber={`0${activeTab}`} title="Cart"></Nav>
      <SectionMain className="has-max-height">
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  rowGap={spacing.normal}
                  columnGap={spacing.large}
                  columns="repeat(auto-fit,minmax(240px,1fr))"
                  rows="auto"
                  justifycontent="center"
                >
                  <Cell width={2}>
                    <Breadcrumb>
                      <ul>
                        <li>
                          <Link to="/cart" className="first">Cart</Link>
                        </li>
                        <li onClick={() => setActiveTab(1)}>
                          <a className={activeTab === 1 ? "is-active" : null}>Information</a>
                        </li>
                        {activeTab === 1 ? (
                          <li
                            className="is-disabled"
                          >
                            <a>Shipping</a>
                          </li>
                        ) : (
                          <li onClick={() => setActiveTab(2)}>
                            <a className={activeTab === 2 ? "is-active" : null}>Shipping</a>
                          </li>
                        )}
                        {activeTab === 2 || activeTab === 1 ? (
                          <li
                            className="is-disabled"
                          >
                            <a>Payment</a>
                          </li>
                        ) : (
                          <li
                            onClick={() => setActiveTab(3)}
                          >
                            <a className={activeTab === 3 ? "is-active" : null}>Payment</a>
                          </li>
                        )}
                      </ul>
                    </Breadcrumb>
                    <Content
                      margin="0 0 2rem 0"
                    >
                      {activeTab === 1 && (
                        <h3>1. Information</h3>
                      )}
                      {activeTab === 2 && (
                        <h3>2. Shipping</h3>
                      )}
                      {activeTab === 3 && (
                        <h3>3. Payment</h3>
                      )}
                      {formError.msg && (
                        <ErrorLine
                          color={colors.red.sixHundred}
                        >
                          {formError.msg}
                        </ErrorLine>
                      )}
                    </Content>
                    {activeTab === 1 ? (
                      <InformationForm
                        activeTab={activeTab}
                        address={address}
                        customer={customer}
                        loading={loading}
                        processing={processing}
                        setActiveTab={setActiveTab}
                        setAddress={setAddress}
                        setCustomer={setCustomer}
                        setFormError={setFormError}
                        setLoading={setLoading}
                        setProcessing={setProcessing}
                        setShowModal={setShowModal}
                      />
                    ) : (
                      <ShippingInfo
                        customer={customer}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        address={address}
                        setFormError={setFormError}
                        setTaxRate={setTaxRate}
                        setSelectedRate={setSelectedRate}
                        processing={processing}
                        setProcessing={setProcessing}
                        setShipment={setShipment}
                      />
                    )}
                    <Elements
                      stripe={stripePromise}
                    >
                      {activeTab === 3 ? (
                        <CheckoutForm
                          activeTab={activeTab}
                          address={address}
                          clientSecret={clientSecret}
                          customer={customer}
                          processing={processing}
                          selectedRate={selectedRate}
                          setActiveTab={setActiveTab}
                          setAddress={setAddress}
                          setCustomer={setCustomer}
                          setLoading={setLoading}
                          setProcessing={setProcessing}
                          shipment={shipment}
                          taxRate={taxRate}
                        />
                      ) : ( null)}
                    </Elements>
                  </Cell>
                  <Cell width={2}>
                    <OrderSummary
                      hideButton={true}
                      selectedRate={selectedRate}
                      taxRate={taxRate}
                    />
                  </Cell>
                </Grid>
                {loading && (
                  <Loader className="has-nav" />
                )}
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
      {showModal.show && (
        <Modal setShowModal={setShowModal}>
          <ModalHeader
            backgroundcolor={colors.red.sixHundred}
            color={colors.white}
          >
            <h5>Something went wrong when processing your address.</h5>
          </ModalHeader>
          <ModalContent>
            <Content margin="0 0 2rem 0">
              <h5>Errors:</h5>
              <ul>
                {formError.map(error => (
                  <li key={error.message}>{error.message}</li>
                ))}
              </ul>
            </Content>
            <Content paragraphlineheight="1.5" paragraphmarginbottom="0">
              <h5>Your address:</h5>
              <p>{address.line1}, {address.line2}</p>
              <p>{address.city}, {address.state} {address.postal_code}</p>
            </Content>
          </ModalContent>
          <ModalFooter
            justifycontent="space-between"
          >
            <TextLink
              color={colors.link.normal}
              hovercolor={colors.link.hover}
              as="button"
              onClick={() => setShowModal({ show: false })}
            >
              a.) Edit address
            </TextLink>
            <TextLink
              color={colors.link.normal}
              hovercolor={colors.link.hover}
              as="button"
              onClick={forceShippingSubmit}
            >
              b.) Proceed with address as is
            </TextLink>
          </ModalFooter>
        </Modal>
      )}
    </Layout>
  )
}

export default Checkout
