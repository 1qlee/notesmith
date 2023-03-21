import React, { useState } from "react"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { spacing } from "../../styles/variables"
import sendEmailVerification from "../../functions/sendEmailVerification"

import { AuthFormWrapper } from "../form/FormComponents"
import { Container, LayoutContainer } from "../layout/Container"
import { Section, SectionMain, SectionContent } from "../layout/Section"
import Layout from "../layout/Layout"
import Nav from "../layout/Nav"
import Content from "../ui/Content"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const isBrowser = typeof window !== "undefined"
  const { user, loading } = useFirebaseContext()
  const [processing, setProcessing] = useState(false)
  const [verification, setVerification] = useState({
    success: null,
    msg: "",
  })

  async function handleSendVerificationEmail() {
    setProcessing(true)

    const emailFailed = await sendEmailVerification(user.email)

    if (emailFailed) {
      setVerification({
        success: false,
        msg: emailFailed,
      })
      setProcessing(false)
    }
    else {
      setVerification({
        success: true,
        msg: "Please check your email inbox or spam folder.",
      })
      setProcessing(false)
    }
  }

  if (loading) {
    return null
  }
  if (isBrowser && !user) {
    // If we’re not logged in, redirect to the login page.
    return navigate(`/signin`, { replace: true })
  }
  if (user && !user.emailVerified) {
    return (
      <Layout>
        <Nav />
        <SectionMain
          className="has-max-height"
        >
          <Section>
            <Container>
              <LayoutContainer>
                <SectionContent
                  padding={spacing.normal}
                >
                  <AuthFormWrapper>
                    {verification.success ? (
                      <Content
                        h1fontsize="2rem"
                        linktextdecoration="underline"
                      >
                        <h1>Email was successfully sent</h1>
                        <p>{verification.msg}</p>
                      </Content>
                    ) : (
                      <Content
                        h1fontsize="2rem"
                        linktextdecoration="underline"
                      >
                        {processing ? (
                          <>
                            <h1>Sending email...</h1>
                            <p>Please do not refresh this page.</p>
                          </>
                        ) : (
                          <>
                            <h1>Your email has not been verified yet</h1>
                            <p>Check your inbox or spam folder for an email with a verification link inside. If you can't find it, please <a onClick={() => handleSendVerificationEmail()}>click here to resend the verification email</a>.</p>
                          </>
                        )}
                      </Content>
                    )}
                  </AuthFormWrapper>
                </SectionContent>
              </LayoutContainer>
            </Container>
          </Section>
        </SectionMain>
      </Layout>
    )
  }

  return <Component {...rest} />
}

export default PrivateRoute
