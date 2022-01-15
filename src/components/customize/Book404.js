import React from "react"

import Layout from "../layout/Layout"
import Seo from "../layout/Seo"
import Nav from "../layout/Nav"
import Content from "../Content"
import { Container, LayoutContainer } from "../layout/Container"
import { SectionMain, Section, SectionContent } from "../layout/Section"

const Book404 = () => {
  return (
    <Layout>
      <Seo title="Book not found" />
      <Nav />
      <SectionMain>
        <Section>
         <Container>
          <LayoutContainer>
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
          </LayoutContainer>
         </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Book404
