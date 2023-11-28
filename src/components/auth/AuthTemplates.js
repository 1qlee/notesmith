import React from "react"

import Layout from "../layout/Layout"
import AuthLayout from "./components/AuthLayout"

const AuthTemplates = () => {
  return (
    <Layout
      seoDetails={{
        title: "Templates",
      }}
    >
      <AuthLayout page="Templates">

      </AuthLayout>
    </Layout>
  )
}

export default AuthTemplates