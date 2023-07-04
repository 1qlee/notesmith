import React from "react"

import Layout from "../layout/Layout"
import Seo from "../layout/Seo"
import Nav from "../layout/Nav"
import Content from "../ui/Content"
import { SectionMain, Section, SectionContent } from "../layout/Section"

const Book404 = () => {
  return (
    <Layout>
      <Seo title="Book not found" />
      <Nav />
      <SectionMain>
        <Section>
            <SectionContent>
              <Content
                headingtextalign="center"
                paragraphtextalign="center"
              >
                <h1>Hmm... </h1>
                <h2>We couldn't find that book for you.</h2>
                <p>Something might have gone wrong on our end or you might have entered an incorrect link.</p>
              </Content>
            </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Book404
