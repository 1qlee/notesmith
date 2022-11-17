import React, { useEffect, useState } from "react"
import firebase from "gatsby-plugin-firebase"
import { spacing } from "../../styles/variables"

import { AuthFormWrapper } from "../../components/form/FormComponents"
import { Container, LayoutContainer } from "../../components/layout/Container"
import { Section, SectionMain, SectionContent } from "../../components/layout/Section"
import ResetPwForm from "../../components/form/ResetPwForm"
import Content from "../../components/ui/Content"
import Layout from "../../components/layout/Layout"
import Nav from "../../components/layout/Nav"
import Loader from "../../components/misc/Loader"
import { Link } from "gatsby"

function Auth({ location }) {
  const auth = firebase.auth()
  const params = new URLSearchParams(location.search)
  const mode = params.get("mode")
  const actionCode = params.get("oobCode")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [authMode, setAuthMode] = useState(null)
  const [authModeVerified, setAuthModeVerified] = useState(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    verifyActionCode(mode, actionCode)
  }, [location])

  async function handleResetPassword(e, actionCode, password) {
    e.preventDefault()
    setProcessing(true)

    auth.verifyPasswordResetCode(actionCode).then(email => {
      auth.confirmPasswordReset(actionCode, password).then((res) => {
        setProcessing(false)
        setSuccess(true)
      })
      .catch(error => {
        throw error
      })
    }).catch(error => {
      setProcessing(false)
      if (error.message) {
        setError(error.message)
      }
      else {
        setError("Something went wrong. Please try refreshing the page.")
      }
    })
  }

  function handleRecoverEmail() {

  }

  function handleVerifyEmail() {

  }

  function verifyActionCode(mode, actionCode) {
    setLoading(true)

    switch (mode) {
      case 'resetPassword':
        auth.verifyPasswordResetCode(actionCode)
        .then(() => {
          setAuthModeVerified(true)
          setAuthMode(mode)
          setLoading(false)
        })
        .catch(() => {
          setAuthModeVerified(false)
          setAuthMode(mode)
          setLoading(false)
        })
        break;
      case 'recoverEmail':
        handleRecoverEmail(mode, actionCode)
        break;
      case 'verifyEmail':
        auth.applyActionCode(actionCode).then(res => {
          setAuthModeVerified(true)
          setAuthMode(mode)
          setLoading(false)
        })
        .catch(error => {
          console.log(error)
          setAuthModeVerified(false)
          setAuthMode(mode)
          setLoading(false)
        })
        break;
      default:
        setAuthMode(null)
    }
  }

  return (
    <Layout>
      <Nav />
      {loading ? (
        <Loader className="has-nav" />
      ) : (
        <SectionMain
          className="has-max-height"
        >
          <Section>
            <Container>
              <LayoutContainer>
                <SectionContent
                  padding={spacing.normal}
                >
                  {success ? (
                    <AuthFormWrapper>
                      <Content
                        h1fontsize="2rem"
                        margin="0 0 32px"
                        linktextdecoration="underline"
                      >
                        <h1>Succesfully changed</h1>
                        <p>You may <Link to="/signin">sign in</Link> now with your new password.</p>
                      </Content>
                    </AuthFormWrapper>
                  ) : (
                    <AuthFormWrapper>
                      {authModeVerified ? (
                        <>
                          <Content
                            h1fontsize="2rem"
                            margin="0 0 32px"
                            linktextdecoration="underline"
                          >
                            {authMode === "resetPassword" && (
                              <h1>Reset your password</h1>
                            )}
                            {authMode === "verifyEmail" && (
                              <>
                                <h1>Your email is now verified</h1>
                                <p>You may now <Link to="/account/dashboard">access your account</Link> or <Link to="/signin">sign in</Link>.</p>
                              </>
                            )}
                            {error && (
                              <p>{error}</p>
                            )}
                          </Content>
                          {authMode === "resetPassword" && (
                            <ResetPwForm
                              processing={processing}
                              actionCode={actionCode}
                              handleSubmit={handleResetPassword}
                            />
                          )}
                        </>
                      ) : (
                        <Content
                          h1fontsize="2rem"
                          linktextdecoration="underline"
                        >
                          {authMode === "resetPassword" && (
                            <>
                              <h1>Code expired</h1>
                              <p>You can request another email to reset your password by <Link to="/forgot">clicking here</Link>.</p>
                            </>
                          )}
                          {authMode === "verifyEmail" && (
                            <>
                              <h1>Something went wrong</h1>
                              <p>Either the credentials in your link have expired, or your account is already verified. Please try refreshing the page or you can request another email to verify your email by <Link to="/account/dashboard">clicking here</Link>.</p>
                            </>
                          )}
                        </Content>
                      )}
                    </AuthFormWrapper>
                  )}
                </SectionContent>
              </LayoutContainer>
            </Container>
          </Section>
        </SectionMain>
      )}
    </Layout>
  )
}

export default Auth