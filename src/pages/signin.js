import React from "react"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../utils/auth"

import { SectionMain, Section } from "../components/layout/Section"
import SigninForm from "../components/form/SigninForm"
import Layout from "../components/layout/Layout"
import Loader from "../components/misc/Loader"

const Signin = () => {
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
      title="Sign into your account"
      className="is-full-height"
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
