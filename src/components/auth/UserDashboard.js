import React from "react"
import { Link } from "gatsby"
import Layout from "../layout/Layout"
import { useFirebaseContext } from "../../utils/auth"
import { colors } from "../../styles/variables"

import Content from "../Content"
import Seo from "../layout/Seo"
import AuthLayout from "./components/AuthLayout"

const UserDashboard = () => {
  const { signOut, user, sendEmailVerification } = useFirebaseContext()

  function handleSignOut() {
    signOut().then(() => {
      console.log("Signing out...")
    }).catch(error => {
      console.log(error.code, error.msg)
    })
  }

  return (
    <Layout>
      <Seo title="Dashboard" />
      <AuthLayout page="Dashboard">
        <h3 onClick={handleSignOut}>Sign out</h3>
        {!user.emailVerified && (
          <Content linkcolor={colors.link.normal}>
            <p>Verify your email.</p>
            <p>We sent a verification link to {user.email}. If you didn't receive it, <a onClick={sendEmailVerification}>resend the email</a> or <Link to="/account/settings">update your email</Link> to verify with a different email.
            </p>
          </Content>
        )}
        <p>{JSON.stringify(user, 2)}</p>
      </AuthLayout>
    </Layout>
  )
}

export default UserDashboard
