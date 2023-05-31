import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { colors, fonts, spacing, convertToDecimal } from "../styles/variables"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from '@stripe/react-stripe-js'
import { useShoppingCart } from "use-shopping-cart"
import { Container, Row, Col } from "react-grid-system"
import { toast } from 'react-toastify'

import { AccordionTab } from "../components/checkout/Accordion"
import { Flexbox } from "../components/layout/Flexbox"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import { OrderSummary } from "../components/shop/OrderSummary"
import Box from "../components/ui/Box"
import Breadcrumb from "../components/ui/Breadcrumb"
import CheckoutForm from "../components/form/CheckoutForm"
import AddressForm from "../components/form/AddressForm"
import Layout from "../components/layout/Layout"
import Loader from "../components/misc/Loader"
import Nav from "../components/layout/Nav"
import Seo from "../components/layout/Seo"
import ShippingForm from "../components/form/ShippingForm"
import Toastify from "../components/ui/Toastify"
import ValidateAddressModal from "../components/checkout/modals/ValidateAddressModal"

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

const Checkout = () => {
  const { cartDetails, totalPrice, clearCart } = useShoppingCart()
  // array to store cartItems
  const cartItems = []
  // push all product objects in cartDetails to an array
  for (const cartItem in cartDetails) {
    cartItems.push(cartDetails[cartItem])
  }
  const breadcrumbItems = [
    {
      text: "Cart",
      path: "/cart",
      index: 0,
    },
    {
      text: "Checkout",
      path: "/checkout",
      index: 1,
    }
  ]
  const [activeAccordionTab, setActiveAccordionTab] = useState("shipping")
  const [addressStatus, setAddressStatus] = useState({
    msg: "Incomplete",
    color: colors.red.oneHundred,
    background: colors.red.sixHundred,
  })
  const [methodStatus, setMethodStatus] = useState({
    msg: "Selection required",
    color: colors.red.oneHundred,
    background: colors.red.sixHundred,
  })
  const [checkoutStatus, setCheckoutStatus] = useState({
    msg: "",
    color: "",
    background: "",
  })
  const [shippingValidated, setShippingValidated] = useState(false)
  const [methodValidated, setMethodValidated] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState("")
  const [addressError, setAddressError] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [authKey, setAuthKey] = useState(null)
  const [serverError, setServerError] = useState({
    msg: "",
    show: false,
  })
  const [selectedRate, setSelectedRate] = useState()
  const [tax, setTax] = useState({
    amount: 0,
    id: 0,
  })
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
    country: "US",
  })
  const isCartEmpty = Object.keys(cartDetails).length === 0 && cartDetails.constructor === Object
  const pid = localStorage.getItem("pid")
  const elementsOptions = {
    clientSecret: clientSecret,
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

  useEffect(() => {
    console.log(cartItems)
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
          pid: pid,
          cartItems: cartItems,
          updatePaymentIntent: true,
        })
      }).then(res => res.json()
      ).then(data => {
        // throw any errors!
        if (data.error) {
          throw data.error
        }

        const { isPaymentPaid } = data
        const { shipping, client_secret } = data.paymentIntent

        setClientSecret(client_secret)

        // if this pid is old (aka paid already), remove it from localStorage
        if (isPaymentPaid) {
          localStorage.removeItem("pid")
          setLoading(false)
          // create a fresh paymentIntent
          createPaymentIntent()
        }
        else {
          setLoading(false)

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

        const pid = data.pid
        setClientSecret(data.clientSecret)
        localStorage.setItem('pid', pid)
        setLoading(false)
      }).catch(error => {
        setLoading(false)
        toast.error(error)
      })
    }

    // if pid exists in localStorage, retrieve it from Stripe
    if (isCartEmpty) {
      navigate("/cart", { replace: true })
    }
    else {
      if (pid && pid !== "undefined") {
        retrievePaymentIntent()
      }
      // otherwise, create a new one
      else {
        createPaymentIntent()
      }
    }
  }, [cartDetails])

  // when user wants to use their inputted address versus Easypost api suggestion
  function forceAddressSubmit() {
    // hide the error modal
    setProcessing(true)
    // update the paymentIntent with shipping form data
    fetch("/.netlify/functions/update-address", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pid: pid,
        address: address,
        name: customer.name,
        email: customer.email,
      })
    }).then(res => res.json()
    ).then(data => {
      // throw any errors!
      if (data.error) {
        throw data.error
      }

      setActiveAccordionTab("method")
      setShippingValidated(true)
      setAddressStatus({
        msg: "Done",
        color: colors.gray.oneHundred,
        background: colors.gray.nineHundred,
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
    <Layout loading={loading}>
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={elementsOptions}
        >
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
                            <Breadcrumb
                              items={breadcrumbItems}
                            />
                            <AccordionTab
                              activeAccordionTab={activeAccordionTab}
                              status={addressStatus}
                              onClick={setActiveAccordionTab}
                              prereq={true}
                              summaries={[
                                customer.email,
                                customer.name,
                                `${address.line1 || address.street1 || ""} ${address.line2 || address.street2 ||""}, ${address.city || ""}, ${address.state || ""}, ${address.postal_code || address.zip || ""}, ${address.country || ""}`
                              ]}
                              tabName="shipping"
                              text="Shipping information"
                            >
                              <AddressForm
                                address={address}
                                customer={customer}
                                pid={pid}
                                setActiveAccordionTab={setActiveAccordionTab}
                                setAddress={setAddress}
                                setAddressError={setAddressError}
                                setAddressStatus={setAddressStatus}
                                setCustomer={setCustomer}
                                setMethodValidated={setMethodValidated}
                                setMethodStatus={setMethodStatus}
                                setSelectedRate={setSelectedRate}
                                setShippingValidated={setShippingValidated}
                                setShowModal={setShowModal}
                                setTax={setTax}
                                shippingValidated={shippingValidated}
                                toast={toast}
                              />
                            </AccordionTab>
                            <AccordionTab
                              activeAccordionTab={activeAccordionTab}
                              status={methodStatus}
                              onClick={setActiveAccordionTab}
                              prereq={shippingValidated}
                              summaries={selectedRate && [
                                `${selectedRate.international ? "International shipping" : "Ground shipping"}`,
                                `$${selectedRate.rate !== undefined && convertToDecimal(selectedRate.rate, 2)}`
                              ]}
                              tabName="method"
                              text="Shipping method"
                            >
                              <ShippingForm
                                activeAccordionTab={activeAccordionTab}
                                address={address}
                                cartItems={cartItems}
                                customer={customer}
                                pid={pid}
                                selectedRate={selectedRate}
                                setActiveAccordionTab={setActiveAccordionTab}
                                setAddress={setAddress}
                                setAuthKey={setAuthKey}
                                setMethodValidated={setMethodValidated}
                                setMethodStatus={setMethodStatus}
                                setSelectedRate={setSelectedRate}
                                setTax={setTax}
                                toast={toast}
                              />
                            </AccordionTab>
                            <AccordionTab
                              tabName="payment"
                              text="Payment information"
                              prereq={methodValidated}
                              onClick={setActiveAccordionTab}
                              activeAccordionTab={activeAccordionTab}
                            >
                              <CheckoutForm
                                address={address}
                                authKey={authKey}
                                cartItems={cartItems}
                                clientSecret={clientSecret}
                                customer={customer}
                                pid={pid}
                                setPaymentProcessing={setPaymentProcessing}
                                tax={tax}
                                toast={toast}
                              />
                            </AccordionTab>
                          </Box>
                        </Col>
                        <Col sm={4}>
                          <OrderSummary
                            cartItems={cartItems}
                            hideButton={true}
                            selectedRate={selectedRate}
                            tax={tax}
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
              forceAddressSubmit={forceAddressSubmit}
              processing={processing}
              setShowModal={setShowModal}
            />
          )}
        </Elements>
      )}
    </Layout>
  )
}

export default Checkout
