import React from "react"
import { Router } from "@reach/router"
import Products from "../components/products/Products"
import NotebookProduct from "../components/products/NotebookProduct"

const ProductsRouter = () => {
  return (
    <Router basepath="/products">
      <Products path="/" />
      <NotebookProduct path="/notebook" />
    </Router>
  )
}

export default ProductsRouter
