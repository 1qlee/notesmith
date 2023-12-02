import React from "react"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../utils/auth"

import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import SignupForm from "../components/form/SignupForm"
import Layout from "../components/layout/Layout"

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
      seoDetails={{
        title: "Sign up for Notesmith",
      }}
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
