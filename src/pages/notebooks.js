import React from "react"
import { Router } from "@reach/router"
import AllNotebooks from "../components/notebooks/AllNotebooks"
import WiredNotebook from "../components/notebooks/WiredNotebook"

const Notebooks = () => {
  return (
    <Router basepath="/notebooks">
      <AllNotebooks path="/" />
      <WiredNotebook path="/wired-notebook" />
    </Router>
  )
}

export default Notebooks
