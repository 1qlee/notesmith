import React from "react"
import { Router } from "@reach/router"
import PrivateRoute from "../components/auth/PrivateRoute"
import Dashboard from "../components/auth/Dashboard"
import Settings from "../components/auth/Settings"
import Books from "../components/auth/Books"

const App = () => {
  return (
    <Router basepath="/app">
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <PrivateRoute path="/settings" component={Settings} />
      <PrivateRoute path="/books" component={Books} />
    </Router>
  )
}
export default App
