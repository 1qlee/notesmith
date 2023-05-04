import React from "react"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../utils/auth"

import { SectionMain, Section } from "../components/layout/Section"
import SignupForm from "../components/form/SignupForm"
import Layout from "../components/layout/Layout"
import Loader from "../components/misc/Loader"
import Nav from "../components/layout/Nav"

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
    <Layout className="is-full-height">
      <Nav />
      <SectionMain
        className="has-max-height"
      >
        <Section>
          <SignupForm />
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default SignUp
