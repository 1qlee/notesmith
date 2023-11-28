import React from "react"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../utils/auth"

import { SectionMain, Section } from "../components/layout/Section"
import SigninForm from "../components/form/SigninForm"
import Layout from "../components/layout/Layout"
import Seo from "../components/layout/Seo"

const Signin = () => {
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
        title: "Sign in to Notesmith",
      }}
    >
      <SectionMain
        className="has-max-height"
      >
        <Section>
          <SigninForm />
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Signin