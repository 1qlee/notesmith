import React from "react"
import { spacing } from "../styles/variables"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../utils/auth"

import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import ForgotForm from "../components/form/ForgotForm"
import Layout from "../components/layout/Layout"
import Loader from "../components/misc/Loader"
import Seo from "../components/layout/Seo"

const Forgot = () => {
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
      className="is-full-height"
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

export const Head = () => (
  <Seo title="Recover your password" />
)