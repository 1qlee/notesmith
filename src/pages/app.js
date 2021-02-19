import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout/Layout"
import PrivateRoute from "../components/auth/PrivateRoute"
import Dashboard from "../components/auth/Dashboard"
import Editor from "../components/auth/Editor"
import Settings from "../components/auth/Settings"
import Books from "../components/auth/Books"

const App = () => {
  return (
    <Router basepath="/app">
      <PrivateRoute default path="/dashboard" component={Dashboard} />
      <PrivateRoute path="/settings" component={Settings} />
      <PrivateRoute path="/create/:bookId" component={Editor} />
      <PrivateRoute path="/books" component={Books} />
    </Router>
  )
}
export default App
