import React from "react"
import { graphql } from "gatsby"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { TrayProvider } from "../context/TrayContext"
import colors from "../styles/colors"

import { Section, SectionContent, SectionHeader, BookPageTextComponent, TrayItemContent } from "../components/Section"
import { Container, ContainerBook } from "../components/Container"
import Handwriting from "../components/Handwriting"
import Layout from "../components/layout"
import Nav from "../components/Nav"
import SEO from "../components/seo"
import TableOfContents from "../components/TableOfContents"
import Tray from "../components/Tray"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Our Notebooks" />
    <Container>
      <TableOfContents chapterNumber={data.contentfulChapter.chapterNumber} chapterName={data.contentfulChapter.chapterName} />
      <Nav chapterNumber={data.contentfulChapter.chapterNumber} chapterName={data.contentfulChapter.chapterName}></Nav>
      <TrayProvider>
        <Section>
          <SectionContent className="is-text">
            <SectionHeader>
              <p>{data.contentfulChapter.chapterNumber}. {data.contentfulChapter.chapterName}</p>
            </SectionHeader>
            <h1>{data.contentfulChapter.title}</h1>
            <BookPageTextComponent chapterContent={data.allContentfulChapterContent} />
            <Tray chapterContent={data.allContentfulChapterContent} />
            <Handwriting color={colors.primary.threeHundred} up={true}>Click on a topic to learn more!</Handwriting>
          </SectionContent>
          <TrayItemContent chapterContent={data.allContentfulChapterContent} />
        </Section>
      </TrayProvider>
    </Container>
  </Layout>
)

export const query = graphql`
  query ourNotebooksQuery {
    contentfulChapter(chapterName: { eq: "Our Notebooks" }) {
      title
      chapterNumber
      chapterName
      tray {
        trayItems {
          title
          description
        }
      }
      image {
        id
        description
      }
      bodyText {
        json
      }
    }
    allContentfulChapterContent(
      filter: {chapterName: {eq: "Our Notebooks"}},
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
          image {
            description
            fixed(width: 400) {
              ...GatsbyContentfulFixed
            }
          }
        }
      }
    }
  }
`

export default IndexPage
