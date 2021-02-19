import React, { useState } from "react"
import { colors, spacing, widths } from "../styles/variables"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { graphql, Link } from "gatsby"
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import Img from "gatsby-image"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import Button from "../components/Button"
import Content from "../components/Content"
import Icon from "../components/Icon"
import Layout from "../components/layout/Layout"
import List from "../components/List"
import Nav from "../components/layout/Nav"
import PageCarousel from "../components/PageCarousel"
import SEO from "../components/layout/Seo"
import Tag from "../components/Tag"
import RegisterForm from "../components/form/RegisterForm"
import { BookOpen, Book, FileText, SquareHalf, Scissors, Notebook, NoteBlank, ShieldCheck } from "phosphor-react"

const chapterData = {
  chapterOne: {
    title: "Custom notebooks made by you",
    chapter: "01"
  },
  chapterTwo: {
    title: "Fully custom pages for your unique needs",
    chapter: "02",
    heading: "Create your own pages"
  },
  chapterThree: {
    title: "Simple, clean design and functional materials",
    chapter: "03",
    heading: "Introduction to our notebooks"
  },
  chapterFour: {
    title: "Beauty and the sheets",
    chapter: "04",
    heading: "Photo gallery"
  }
}

const listData = [
  {
    icon: <BookOpen weight="duotone" size="1.75rem" color={colors.primary.sixHundred} />,
    text: "Customize each page individually"
  },
  {
    icon: <FileText weight="duotone" size="1.75rem" color={colors.primary.sixHundred} />,
    text: "Lines, dots, squiggles - anything!"
  }
]

const featureData = [
  {
    icon: <SquareHalf weight="duotone" size="1.75rem" color={colors.green.sixHundred} />,
    color: colors.green.sixHundred,
    title: "90gsm white, super-fine paper",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The quick brown fox jumped over the lazy dog."
  },
  {
    icon: <Book weight="duotone" size="1.75rem" color={colors.red.sixHundred} />,
    color: colors.red.sixHundred,
    title: "100lb covers in 5 colors",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The quick brown fox jumped over the lazy dog."
  },
  {
    icon: <Scissors weight="duotone" size="1.75rem" color={colors.blue.sixHundred} />,
    color: colors.blue.sixHundred,
    title: "Saddle-stiched binding",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The quick brown fox jumped over the lazy dog."
  },
  {
    icon: <NoteBlank weight="duotone" size="1.75rem" color={colors.purple.sixHundred} />,
    color: colors.purple.sixHundred,
    title: "48 total pages",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The quick brown fox jumped over the lazy dog."
  }
]

