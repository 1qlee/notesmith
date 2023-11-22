import React from "react"
import { Script } from "gatsby"
import { FirebaseProvider } from "./src/utils/auth"
import { CartProvider } from "use-shopping-cart"

export const wrapRootElement = ({ element, props }) => {

  return (
    <CartProvider
      allowedCountries={['US']}
      billingAddressCollection={true}
      currency="USD"
      mode="client-session"
      successUrl="stripe.com"
    >
      <FirebaseProvider {...props}>
        {element}
        <Script 
          src="https://js.stripe.com/v3" 
          strategy="off-main-thread"
        />
      </FirebaseProvider>
    </CartProvider>
  )
}
