import React from "react"
import { Router } from "@reach/router"
import Order from "../components/checkout/Order"

const Orders = () => {
  return (
    <>
      <Router basepath="/orders">
        <Order path="/:orderId" />
      </Router>
      <h1>Are you looking for a specific order?</h1>
    </>
  )
}
export default Orders
