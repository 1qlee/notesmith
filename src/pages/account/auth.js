import React, { useEffect, useState } from "react"
import { useFirebaseContext } from "../../utils/auth"
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth"
import sendEmailTemplate from "../../functions/sendEmailTemplate"

import { Link } from "gatsby"
import { AuthFormWrapper } from "../../components/form/FormComponents"
import { Section, SectionMain } from "../../components/layout/Section"
import ResetPwForm from "../../components/form/ResetPwForm"
import Content from "../../components/ui/Content"
import Layout from "../../components/layout/Layout"
import addEmailToLists from "../../functions/addEmailToLists"

function Auth({ location }) {
  const { firebaseAuth, user } = useFirebaseContext()
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
    setLoading(true)

    if (firebaseAuth) {
      switch (mode) {
        case 'resetPassword':
          verifyPasswordResetCode(firebaseAuth, actionCode)
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
        case 'verifyEmail':
          applyActionCode(firebaseAuth, actionCode).then(async () => {
            await sendEmailTemplate({
              to: user.email,
              templateId: "d-9ef563c7ed1147858ebfb788d30f5b2f",
            })
            await addEmailToLists(user.email, ["d3e320ae-078e-40bd-b3e1-8e53ab6af71b"])
            setAuthModeVerified(true)
            setAuthMode(mode)
            setLoading(false)
          }).catch(error => {
            console.log("🚀 ~ applyActionCode ~ error:", error)

            setAuthModeVerified(false)
            setAuthMode(mode)
            setLoading(false)
          })
          break;
        default:
          setAuthMode(null)
      }
    }
  }, [location, mode, actionCode, firebaseAuth])

  async function handleResetPassword(e, actionCode, password) {
    e.preventDefault()
    setProcessing(true)

    verifyPasswordResetCode(firebaseAuth, actionCode).then(email => {
      confirmPasswordReset(firebaseAuth, actionCode, password).then(() => {
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

  return (
    <Layout
      loading={loading}
      seoDetails={{
        title: authMode === "resetPassword" ? "Reset your password" : "Verify your email",
      }}
    >
      <SectionMain
        className="has-max-height"
      >
        <Section>
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
                      <p>Either the credentials in your link have expired, or your account is already verified. Please try refreshing the page or <Link to="/signin">try signing in again</Link>.</p>
                    </>
                  )}
                </Content>
              )}
            </AuthFormWrapper>
          )}
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Auth