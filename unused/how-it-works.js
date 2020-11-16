import React from "react"
import { graphql } from "gatsby"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { StepProvider } from "../context/StepContext"

import { Section, SectionContent, SectionHeader, BookPageTextComponent, TrayItemContent } from "../components/Section"
import { Container, ContainerBook } from "../components/Container"
import Layout from "../components/layout"
import Step from "../components/Step"
import Nav from "../components/Nav"
import SEO from "../components/seo"

const HowItWorksPage = ({ data }) => (
  <Layout>
    <SEO title="How It Works" />
    <Container>
      <Nav chapterNumber={data.contentfulChapter.chapterNumber} chapterName={data.contentfulChapter.chapterName}></Nav>
      <StepProvider>
        <Section>
          <SectionContent className="is-text">
            <SectionHeader>
              <p>{data.contentfulChapter.chapterNumber}. {data.contentfulChapter.chapterName}</p>
            </SectionHeader>
            <h1>{data.contentfulChapter.title}</h1>
            <div>
              {documentToReactComponents(data.contentfulChapter.bodyText.json)}
            </div>
            <Step chapterContent={data.allContentfulChapterContent} />
          </SectionContent>
          <SectionContent>
            <h1>Hi</h1>
          </SectionContent>
        </Section>
      </StepProvider>
    </Container>
  </Layout>
)

export const query = graphql`
  query howItWorksQuery {
    contentfulChapter(chapterName: { eq: "How It Works" }) {
      title
      chapterNumber
      chapterName
      image {
        id
        description
      }
      bodyText {
        json
      }
    }
    allContentfulChapterContent(
      filter: {chapterName: {eq: "How It Works"}},
      sort: {fields: [trayNumber], order: ASC}
    ) {
      edges {
        node {
          title
          trayNumber
          chapterName
          icon
          bodyText {
            json
          }
        }
      }
    }
  }
`

export default HowItWorksPage
