import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { colors, fonts, spacing } from "../styles/variables"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from '@stripe/react-stripe-js'
import { useShoppingCart } from "use-shopping-cart"
import { Container, Row, Col } from "react-grid-system"
import { toast } from 'react-toastify'

import { Flexbox } from "../components/layout/Flexbox"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import { OrderSummary } from "../components/shop/OrderSummary"
import Box from "../components/ui/Box"
import CheckoutForm from "../components/form/CheckoutForm"
import AddressForm from "../components/form/AddressForm"
import Layout from "../components/layout/Layout"
import Loader from "../components/misc/Loader"
import Nav from "../components/layout/Nav"
import Seo from "../components/layout/Seo"
import ShippingForm from "../components/form/ShippingForm"
import Toastify from "../components/ui/Toastify"
import ValidateAddressModal from "../components/checkout/modals/ValidateAddressModal"
import Content from "../components/ui/Content"

const Checkout = () => {
  const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)
  const { cartDetails, totalPrice, clearCart } = useShoppingCart()
  // array to store cartItems
  const cartItems = []
  // push all product objects in cartDetails to an array
  for (const cartItem in cartDetails) {
    cartItems.push(cartDetails[cartItem])
  }
  console.log(cartItems)
  const [activeTab, setActiveTab] = useState({
    index: 1,
    heading: "Shipping Address",
    text: "Please enter your shipping information below to continue."
  })
  const [clientSecret, setClientSecret] = useState("")
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addressError, setAddressError] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [authKey, setAuthKey] = useState(null)
  const [serverError, setServerError] = useState({
    msg: "",
    show: false,
  })
  const [selectedRate, setSelectedRate] = useState()
  const [taxRate, setTaxRate] = useState()
  const [shipmentId, setShipmentId] = useState()
  const [shippingMethod, setShippingMethod] = useState("")
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
  const elementsOptions = {
    mode: "payment",
    currency: "usd",
    captureMethod: "manual",
    amount: totalPrice,
    fonts: [
      {
        cssSrc: "https://fonts.googleapis.com/css?family=Inter:400,700"
      }
    ],
    appearance: {
      theme: "stripe",
      variables: {
        fontFamily: fonts.secondary,
        fontWeightNormal: "400",
        fontSizeBase: "16px",
        colorPrimary: colors.gray.nineHundred,
        colorText: colors.gray.nineHundred,
        colorDanger: colors.red.sixHundred,
        borderRadius: "4px",
      },
      rules: {
        ".Input": {
          padding: "16px",
          boxShadow: "none",
          border: `1px solid ${colors.gray.nineHundred}`,
          fontSize: "0.875rem",
        },
        ".Input:focus": {
          boxShadow: colors.shadow.focus,
          borderColor: "transparent",
        },
        ".Input:hover": {
          backgroundColor: colors.gray.oneHundred,
        },
        ".Input--invalid": {
          boxShadow: "none"
        },
        ".Error": {
          fontSize: "0.75rem",
          marginTop: "8px",
        },
        ".Label": {
          marginBottom: "8px",
          fontWeight: "700",
          fontSize: "0.75rem",
        }
      }
    }
  }

  // if the cart is empty, redirect the user to cart
  if (isCartEmpty) {
    navigate("/cart", { replace: true })
  }

  useEffect(() => {
    // to get an existing paymentIntent from Stripe
    function retrievePaymentIntent() {
      // show loading screen
      setLoading(true)

      // call on the retrieve-payment function defined in Netlify
      fetch("/.netlify/functions/retrieve-payment", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pid: pid
        })
      }).then(res => res.json()
      ).then(data => {
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
            setCustomer({ ...customer, name: shipping.name, email: receipt_email })
          }
        }
      }).catch(error => {
        setLoading(false)
        toast.error(error)
      })
    }

    // to create a new paymentIntent in Stripe
    function createPaymentIntent() {
      // show loading screen
      setLoading(true)

      // call on the create-payment function defined in Netlify
      fetch("/.netlify/functions/create-payment", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // send all cart items
          cartItems: cartItems
        })
      }).then(res => res.json()
      ).then(data => {
        // throw any errors!
        if (data.error) {
          throw data.error
        }

        const pid = data.paymentId
        setClientSecret(data.clientSecret)
        localStorage.setItem('pid', pid)
        setLoading(false)
      }).catch(error => {
        setLoading(false)
        toast.error(error)
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
  }, [cartDetails, pid])

  // copy of the function in AddressForm to create a paymentIntent w user's information
  function forceShippingSubmit() {
    // hide the error modal
    setProcessing(true)
    // update the paymentIntent with shipping form data
    fetch("/.netlify/functions/create-payment", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cartItems: cartItems, // always send current cart items
        paymentId: pid, // need pid from localStorage to update the corresponding paymentIntent
        email: customer.email,
        address: { address: {...address}, name: customer.name }, // always send shipping information
        customer: customer,
      })
    }).then(res => res.json()
    ).then(data => {
      // throw any errors!
      if (data.error) {
        throw data.error
      }

      setActiveTab({
        index: 2,
        text: "Please choose a shipping method below.",
        heading: "Shipping Method"
      })
      setProcessing(false)
      setShowModal({ show: false })
    }).catch(error => {
      setProcessing(false)
      setShowModal({ show: false })
      toast.error(error)
    })
  }

  return (
    <Elements
      stripe={stripePromise}
      options={elementsOptions}
    >
      <Layout loading={loading}>
        <Seo title="Checkout" />
        <Nav />
        {!paymentProcessing ? (
          <SectionMain className="has-max-height">
            <Section>
              <SectionContent padding={`${spacing.large} 0`}>
                <Container xs sm md lg xl>
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
                    <Row>
                      <Col sm={8}>
                        <Box
                          width="600px"
                        >
                          <Content
                            margin="0 0 32px"
                          >
                            <h3>{activeTab.heading}</h3>
                            <p>{activeTab.text}</p>
                          </Content>
                          {activeTab.index === 1 && (
                            <AddressForm
                              activeTab={activeTab}
                              address={address}
                              customer={customer}
                              pid={pid}
                              setActiveTab={setActiveTab}
                              setAddress={setAddress}
                              setAddressError={setAddressError}
                              setCustomer={setCustomer}
                              setShowModal={setShowModal}
                              toast={toast}
                            />
                          )}
                          {activeTab.index === 2 && (
                            <ShippingForm
                              activeTab={activeTab}
                              address={address}
                              cartItems={cartItems}
                              customer={customer}
                              selectedRate={selectedRate}
                              setActiveTab={setActiveTab}
                              setAddress={setAddress}
                              setAuthKey={setAuthKey}
                              setProcessing={setProcessing}
                              setSelectedRate={setSelectedRate}
                              setShipmentId={setShipmentId}
                              setShippingMethod={setShippingMethod}
                              setTaxRate={setTaxRate}
                              shipmentId={shipmentId}
                              shippingMethod={shippingMethod}
                              toast={toast}
                            />
                          )}
                          {activeTab.index === 3 && (
                            <CheckoutForm
                              activeTab={activeTab}
                              address={address}
                              customer={customer}
                              clearCart={clearCart}
                              cartItems={cartItems}
                              pid={pid}
                              selectedRate={selectedRate}
                              setActiveTab={setActiveTab}
                              setLoading={setLoading}
                              setPaymentProcessing={setPaymentProcessing}
                              setShippingMethod={setShippingMethod}
                              shipmentId={shipmentId}
                              shippingMethod={shippingMethod}
                              taxRate={taxRate}
                            />
                          )}
                        </Box>
                      </Col>
                      <Col sm={4}>
                        <OrderSummary
                          cartItems={cartItems}
                          hideButton={true}
                          selectedRate={selectedRate}
                          taxRate={taxRate}
                          totalPrice={totalPrice}
                        />
                      </Col>
                    </Row>
                  )}
                </Container>
              </SectionContent>
            </Section>
          </SectionMain>
        ) : (
          <Loader msg="Processing payment... Do not refresh or close this page!" />
        )}
        <Toastify />
        {showModal.show && (
          <ValidateAddressModal
            address={address}
            addressError={addressError}
            forceShippingSubmit={forceShippingSubmit}
            processing={processing}
            setShowModal={setShowModal}
          />
        )}
      </Layout>
    </Elements>
  )
}

export default Checkout
