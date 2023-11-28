import React from "react"
import { spacing } from "../styles/variables"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../utils/auth"

import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import ForgotForm from "../components/form/ForgotForm"
import Layout from "../components/layout/Layout"
import Seo from "../components/layout/Seo"

const Forgot = () => {
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
        title: "Forgot your password?",
      }}
    >
      <SectionMain
        className="has-max-height"
      >
        <Section>
          <SectionContent
            padding={spacing.normal}
          >
            <ForgotForm />
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Forgot