import React from "react"
import { FirebaseProvider } from "./src/utils/auth"
import { CartProvider } from "./src/components/cart/context/cartContext"

export default ({ element }) => {
  return (
    <CartProvider
      allowedCountries={['US']}
      billingAddressCollection={true}
      currency="USD"
      mode="client-session"
      successUrl="notesmithbooks.com"
    >
      <FirebaseProvider>
        {element}
      </FirebaseProvider>
    </CartProvider>
  )
}
