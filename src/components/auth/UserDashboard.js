import React, { useState } from "react"
import { Link } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { toast } from 'react-toastify'

import Toastify from "../ui/Toastify"
import Layout from "../layout/Layout"
import Content from "../Content"
import Seo from "../layout/Seo"
import AuthLayout from "./components/AuthLayout"
import sendEmailVerification from "../../functions/sendEmailVerification"

const UserDashboard = () => {
  const { user } = useFirebaseContext()

  async function handleSendEmail(email) {
    const emailFailed = await sendEmailVerification(email)
    // true if there is an error message
    if (emailFailed) {
      toast.error("There was an error sending the verification email, please try again.")
    }
    else {
      toast.success("Email has been successfully sent.")
    }
  }

  return (
    <Layout>
      <Seo title="Dashboard" />
      <AuthLayout page="Dashboard">
        {!user.emailVerified && (
          <Content
            margin="32px 0"
            linktextdecoration="underline"
          >
            <h3>Verify your email</h3>
            <p>We sent a verification link to your email address. If you didn't receive it, <a onClick={() => handleSendEmail(user.email)}>click here to resend the email</a> or <Link to="/account/settings">change your email address</Link>.
            </p>
          </Content>
        )}
      </AuthLayout>
      <Toastify />
    </Layout>
  )
}

export default UserDashboard
