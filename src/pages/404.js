import React from "react"

import Seo from "../components/layout/Seo"
import Layout from "../components/layout/Layout"
import Content from "../components/ui/Content"
import { Section, SectionMain, SectionContent } from "../components/layout/Section"

const NotFoundPage = () => {
  return (
    <Layout>
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

export const Head = () => (
  <Seo title="Page not found" />
)