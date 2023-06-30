import React from "react"
import { Link } from "gatsby"
import { toast } from 'react-toastify'
import { colors, widths } from "../../styles/variables"

import { Row, Col } from "react-grid-system"
import Toastify from "../ui/Toastify"
import Layout from "../layout/Layout"
import Content from "../ui/Content"
import AuthLayout from "./components/AuthLayout"
import sendEmailVerification from "../../functions/sendEmailVerification"
import { Flexbox } from "../layout/Flexbox"
import Button from "../ui/Button"
import Notification from "../ui/Notification"

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
        <Row>
          <Col md={6}>
            <Content
              h1fontsize="2rem"
              margin="32px 0"
              linktextdecoration="underline"
              maxwidth={widths.content.normal}
            >
              <h1>Welcome to the early access!</h1>
              <p>
                You have full access to the custom editor and can start designing your own books right away. When you create a book you will be able to give it a name, after which it will appear in your Books table. You may edit any book an unlimited number of times.
              </p>
              <p>
                Additionally, you can also create Templates to use in your books. Templates are reusable page designs that you can apply to any page in any book. This makes it faster to create books using your favorite layouts.
              </p>
              <Notification
                backgroundcolor={colors.gray.twoHundred}
              >
                Please note that during this time, we cannot provide an accurate estimate for shipping times. You will be updated as we get further along the production process.
              </Notification>
              <p>If you have any questions or suggestions, feel free to <a href="mailto:general@notesmithbooks.com">send us an email</a>.</p>
            </Content>
          </Col>
          <Col md={6}>
            <Content
              h2fontsize="2rem"
              margin="32px 0"
            >
              <h2>Referral Program</h2>
              <p>Use the link below to invite others to Notesmith!</p>
            </Content>
          </Col>
        </Row>
        <Row>
          <Col>
            <Flexbox>
              <Button
                as={Link}
                to="/account/books"
                padding="16px 32px"
                margin="0 16px 0 0"
              >
                Create a book
              </Button>
              <Button
                as={Link}
                to="/account/templates"
                padding="16px 32px"
              >
                Create a template
              </Button>
            </Flexbox>
          </Col>
        </Row>
      </AuthLayout>
      <Toastify />
    </Layout>
  )
}

export default UserDashboard
