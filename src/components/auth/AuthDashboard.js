import React, { useEffect } from "react"
import { Link } from "gatsby"
import { toast } from 'react-toastify'
import { colors, widths } from "../../styles/variables"
import { daysUntilDate } from "../../utils/helper-functions"

import { Row, Col } from "react-grid-system"
import Toastify from "../ui/Toastify"
import Layout from "../layout/Layout"
import Content from "../ui/Content"
import AuthLayout from "./components/AuthLayout"
import sendEmailVerification from "../../functions/sendEmailVerification"
import Button from "../ui/Button"
import Notification from "../ui/Notification"

const UserDashboard = () => {
  const launchDate = new Date("2023-11-01")

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
        <Row>
          <Col md={6}>
            <Content
              h1fontsize="2rem"
              margin="32px 0"
              linktextdecoration="underline"
              maxwidth={widths.content.normal}
            >
              <h1>Start by creating a custom book</h1>
              <p>
                Click on the "Books" tab above to get started. When you create a book you will be able to give it a name, after which it will appear in your Books table. Double-click on any book in the table to open it in the editor.
              </p>
              <p>If you have any questions or suggestions, feel free to <a href="mailto:general@notesmithbooks.com">send us an email</a>.</p>
            </Content>
            <Notification
              backgroundcolor={colors.yellow.twoHundred}
              color={colors.yellow.nineHundred}
              display="inline-flex"
              margin="0"
            >
              <p>There are currently <b>{daysUntilDate(launchDate)} days</b> left until pre-orders will close.</p>
            </Notification>
          </Col>
          <Col md={6}>
            <Content
              h2fontsize="2rem"
              margin="32px 0"
            >
              <h2>Exclusive referrals</h2>
              <p>Only you </p>
            </Content>
          </Col>
        </Row>
      </AuthLayout>
      <Toastify />
    </Layout>
  )
}

export default UserDashboard
