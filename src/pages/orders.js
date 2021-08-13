import React from "react"
import { Router } from "@reach/router"
import Order from "../components/checkout/Order"

const Orders = () => {
  return (
    <Router basepath="/orders">
      <Order path="/:orderId" />
    </Router>
  )
}
export default Orders
