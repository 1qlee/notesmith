import React from "react"
import { Router } from "@reach/router"
import Notebook from "../components/customize/Notebook"

const Customize = () => {
  return (
    <Router basepath="/customize">
      <Notebook default path="/notebook/:notebookId" />
    </Router>
  )
}

export default Customize
