import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { colors, fonts, spacing } from "../styles/variables"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from '@stripe/react-stripe-js'
import { useShoppingCart } from "../components/cart/context/cartContext"
import { Container, Row, Col } from "react-grid-system"
import toast from 'react-hot-toast'
import { isBrowser, calculateDiscounts } from "../utils/helper-functions"
import updatePaymentIntent from "../functions/updatePaymentIntent"

import CheckoutSteps from "../components/checkout/CheckoutSteps"
import { Flexbox } from "../components/layout/Flexbox"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import { OrderBox } from "../components/shop/OrderSummary"
import Box from "../components/ui/Box"
import Breadcrumb from "../components/ui/Breadcrumb"
import CheckoutForm from "../components/form/CheckoutForm"
import AddressForm from "../components/form/AddressForm"
import Layout from "../components/layout/Layout"
import ShippingForm from "../components/form/ShippingForm"
import ValidateAddressModal from "../components/checkout/modals/ValidateAddressModal"

const Checkout = () => {
  const [stripe, setStripe] = useState(null)
  const { cartDetails, totalPrice, handleCloseCart } = useShoppingCart()
  const [cartItems, setCartItems] = useState([])
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
  const [activeCheckoutSteps, setActiveCheckoutSteps] = useState("shipping")
  const [addressStatus, setAddressStatus] = useState({
    msg: "Incomplete",
    color: colors.red.sixHundred,
  })
  const [methodStatus, setMethodStatus] = useState({
    msg: "Required",
    color: colors.red.sixHundred,
  })
  const [subtotal, setSubtotal] = useState(totalPrice)
  const [shippingValidated, setShippingValidated] = useState(false)
  const [methodValidated, setMethodValidated] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState("")
  const [addressError, setAddressError] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [authKey, setAuthKey] = useState(null)
  const [coupon, setCoupon] = useState({
    code: "",
    applied: false,
    error : "",
    loading: false,
  })
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
  const isCartEmpty = !cartDetails || (Object.keys(cartDetails).length === 0 && cartDetails.constructor === Object)
  const pid = isBrowser() && localStorage.getItem("pid")
  const elementsOptions = {
    clientSecret: clientSecret,
    fonts: [
      {
        cssSrc: "https://fonts.googleapis.com/css?family=Jost:400,700"
      }
    ],
    appearance: {
      theme: "stripe",
      variables: {
        fontFamily: fonts.text,
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
          fontSize: "1rem",
          lineHeight: "23px",
        },
        ".Input:focus": {
          boxShadow: colors.shadow.focus,
          borderColor: "transparent",
        },
        ".Input:hover": {
          boxShadow: colors.shadow.hover,
        },
        ".Input--invalid": {
          boxShadow: "none"
        },
        ".Error": {
          fontSize: "0.875rem",
          marginTop: "8px",
        },
        ".Label": {
          marginBottom: "8px",
          fontWeight: "400",
          fontSize: "0.875rem",
        }
      }
    }
  }

  useEffect(() => {
    handleCloseCart()
    setStripe(loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY))
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
          cartItems: cartDetails,
          updatePaymentIntent: true,
        })
      }).then(res => res.json()
      ).then(data => {
        // throw any errors!
        if (data.error) {
          throw data.error
        }

        const { isPaymentPaid } = data
        const { shipping, client_secret, metadata } = data.paymentIntent

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
            const { email } = metadata.paymentIntent

            setAddress(shipping.address)
            setCustomer({ ...customer, name: shipping.name, email: email })
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
          cartItems: cartDetails
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

    if (isBrowser()) {
      // push all product objects in cartDetails to an array
      let newSubtotal = 0
      // array to store cartItems
      const cartItemsArray = []
      // push all product objects in cartDetails to an array
      for (const cartItem in cartDetails) {
        const item = { ...cartDetails[cartItem] }
        const discounts = calculateDiscounts({
          quantity: item.quantity,
          price: item.price,
          rate: item.discounts.type,
        })
        newSubtotal += discounts.subtotal

        item.discounts = {
          ...item.discounts,
          ...discounts,
        }

        cartItemsArray.push(item)
      }

      setCartItems(cartItemsArray)
      setSubtotal(newSubtotal)
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
  async function forceAddressSubmit() {
    // hide the error modal
    setProcessing(true)
    
    try {
      // update the paymentIntent with shipping form data
      const response = await updatePaymentIntent(pid, { metadata: { email: customer.email } })

      if (response.error) {
        throw response.error
      }

      setActiveCheckoutSteps("method")
      setShippingValidated(true)
      setAddressStatus({
        msg: "Done",
        color: colors.green.sixHundred,
      })
      setProcessing(false)
      setShowModal({ show: false })
    }
    catch(error) {
      setProcessing(false)
      setShowModal({ show: false })
      toast.error(error)
    }
  }

  return (
    <Layout 
      loading={loading || paymentProcessing}
      loaderMsg={paymentProcessing && "Processing payment... Do not refresh or close this page!"}
      loaderClassName="has-nav"
      seoDetails={{
        title: "Checkout",
      }}
    >
      {clientSecret && (
        <Elements
          stripe={stripe}
          options={elementsOptions}
        >
          <SectionMain className="has-max-height">
            <Section>
              <SectionContent padding={`${spacing.large} 0`}>
                <Container xs sm md lg xl>
                  {serverError.show ? (
                    <Flexbox
                      flex="flex"
                      align="center"
                      justify="center"
                      width="100%"
                      height="100%"
                    >
                      {serverError.msg}
                    </Flexbox>
                  ) : (
                    <Row>
                      <Col sm={7}>
                        <Box
                          maxwidth="600px"
                        >
                          <Breadcrumb
                            items={breadcrumbItems}
                          />
                          <CheckoutSteps
                            activeCheckoutSteps={activeCheckoutSteps}
                            status={addressStatus}
                            onClick={setActiveCheckoutSteps}
                            prereq={true}
                            summaries={[
                              {
                                heading: "Email",
                                text: customer.email,
                              },
                              {
                                heading: "Name",
                                text: customer.name,
                              },
                              {
                                heading: "Address",
                                text: `${address.line1}, ${address.line2 ? address.line2 + "," : ""} ${address.city}, ${address.state} ${address.postal_code}`
                              }
                            ]}
                            tabName="shipping"
                            text="Shipping information"
                          >
                            <AddressForm
                              address={address}
                              customer={customer}
                              pid={pid}
                              setActiveCheckoutSteps={setActiveCheckoutSteps}
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
                          </CheckoutSteps>
                          <CheckoutSteps
                            activeCheckoutSteps={activeCheckoutSteps}
                            status={methodStatus}
                            onClick={setActiveCheckoutSteps}
                            prereq={shippingValidated}
                            summaries={selectedRate && [
                              {
                                heading: `${selectedRate.international ? "International" : "Ground"}`,
                                text: `$${selectedRate.formattedRate && selectedRate.formattedRate}`
                              }
                            ]}
                            tabName="method"
                            text="Shipping method"
                          >
                            <ShippingForm
                              activeCheckoutSteps={activeCheckoutSteps}
                              address={address}
                              cartItems={cartItems}
                              customer={customer}
                              pid={pid}
                              selectedRate={selectedRate}
                              setActiveCheckoutSteps={setActiveCheckoutSteps}
                              setAddress={setAddress}
                              setAuthKey={setAuthKey}
                              setMethodValidated={setMethodValidated}
                              setMethodStatus={setMethodStatus}
                              setSelectedRate={setSelectedRate}
                              setTax={setTax}
                              toast={toast}
                            />
                          </CheckoutSteps>
                          <CheckoutSteps
                            tabName="payment"
                            text="Payment information"
                            prereq={methodValidated}
                            onClick={setActiveCheckoutSteps}
                            activeCheckoutSteps={activeCheckoutSteps}
                          >
                            <CheckoutForm
                              address={address}
                              cartItems={cartItems}
                              clientSecret={clientSecret}
                              customer={customer}
                              pid={pid}
                              selectedRate={selectedRate}
                              setPaymentProcessing={setPaymentProcessing}
                              subtotal={subtotal}
                              tax={tax}
                              toast={toast}
                            />
                          </CheckoutSteps>
                        </Box>
                      </Col>
                      <Col sm={5}>
                        <OrderBox
                          items={cartItems}
                          coupon={coupon}
                          hideButton={true}
                          selectedRate={selectedRate}
                          subtotal={subtotal}
                          tax={tax}
                          pid={pid}
                          setCoupon={setCoupon}
                          setSelectedRate={setSelectedRate}
                          setSubtotal={setSubtotal}
                          setTax={setTax}
                        />
                      </Col>
                    </Row>
                  )}
                </Container>
              </SectionContent>
            </Section>
          </SectionMain>
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