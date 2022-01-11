import React from "react"
import { Router } from "@reach/router"
import Editor from "../components/customize/Editor"

const Customize = () => {
  return (
    <Router basepath="/customize" style={{height: "100%"}}>
      <Editor path="/notebook/" />
      <Editor path="/notebook/:bookId" />
    </Router>
  )
}

export default Customize
