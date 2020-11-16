import React from "react"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"

import Button from "../components/Button"
import Layout from "../components/layout/Layout"
import Loader from "../components/Loader"
import SEO from "../components/layout/Seo"

import { colors } from "../styles/variables"

const AccountPage = () => {
  const { user, logout } = useAuth0()

  return (
    <Layout>
      <SEO title="My Account" />
      <div>
        <h2>Hi, {JSON.stringify(user, null, 2)}</h2>
      </div>
      <Button
        onClick={() => logout()}
        color={colors.white}
        background={colors.primary.sixHundred}
        className="is-small"
      >
        Log Out
      </Button>
    </Layout>
  )
}

export default withAuthenticationRequired(AccountPage, {
  onRedirecting: () => <Loader />,
  returnTo: window.location.hash.substr(1)
})
