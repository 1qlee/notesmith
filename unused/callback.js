import React from "react"
import { Router, Redirect } from "@reach/router"
import { navigate } from "gatsby"
import { handleAuthentication, getProfile, isAuthenticated } from "../utils/auth"
import Layout from "../components/layout"

const Callback = () => {
  handleAuthentication()

  const user = getProfile()

  return (
    <Layout>
      <h1 style={{color:"#fff",textAlign:"center"}}>Callback</h1>
    </Layout>
  )
}

export default Callback
