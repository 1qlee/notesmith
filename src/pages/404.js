import React from "react"

import Layout from "../components/layout/Layout"
import Content from "../components/ui/Content"
import { Section, SectionMain, SectionContent } from "../components/layout/Section"

const NotFoundPage = () => {
  return (
    <Layout title="Page not found">
      <SectionMain
        className="has-max-height"
      >
        <Section>
          <SectionContent>
            <Content headingtextalign="center">
              <h1>Page not found</h1>
            </Content>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default NotFoundPage
