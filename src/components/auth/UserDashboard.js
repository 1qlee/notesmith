import React from "react"
import { toast } from 'react-toastify'
import { widths } from "../../styles/variables"

import Toastify from "../ui/Toastify"
import Layout from "../layout/Layout"
import Content from "../ui/Content"
import AuthLayout from "./components/AuthLayout"
import sendEmailVerification from "../../functions/sendEmailVerification"

const UserDashboard = () => {

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
      <AuthLayout page="Dashboard">
        <Content
          h1fontsize="2rem"
          margin="32px 0"
          linktextdecoration="underline"
          maxwidth={widths.content.normal}
        >
          <h1>Welcome to Notesmith!</h1>
          <p>
            Thanks for signing up for Notesmith! We are currently actively building new features for the website. Please excuse the barren state of your dashboard at this time.
          </p>
        </Content>
      </AuthLayout>
      <Toastify />
    </Layout>
  )
}

export default UserDashboard
