import React from "react"

import Layout from "../components/layout/Layout"
import Seo from "../components/layout/Seo"

const NotFoundPage = () => (
  <Layout>
    <Seo title="Page Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
)

export default NotFoundPage
