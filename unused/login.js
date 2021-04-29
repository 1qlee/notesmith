import React from "react"
import { Link } from "gatsby"
import { useAuth0 } from "../utils/auth0Wrapper"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Login = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

  return (
    <Layout>
      <SEO title="Page two" />
      <h1>Login Page</h1>
      <p>Please login...</p>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default Login
