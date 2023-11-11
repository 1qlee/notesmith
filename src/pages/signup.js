import React from "react"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../utils/auth"

import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import SignupForm from "../components/form/SignupForm"
import Layout from "../components/layout/Layout"
import Seo from "../components/layout/Seo"

const SignUp = () => {
  const { user, loading } = useFirebaseContext()

  if (user) {
    navigate(`/account/dashboard`, { replace: true })
    return null
  }

  return (
    <Layout 
      className="is-full-height"
      loading={loading}
    >
      <SectionMain
        className="has-max-height"
      >
        <Section>
          <SectionContent padding="0">
            <SignupForm />
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default SignUp

export const Head = () => (
  <Seo title="Sign up for an account" />
)