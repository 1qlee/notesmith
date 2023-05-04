import React from "react"
import "firebase/auth"
import "firebase/database"
import "firebase/firestore"
import "firebase/functions"
import "@stripe/stripe-js"
import { FirebaseProvider } from "./src/utils/auth"
import { CartProvider } from "use-shopping-cart"

export const wrapRootElement = ({ element, props }) => {
  return (
    <CartProvider
      allowedCountries={['US']}
      billingAddressCollection={true}
      currency="USD"
      mode="client-session"
      stripe={process.env.GATSBY_STRIPE_PUBLISHABLE_KEY}
      successUrl="stripe.com"
    >
      <FirebaseProvider {...props}>{element}</FirebaseProvider>
    </CartProvider>
  )
}