const IndexPage = ({ data }) => {
  const [ hideNavbar, setHideNavbar ] = useState(false)
  const [ chapterOnePosition, setchapterOnePosition ] = useState()
  const [ chapterTwoPosition, setchapterTwoPosition ] = useState()
  const [ chapterThreePosition, setchapterThreePosition ] = useState()
  const [ chapterFourPosition, setchapterFourPosition ] = useState()
  const [ currentChapterTitle, setCurrentChapterTitle ] = useState(chapterData.chapterOne.title)
  const [ currentChapterNumber, setCurrentChapterNumber ] = useState(chapterData.chapterOne.chapter)

  const setPosition = (element, section) => {
    // element is passed from each section's ref and section is just a corresponding number value
    if (element) {
      switch(section) {
        case 1:
          return setchapterOnePosition(element.offsetHeight)
        case 2:
          return setchapterTwoPosition(element.offsetTop)
        case 3:
          return setchapterThreePosition(element.offsetTop)
        case 4:
          return setchapterFourPosition(element.offsetTop)
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
    if (chapterOnePosition / 1.2 > -currPos.y) {
      setCurrentChapterTitle(chapterData.chapterOne.title)
      setCurrentChapterNumber(chapterData.chapterOne.chapter)
    }
    if (chapterOnePosition / 1.2 < -currPos.y && -currPos.y > chapterTwoPosition / 1.5) {
      setCurrentChapterTitle(chapterData.chapterTwo.title)
      setCurrentChapterNumber(chapterData.chapterTwo.chapter)
    }
    if (chapterTwoPosition / 1.2 < -currPos.y && -currPos.y > chapterThreePosition / 1.5) {
      setCurrentChapterTitle(chapterData.chapterThree.title)
      setCurrentChapterNumber(chapterData.chapterThree.chapter)
    }
    if (chapterFourPosition / 1.2 < -currPos.y) {
      setCurrentChapterTitle(chapterData.chapterFour.title)
      setCurrentChapterNumber(chapterData.chapterFour.chapter)
    }

  }, [chapterOnePosition, chapterTwoPosition, chapterThreePosition, hideNavbar])

  return (
    <Layout>
      <SEO title="Truly Custom Notebooks For All People" />
      <Nav chapterNumber={currentChapterNumber} title={currentChapterTitle} hideNavbar={hideNavbar}></Nav>
      <SectionMain>
        <Section>
          <Container ref={element => setPosition(element, 1)}>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  columns="1fr"
                  columnGap={spacing.large}
                  justifyContent="center"
                >
                  <Content
                    headingTextAlign="center"
                    h1FontWeight="400"
                  >
                    <h1>Custom notebooks <b>made by you</b></h1>
                  </Content>
                  <Grid
                    flow="row"
                    rowGap={spacing.normal}
                    columns={0}
                    rows="auto"
                    justifyContent="center"
                  >
                    <Content
                      maxWidth={widths.content.index}
                      paragraphFontSize="1.25rem"
                    >
                      <p>Create a custom-made notebook that's perfect for you. Notesmith allows you to fully customize the layout of each page.</p>
                      <Link to="/shop">
                        <Button
                          backgroundColor={colors.yellow.threeHundred}
                          padding="1rem"
                          borderRadius="0.25rem"
                        >
                          Buy now
                        </Button>
                      </Link>
                    </Content>
                  </Grid>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container ref={element => setPosition(element, 2)}>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  columns="2fr 1fr"
                  columnGap={spacing.large}
                  justifyContent="center"
                  alignContent="center"
                >
                  <Cell>
                    <Container maxWidth="505px" className="is-aligned-left">
                      <PageCarousel profileImages={data.chapterTwo.contentImages} />
                    </Container>
                  </Cell>
                  <Cell middle>
                    <Content h3Color={colors.link.normal} h3FontWeight="400">
                      <h3 fontWeight="400">{chapterData.chapterTwo.heading}</h3>
                      <h2>{chapterData.chapterTwo.title}</h2>
                      <p>Go beyond conventional grids and layouts to create a notebook that is unique to your needs. Every page is customizable. You imagine it, and we'll print it!</p>
                    </Content>
                    <List list={listData} />
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container ref={element => setPosition(element, 3)}>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  flow="row"
                  rowGap={spacing.normal}
                  columns={0}
                  rows="auto"
                  alignContent="baseline"
                >
                  <Cell>
                    <Content h4Color={colors.link.normal} h4FontWeight="400">
                      <h4>{chapterData.chapterThree.heading}</h4>
                      <h2>{chapterData.chapterThree.title}</h2>
                      <p>We make every custom notebook with the same high quality materials from cover to cover.</p>
                    </Content>
                  </Cell>
                  <Grid
                    columns="repeat(auto-fit, minmax(120px, 1fr))"
                    columnGap={spacing.large}
                  >
                    {featureData.map(feature => (
                      <Cell key={feature.title}>
                        <Content headingColor={feature.color}>
                          <Icon>
                            {feature.icon}
                          </Icon>
                          <h4 className={`is-column-heading`}>{feature.title}</h4>
                          <p>{feature.description}</p>
                        </Content>
                      </Cell>
                    ))}
                  </Grid>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container ref={element => setPosition(element, 4)}>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  flow="row"
                  rowGap={spacing.normal}
                  columns={0}
                  rows="auto"
                  alignContent="baseline"
                >
                  <Cell>
                    <Content h4Color={colors.link.normal} h4FontWeight="400">
                      <h4>{chapterData.chapterFour.heading}</h4>
                      <h2>{chapterData.chapterFour.title}</h2>
                    </Content>
                  </Cell>
                  <Grid
                    columns="2fr 1fr 1fr"
                    rows="1fr 1fr"
                    columnGap="0"
                    rowGap="0"
                  >
                    {data.chapterFour.contentImages.map((image, index) => (
                      <Img key={index} fluid={image.fluid} />
                    ))}
                  </Grid>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export const query = graphql`
  query indexQuery {
    chapterOne: contentfulChapter(chapterNumber: { eq: "01" }) {
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
      }
    }
    chapterTwo: contentfulChapter(chapterNumber: { eq: "02" }) {
      contentImages {
        fluid {
          ...GatsbyContentfulFluid
        }
      }
    }
    chapterThree: contentfulChapter(chapterNumber: { eq: "03" }) {
      contentImages {
        fluid {
          ...GatsbyContentfulFluid
        }
      }
    }
    chapterFour: contentfulChapter(chapterNumber: { eq: "04" }) {
      contentImages {
        fluid {
          ...GatsbyContentfulFluid
        }
      }
    }
  }
`

export default IndexPage
