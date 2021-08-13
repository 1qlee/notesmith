import React from "react"
import { Link } from "gatsby"
import Layout from "../layout/Layout"
import { useFirebaseContext } from "../../utils/auth"
import { colors } from "../../styles/variables"

import { SectionMain, SectionApp, SectionAppContent } from "../layout/Section"
import Content from "../Content"
import SEO from "../layout/Seo"
import Sidebar from "../ui/Sidebar"

const Dashboard = () => {
  const { signOut, user, sendEmailVerification } = useFirebaseContext()

  function handleSignOut() {
    signOut().then(() => {
      console.log("Signing out...")
    }).catch(error => {
      console.log(error.code, error.msg)
    })
  }

  return (
    <Layout>
      <SEO title="Dashboard" />
        <SectionMain className="has-no-padding has-max-height">
          <SectionApp>
            <Sidebar />
            <SectionAppContent>
              <a onClick={handleSignOut}>Sign Out</a>
              {!user.emailVerified && (
                <Content linkcolor={colors.link.normal}>
                  <p>Verify your email.</p>
                  <p>We sent a verification link to {user.email}. If you didn't receive it, <a onClick={sendEmailVerification}>resend the email</a> or <Link to="/app/settings">update your email</Link> to verify with a different email.
                  </p>
                </Content>
              )}
              <p>{JSON.stringify(user, 2)}</p>
            </SectionAppContent>
          </SectionApp>
        </SectionMain>
    </Layout>
  )
}

export default Dashboard
