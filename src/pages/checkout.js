import React, { useEffect, useState } from "react"
import { Link, navigate } from "gatsby"
import { colors, spacing } from "../styles/variables"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useShoppingCart } from "use-shopping-cart"
import { WarningCircle } from "phosphor-react"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Flexbox } from "../components/layout/Flexbox"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import Breadcrumb from "../components/ui/Breadcrumb"
import CheckoutForm from "../components/form/CheckoutForm"
import Content from "../components/Content"
import Icon from "../components/Icon"
import InformationForm from "../components/form/InformationForm"
import Layout from "../components/layout/Layout"
import Loader from "../components/Loader"
import Nav from "../components/layout/Nav"
import Notification from "../components/ui/Notification"
import { OrderSummary } from "../components/shop/OrderSummary"
import Seo from "../components/layout/Seo"
import ShippingForm from "../components/form/ShippingForm"
import ValidateAddressModal from "../components/checkout/modals/ValidateAddressModal"

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

const Checkout = ({ location }) => {
  const { cartDetails } = useShoppingCart()
  const [activeTab, setActiveTab] = useState(1)
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [formError, setFormError] = useState("")
  const [addressError, setAddressError] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [serverError, setServerError] = useState({
    msg: "",
    show: false,
  })
  const [selectedRate, setSelectedRate] = useState()
  const [taxRate, setTaxRate] = useState()
  const [shipmentId, setShipmentId] = useState()
  const [showShippingMethod, setShowShippingMethod] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("")
  const [authKey, setAuthKey] = useState()
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
    country: "",
  })
  const isCartEmpty = Object.keys(cartDetails).length === 0 && cartDetails.constructor === Object
  const pid = localStorage.getItem("pid")

  // if the cart is empty, redirect the user to cart
  if (isCartEmpty) {
    navigate("/cart", { replace: true })
  }

  useEffect(() => {
    // to get an existing paymentIntent from Stripe
    async function retrievePaymentIntent() {
      // show loading screen
      setLoading(true)

      // call on the retrieve-payment function defined in Netlify
      await fetch("/.netlify/functions/retrieve-payment", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pid: pid
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        // throw any errors!
        if (data.error) {
          throw data.error
        }

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
      }).catch(error => {
        setLoading(false)
        setServerError({
          show: true,
          msg: error
        })
      })
    }

    // to create a new paymentIntent in Stripe
    async function createPaymentIntent() {
      // show loading screen
      setLoading(true)
      localStorage.removeItem("pid")

      // call on the create-payment function defined in Netlify
      await fetch("/.netlify/functions/create-payment", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // send all cart items
          cartItems: {...cartDetails}
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        // throw any errors!
        if (data.error) {
          throw data.error
        }

        const pid = data.paymentId
        setClientSecret(data.clientSecret)
        setLoading(false)

        // set a pid value in localStorage based on newly created paymentIntent
        localStorage.setItem('pid', pid)
      }).catch(error => {
        setLoading(false)
        setServerError({
          show: true,
          msg: error
        })
      })
    }

    // if pid exists in localStorage, retrieve it from Stripe
    if (pid && pid !== "undefined") {
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
        cartItems: {...cartDetails}, // always send current cart items
        paymentId: pid, // need pid from localStorage to update the corresponding paymentIntent
        email: customer.email,
        address: {address: {...address}, name: customer.name}, // always send shipping information
        customer: customer,
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      // throw any errors!
      if (data.error) {
        throw data.error
      }

      setProcessing(false)
      setShowShippingMethod(true)
    }).catch(error => {
      setProcessing(false)
      setFormError(error)
    })
  }

  return (
    <Layout>
      <Seo title="Checkout" />
      <Nav />
      {!paymentProcessing ? (
        <SectionMain className="has-max-height">
          <Section>
            <Container>
              <LayoutContainer>
                <SectionContent>
                  {serverError.show ? (
                    <Flexbox
                      flex="flex"
                      alignitems="center"
                      justifycontent="center"
                      width="100%"
                      height="100%"
                    >
                      {serverError.msg}
                    </Flexbox>
                  ) : (
                    <Grid
                      rowGap={spacing.normal}
                      columnGap={spacing.medium}
                      columns="repeat(auto-fit,minmax(360px,1fr))"
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
                              <a className={activeTab === 1 ? "is-active" : null}>Shipping</a>
                            </li>
                            {activeTab === 1 ? (
                              <li
                                className="is-disabled"
                              >
                                <a>Payment</a>
                              </li>
                            ) : (
                              <li
                                onClick={() => setActiveTab(2)}
                              >
                                <a className={activeTab === 2 ? "is-active" : null}>Payment</a>
                              </li>
                            )}
                          </ul>
                        </Breadcrumb>
                        <Flexbox
                          width="600px"
                        >
                          {formError && (
                            <Notification
                              backgroundcolor={colors.red.twoHundred}
                              bordercolor={colors.red.twoHundred}
                              justifycontent="flex-start"
                              margin="0 0 2rem"
                              padding="1rem"
                            >
                              <Icon
                                backgroundcolor={colors.red.twoHundred}
                                borderradius="100%"
                                margin="0 1rem 0 0"
                                className="is-pulsating"
                                pulseColor={colors.red.threeHundred}
                              >
                                <WarningCircle size="1.5rem" weight="fill" color={colors.red.sixHundred} />
                              </Icon>
                              <Content
                                paragraphcolor={colors.red.nineHundred}
                              >
                                <p>{formError}</p>
                              </Content>
                            </Notification>
                          )}
                          {activeTab === 1 && !showShippingMethod && (
                            <>
                              <Content
                                margin="0 0 2rem 0"
                                h3fontweight="400"
                              >
                                <h3>Shipping Address</h3>
                                <p>Please enter the shipping information for this order.</p>
                              </Content>
                              <InformationForm
                                activeTab={activeTab}
                                address={address}
                                customer={customer}
                                loading={loading}
                                processing={processing}
                                setAddress={setAddress}
                                setAddressError={setAddressError}
                                setCustomer={setCustomer}
                                setFormError={setFormError}
                                setLoading={setLoading}
                                setProcessing={setProcessing}
                                setShowModal={setShowModal}
                                setShowShippingMethod={setShowShippingMethod}
                                showShippingMethod={showShippingMethod}
                              />
                            </>
                          )}
                          {activeTab === 1 && showShippingMethod && (
                            <>
                              <Content
                                margin="0 0 2rem 0"
                                h3fontweight="400"
                              >
                                <h3>Shipping Method</h3>
                                <p>Confirm your shipping address and then select a shipping method.</p>
                              </Content>
                              <ShippingForm
                                address={address}
                                customer={customer}
                                processing={processing}
                                selectedRate={selectedRate}
                                setActiveTab={setActiveTab}
                                setAddress={setAddress}
                                setAuthKey={setAuthKey}
                                setFormError={setFormError}
                                setProcessing={setProcessing}
                                setSelectedRate={setSelectedRate}
                                setShipmentId={setShipmentId}
                                setShippingMethod={setShippingMethod}
                                setShowShippingMethod={setShowShippingMethod}
                                setTaxRate={setTaxRate}
                                shipmentId={shipmentId}
                                shippingMethod={shippingMethod}
                                showShippingMethod={showShippingMethod}
                              />
                            </>
                          )}
                          {activeTab === 2 && (
                            <Elements
                              stripe={stripePromise}
                            >
                              <Content
                                margin="0 0 2rem 0"
                                h3fontweight="400"
                              >
                                <h3>Payment Information</h3>
                                <p>Please make sure your information is correct, then click the pay now button to process your order.</p>
                              </Content>
                              <CheckoutForm
                                activeTab={activeTab}
                                address={address}
                                clientSecret={clientSecret}
                                customer={customer}
                                pid={pid}
                                processing={processing}
                                selectedRate={selectedRate}
                                setActiveTab={setActiveTab}
                                setLoading={setLoading}
                                setPaymentProcessing={setPaymentProcessing}
                                setProcessing={setProcessing}
                                setShippingMethod={setShippingMethod}
                                setShowShippingMethod={setShowShippingMethod}
                                shipmentId={shipmentId}
                                shippingMethod={shippingMethod}
                                taxRate={taxRate}
                              />
                            </Elements>
                          )}
                        </Flexbox>
                      </Cell>
                      <Cell width={1}>
                        <OrderSummary
                          hideButton={true}
                          selectedRate={selectedRate}
                          taxRate={taxRate}
                        />
                      </Cell>
                    </Grid>
                  )}
                  {loading && (
                    <Loader className="has-nav" msg="Do not refresh the page!" />
                  )}
                </SectionContent>
              </LayoutContainer>
            </Container>
          </Section>
        </SectionMain>
      ) : (
        <Loader className="has-nav" msg="Processing payment... Do not refresh or close this page!" />
      )}
      {showModal.show && (
        <ValidateAddressModal
          address={address}
          addressError={addressError}
          forceShippingSubmit={forceShippingSubmit}
          setShowModal={setShowModal}
        />
      )}
    </Layout>
  )
}

export default Checkout
