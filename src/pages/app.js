import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout/Layout"
import PrivateRoute from "../components/auth/PrivateRoute"
import Dashboard from "../components/auth/Dashboard"
import Settings from "../components/auth/Settings"

const App = () => {
  return (
    <Layout>
      <Router basepath="/app">
        <PrivateRoute default path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/settings" component={Settings} />
      </Router>
    </Layout>
  )
}
export default App
