import React from "react"

import Order from "../../components/checkout/Order"

const OrdersPage = ({ params, location }) => {
  return (
    <Order
      orderId={params.orderId}
      location={location}
    />
  )
}

export default OrdersPage
