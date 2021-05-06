import React from "react"
import "firebase/auth"
import "firebase/database"
import "firebase/firestore"
import "firebase/functions"
import "@stripe/stripe-js"
import { FirebaseProvider } from "./src/utils/auth"
import { CartProvider } from "use-shopping-cart"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

export const wrapRootElement = ({ element, props }) => {
  return (
    <CartProvider
      allowedCountries={['US']}
      billingAddressCollection={true}
      currency="USD"
      mode="client-session"
      stripe={stripePromise}
      successUrl="stripe.com"
    >
      <FirebaseProvider {...props}>{element}</FirebaseProvider>
    </CartProvider>
  )
}
