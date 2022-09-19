import React, { useEffect } from "react"
import firebase from "gatsby-plugin-firebase"

import Nav from "../../components/layout/Nav"
import Layout from "../../components/layout/Layout"

function Auth({ location }) {
  const params = new URLSearchParams(location.search)
  const mode = params.get("mode")
  const actionCode = params.get("oobCode")
  const auth = firebase.auth()
  
  useEffect(() => {
    switch (mode) {
      case 'resetPassword':
        handleResetPassword(auth, actionCode)
        break;
      case 'recoverEmail':
        handleRecoverEmail(auth, actionCode)
        break;
      case 'verifyEmail':
        handleVerifyEmail(auth, actionCode)
        break;
      default:
    }
  })

  function handleResetPassword(auth, actionCode) {
    auth.verifyPasswordResetCode(actionCode).then(email => {
      
    })
  }

  function handleRecoverEmail() {

  }

  function handleVerifyEmail() {

  }

  return (
    <Layout>
      <Nav />
    </Layout>
  )
}

export default Auth