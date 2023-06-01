import React from "react"
import { Link } from "gatsby"
import { toast } from 'react-toastify'
import { widths } from "../../styles/variables"
import { Article, Notebook } from "phosphor-react"
import { colors } from "../../styles/variables"

import { Row, Col } from "react-grid-system"
import Icon from "../ui/Icon"
import Toastify from "../ui/Toastify"
import Layout from "../layout/Layout"
import Content from "../ui/Content"
import AuthLayout from "./components/AuthLayout"
import sendEmailVerification from "../../functions/sendEmailVerification"
import Box from "../ui/Box"
import { Flexbox } from "../layout/Flexbox"

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
              <h1>Start creating custom books and templates.</h1>
              <p>
                You have full access to the custom editor and can start designing your own books right away. When you create a book you will be able to give it a name, after which it will appear in your Books table. You may edit any book an unlimited number of times.
              </p>
              <p>
                Additionally, you can also create Templates to use in your books. Templates are reusable page designs that you can apply to any page in any book. This makes it faster to create books using your favorite pages.
              </p>
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
          <Col md={3} sm={6}>
            <Link
              to="/account/books"
            >
              <Box
                className="has-border is-clickable"
                padding="16px"
                borderradius="8px"
              >
                <Flexbox
                  alignitems="center"
                >
                  <Icon
                    margin="0 8px 0 0"
                  >
                    <Notebook size={24} weight="duotone" color={colors.gray.nineHundred} />
                  </Icon>
                  <Content
                    h5margin="0"
                    h5fontweight="700"
                  >
                    <h5>Create a book</h5>
                  </Content>
                </Flexbox>
              </Box>
            </Link>
          </Col>
          <Col md={3} sm={6}>
            <Link
              to="/account/books"
            >
              <Box
                className="has-border is-clickable"
                padding="16px"
                borderradius="8px"
              >
                <Flexbox
                  alignitems="center"
                >
                  <Icon
                    margin="0 8px 0 0"
                  >
                    <Article size={24} weight="duotone" color={colors.gray.nineHundred} />
                  </Icon>
                  <Content
                    h5margin="0"
                    h5fontweight="700"
                  >
                    <h5>Create a template</h5>
                  </Content>
                </Flexbox>
              </Box>
            </Link>
          </Col>
        </Row>
      </AuthLayout>
      <Toastify />
    </Layout>
  )
}

export default UserDashboard
