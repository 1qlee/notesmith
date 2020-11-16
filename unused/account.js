import React from "react"
import { Router } from "@reach/router"
import { Link, navigate } from "gatsby"
import { useAuth0 } from "../utils/auth0Wrapper"
import ProtectedRoute from "../utils/ProtectedRoute"
import Loader from "../components/Loader"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Settings from "../components/Settings"

const Home = ({ children, user}) => {
  return (
    <>
      <p style={{color:"white"}}>{JSON.stringify(user, null, 2)}</p>
      {children}
    </>
  )
}
const Billing = () => <h1 style={{color:"white"}}>Billing</h1>

const Account = ({ location }) => {
  const { loading, isAuthenticated, logout, user, loginWithRedirect } = useAuth0()
  const { pathname } = window.location

  return (
    <Layout>
      <ProtectedRoute pathname={pathname}>
      <SEO title={location.state ? location.state.title : location.pathname} />
      {isAuthenticated && user ? (
        <>
          <nav>
            <Link to="account/" activeClassName="is-active" state={{ title: "Account" }}>Home</Link>
            <Link to="account/settings" activeClassName="is-active" state={{ title: "Settings" }}>Settings</Link>
            <Link to="account/billing" activeClassName="is-active" state={{ title: "Billing" }}>Billing</Link>
            <a href="#logout"
             onClick={() =>
              logout({
                returnTo:
                  process.env.AUTH0_LOGOUT_URL ||
                  process.env.GATSBY_AUTH0_LOGOUT_URL,
                })
              }>
             Log Out
           </a>
          </nav>
          <Router>
            <Home path="account" user={user}>
              <Settings path="/settings" user={user} />
              <Billing path="/billing" />
            </Home>
          </Router>
        </>
      ) : (
        <Loader />
      )}
      </ProtectedRoute>
    </Layout>
  )
}

export default Account
