import React, { useState } from "react"
import { colors, spacing } from "../styles/variables"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { graphql } from "gatsby"
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import Img from "gatsby-image"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionLayout } from "../components/layout/Section"
import Content from "../components/Content"
import Icon from "../components/Icon"
import Layout from "../components/layout/Layout"
import List from "../components/List"
import Nav from "../components/layout/Nav"
import PageCarousel from "../components/PageCarousel"
import SEO from "../components/layout/Seo"
import RegisterForm from "../components/form/RegisterForm"

const IndexPage = ({ data }) => {
  const [ hideNavbar, setHideNavbar ] = useState(false)
  const [ elementPosition, setElementPosition ] = useState({ x: 20, y: 150})
  const [ sectionOnePosition, setSectionOnePosition ] = useState()
  const [ sectionTwoPosition, setSectionTwoPosition ] = useState()
  const [ sectionThreePosition, setSectionThreePosition ] = useState()
  const [ sectionFourPosition, setSectionFourPosition ] = useState()
  const [ currentChapterTitle, setCurrentChapterTitle ] = useState(data.sectionOne.title)
  const [ currentChapterNumber, setCurrentChapterNumber ] = useState(data.sectionOne.chapterNumber)

  const setPosition = (element, section) => {
    // element is passed from each section's ref and section is just a corresponding number value
    if (element) {
      switch(section) {
        case 1:
          return setSectionOnePosition(element.offsetHeight)
        case 2:
          return setSectionTwoPosition(element.offsetTop)
        case 3:
          return setSectionThreePosition(element.offsetTop)
        case 4:
          return setSectionFourPosition(element.offsetTop)
        default:
          return 0
      }
    }
  }

  useScrollPosition(({ prevPos, currPos }) => {
    const isHidden = currPos.y < prevPos.y

    if (isHidden !== hideNavbar) {
      setHideNavbar(isHidden)
    }
    if (sectionOnePosition / 1.2 > -currPos.y) {
      setCurrentChapterTitle(data.sectionOne.title)
      setCurrentChapterNumber(data.sectionOne.chapterNumber)
    }
    if (sectionOnePosition / 1.2 < -currPos.y && -currPos.y > sectionTwoPosition / 1.5) {
      setCurrentChapterTitle(data.sectionTwo.title)
      setCurrentChapterNumber(data.sectionTwo.chapterNumber)
    }
    if (sectionTwoPosition / 1.2 < -currPos.y && -currPos.y > sectionThreePosition / 1.5) {
      setCurrentChapterTitle(data.sectionThree.title)
      setCurrentChapterNumber(data.sectionThree.chapterNumber)
    }
    if (sectionFourPosition / 1.2 < -currPos.y) {
      setCurrentChapterTitle(data.sectionFour.title)
      setCurrentChapterNumber(data.sectionFour.chapterNumber)
    }

    setElementPosition(currPos)

  }, [sectionOnePosition, sectionTwoPosition, sectionThreePosition, hideNavbar])

  return (
    <Layout>
      <SEO title="Truly Custom Notebooks For All People" />
      <Nav chapterNumber={currentChapterNumber} title={currentChapterTitle} hideNavbar={hideNavbar}></Nav>
      <SectionMain>
        <Section>
          <Container ref={element => setPosition(element, 1)}>
            <LayoutContainer>
              <SectionLayout>
                <Grid
                  columns="1fr 2fr"
                  columnGap={spacing.large}
                >
                  <Grid
                    flow="row"
                    rowGap={spacing.normal}
                    columns={0}
                    rows="auto"
                    alignContent="baseline"
                  >
                    <Content>
                      <h1>{data.sectionOne.title}</h1>
                      {documentToReactComponents(data.sectionOne.bodyText.json)}
                    </Content>
                    <Content>
                      <RegisterForm />
                      <small>Notesmith is currently in a closed beta. Sign up to stay up-to-date.</small>
                    </Content>
                  </Grid>
                  <Cell>
                    <Img fluid={data.sectionOne.image.fluid} />
                  </Cell>
                </Grid>
              </SectionLayout>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container ref={element => setPosition(element, 2)}>
            <LayoutContainer>
              <SectionLayout>
                <Grid
                  columns="2fr 1fr"
                  columnGap={spacing.large}
                  justifyContent="center"
                  alignContent="center"
                  >
                  <Cell>
                    <Container maxWidth="505px" className="is-aligned-left">
                      <PageCarousel profiles={data.sectionTwo.data.profiles} profileImages={data.sectionTwo.contentImages} />
                    </Container>
                  </Cell>
                  <Cell middle>
                    <Content h4Color={colors.primary.link}>
                      <h4>{data.sectionTwo.title}</h4>
                      <h2>{data.sectionTwo.chapterName}</h2>
                      {documentToReactComponents(data.sectionTwo.bodyText.json)}
                      <List list={data.sectionTwo.data.checklist} />
                    </Content>
                  </Cell>
                </Grid>
              </SectionLayout>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container ref={element => setPosition(element, 3)}>
            <LayoutContainer>
              <SectionLayout>
                <Grid
                  flow="row"
                  rowGap={spacing.normal}
                  columns={0}
                  rows="auto"
                  alignContent="baseline"
                >
                  <Cell>
                    <Content h4Color={colors.primary.link}>
                      <h4>{data.sectionThree.title}</h4>
                      <h2>{data.sectionThree.chapterName}</h2>
                      {documentToReactComponents(data.sectionThree.bodyText.json)}
                    </Content>
                  </Cell>
                  <Grid
                    columns="repeat(auto-fit, minmax(120px, 1fr))"
                    columnGap={spacing.large}
                  >
                    {data.sectionThree.data.features.map(feature => (
                      <Cell>
                        <Content>
                          <Icon icon={feature.icon} weight="duotone" size="1.75rem" color={colors.primary.sixHundred} />
                          <h4 className={`is-column-heading ${feature.color}`}>{feature.title}</h4>
                          <p>{feature.description}</p>
                        </Content>
                      </Cell>
                    ))}
                  </Grid>
                </Grid>
              </SectionLayout>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container ref={element => setPosition(element, 4)}>
            <LayoutContainer>
              <SectionLayout>
                <Grid
                  flow="row"
                  rowGap={spacing.normal}
                  columns={0}
                  rows="auto"
                  alignContent="baseline"
                >
                  <Cell>
                    <Content h4Color={colors.primary.link}>
                      <h4>{data.sectionFour.title}</h4>
                      <h2>{data.sectionFour.chapterName}</h2>
                      {documentToReactComponents(data.sectionFour.bodyText.json)}
                    </Content>
                  </Cell>
                  <Grid
                    columns="2fr 1fr 1fr"
                    rows="1fr 1fr"
                    columnGap="0"
                    rowGap="0"
                  >
                    {data.sectionFour.contentImages.map(image => (
                      <Img fluid={image.fluid} />
                    ))}
                  </Grid>
                </Grid>
              </SectionLayout>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export const query = graphql`
  query indexQuery {
    sectionOne: contentfulChapter(chapterNumber: { eq: "01" }) {
      title
      chapterNumber
      chapterName
      image {
        id
        description
        title
        fixed(width: 1200) {
          ...GatsbyContentfulFixed
        }
        fluid {
          ...GatsbyContentfulFluid
        }
        file {
          url
        }
      }
      bodyText {
        json
      }
    }
    sectionTwo: contentfulChapter(chapterNumber: { eq: "02" }) {
      title
      chapterName
      chapterNumber
      bodyText {
        json
      }
      contentImages {
        fluid {
          ...GatsbyContentfulFluid
        }
      }
      data {
        profiles {
          name
          type
          list
        }
        checklist {
          icon
          text
        }
      }
    }
    sectionThree: contentfulChapter(chapterNumber: { eq: "03" }) {
      title
      chapterName
      chapterNumber
      bodyText {
        json
      }
      data {
        features {
          title
          description
          icon
          color
        }
      }
      contentImages {
        fluid {
          ...GatsbyContentfulFluid
        }
      }
    }
    sectionFour: contentfulChapter(chapterNumber: { eq: "04" }) {
      title
      chapterName
      chapterNumber
      bodyText {
        json
      }
      contentImages {
        fluid {
          ...GatsbyContentfulFluid
        }
      }
    }
  }
`

export default IndexPage
