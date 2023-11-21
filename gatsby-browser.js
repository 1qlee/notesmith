import React, { lazy, Suspense } from "react"
import { FirebaseProvider } from "./src/utils/auth"
import { CartProvider } from "use-shopping-cart"
import Loader from "./src/components/misc/Loader"

export const wrapRootElement = ({ element, props }) => {
  const stripe = lazy(() => import("./src/utils/stripejs"))
  console.log("🚀 ~ file: gatsby-browser.js:8 ~ wrapRootElement ~ stripe:", stripe)

  return (
    <Suspense fallback={Loader}>
      <CartProvider
        allowedCountries={['US']}
        billingAddressCollection={true}
        currency="USD"
        mode="client-session"
        stripe={stripe}
        successUrl="stripe.com"
      >
        <FirebaseProvider {...props}>{element}</FirebaseProvider>
      </CartProvider>
    </Suspense>
  )
}
