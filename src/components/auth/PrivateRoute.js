import React, { useState } from "react"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import sendEmailVerification from "../../functions/sendEmailVerification"

import { AuthFormWrapper } from "../form/FormComponents"
import { Section, SectionMain } from "../layout/Section"
import Layout from "../layout/Layout"
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
      <SectionMain
        className="has-max-height"
      >
        <Section>
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
                    <h1>Validate your email address</h1>
                    <p>Check your inbox or spam folder for an email with a verification link inside. If you can't find it, <a onClick={() => handleSendVerificationEmail()}>click here to resend the verification email</a>.</p>
                  </>
                )}
              </Content>
            )}
          </AuthFormWrapper>
        </Section>
      </SectionMain>
    )
  }

  return <Component {...rest} />
}

export default PrivateRoute
