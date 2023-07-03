import React from "react"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../utils/auth"

import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import SignupForm from "../components/form/SignupForm"
import Layout from "../components/layout/Layout"
import Loader from "../components/misc/Loader"

const SignUp = () => {
  const { user, loading } = useFirebaseContext()

  if (loading) {
    return <Loader />
  }
  if (user) {
    navigate(`/account/dashboard`, { replace: true })
    return null
  }

  return (
    <Layout 
      title="Sign up for an account"
      className="is-full-height"
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
