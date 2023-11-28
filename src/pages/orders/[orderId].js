import React from "react"

import Order from "../../components/checkout/Order"
import Seo from "../../components/layout/Seo"

const OrdersPage = ({ params, location }) => {
  return (
    <Order
      orderId={params.orderId}
      location={location}
    />
  )
}

export default OrdersPage