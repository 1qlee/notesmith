import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout/Layout"
import PrivateRoute from "../components/auth/PrivateRoute"
import Profile from "../components/auth/Profile"

const App = () => {
  return (
    <Layout>
      <Router basepath="/app">
        <PrivateRoute default path="/profile" component={Profile} />
      </Router>
    </Layout>
  )
}
export default App
