import React from "react"
import { spacing } from "../styles/variables"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../utils/auth"

import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import { Container, LayoutContainer } from "../components/layout/Container"
import SignupForm from "../components/form/SignupForm"
import Layout from "../components/layout/Layout"
import Loader from "../components/Loader"
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
          <Container>
            <LayoutContainer>
              <SectionContent
                padding={spacing.normal}
              >
                <SignupForm />
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default SignUp
