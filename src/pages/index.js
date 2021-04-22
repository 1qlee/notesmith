import React, { useState } from "react"
import { BookOpen, Book, FileText, SquareHalf, Scissors, NoteBlank, HandWaving } from "phosphor-react"
import { colors, spacing, widths } from "../styles/variables"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import Test from "../assets/index-test.svg"
import Test2 from "../assets/index-test-2.svg"
import Highlight from "../assets/highlight.svg"

import { Card, CardWrapper } from "../components/ui/Card"
import { Container, LayoutContainer } from "../components/layout/Container"
import { Flexbox } from "../components/layout/Flexbox"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import RegisterForm from "../components/form/RegisterForm"
import Button from "../components/Button"
import Content from "../components/Content"
import Icon from "../components/Icon"
import Img from "gatsby-image"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import PageGallery from "../components/PageGallery"
import SEO from "../components/layout/Seo"
import Notification from "../components/ui/Notification"

const chapterData = {
  chapterOne: {
    title: "Custom notebooks made-to-order",
    chapter: "01"
  },
  chapterTwo: {
    title: "A truly unique notebook",
    chapter: "02",
    heading: "Commitment to customization",
  },
  chapterThree: {
    title: "High quality, fountain pen friendly paper",
    chapter: "03",
    heading: "Smooth writing experience"
  },
  chapterFour: {
    title: "Simple, clean design and functional materials",
    chapter: "04",
    heading: "Introduction to our notebooks"
  },
  chapterFive: {
    title: "Beauty and the sheets",
    chapter: "05",
    heading: "Photo gallery"
  }
}

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
                  columns="repeat(auto-fit,minmax(60px,1fr))"
                  columnGap={spacing.large}
                  justifycontent="center"
                >
                  <Grid
                    flow="row"
                    rowGap={spacing.normal}
                    columns="minmax(0, 1fr)"
                    rows="auto"
                    justifycontent="center"
                  >
                    <Content
                      margin="0 auto"
                      headingTextAlign="center"
                      h1FontWeight="400"
                    >
                      <h1>Custom notebooks <b>made by you</b></h1>
                    </Content>
                    <Content
                      maxWidth={widths.content.index}
                      paragraphfontsize="1.25rem"
                      margin="0 auto"
                    >
                      <p>Fully customize the layout of every page in your notebook - from dot thickness to line spacing - and create your own custom-made notebook.</p>
                      <RegisterForm />
                    </Content>
                    <Flexbox
                      flex="flex"
                      margin="2rem auto"
                    >
                      <PageGallery />
                    </Flexbox>
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
                  columns="repeat(auto-fit,minmax(120px,1fr))"
                  columnGap={spacing.large}
                  rowGap={spacing.large}
                  justifycontent="center"
                  alignContent="center"
                >
                  <Cell
                    width={2}
                  >
                    <Content
                      margin="0 0 3rem 0"
                      h2margin="0 0 1.5rem 0"
                      h4Color={colors.link.normal}
                      h4FontWeight="400"
                      h2FontWeight="400"
                      h2FontSize="2.5rem"
                      paragraphfontsize="1.2rem"
                    >
                      <h4>{chapterData.chapterTwo.heading}</h4>
                      <h2>{chapterData.chapterTwo.title}</h2>
                      <p>Have you ever bought a notebook and wished that the dots were smaller or that the lines had more spacing between them? Or perhaps you feel like you are forever in search of the perfect layout.</p>
                      <p>Notesmith gives you the power to <b>customize every single page</b> to your needs. Tweak conventional grid styles to your fancy, or create an entirely new layout that works for you.</p>
                    </Content>
                    <Flexbox
                      flex="flex"
                    >
                      <CardWrapper dropshadow={`-2px 2px 6px ${colors.shadow.float}`}>
                        <Card
                          width="250px"
                          height="200px"
                          background={colors.paper.cream}
                        >
                          <Test width="50" height="50" />
                          <Content
                            margin="0.75rem 0 0"
                            paragraphColor={colors.gray.nineHundred}
                            h4Color={colors.gray.nineHundred}
                          >
                            <h4>Create layouts</h4>
                            <p>Go beyond conventional grids and layouts to create something unique.</p>
                          </Content>
                        </Card>
                      </CardWrapper>
                      <CardWrapper dropshadow={`-2px 2px 6px ${colors.shadow.float}`}>
                        <Card
                          width="250px"
                          height="200px"
                          background={colors.paper.cream}
                        >
                          <Test2 width="50" height="50" />
                          <Content
                            margin="0.75rem 0 0"
                            paragraphColor={colors.gray.nineHundred}
                            h4Color={colors.gray.nineHundred}
                          >
                            <h4>Edit with ease</h4>
                            <p>Easily tweak thickness, darkness, and spacing for your favorite grid styles.</p>
                          </Content>
                        </Card>
                      </CardWrapper>
                    </Flexbox>
                  </Cell>
                  <Cell
                    width={3}
                  >
                    <StaticImage
                      src="../images/index-image-1.jpg"
                      alt="Notesmith logo image"
                      placeholder="blurred"
                    />
                    <small>The back-side cover of a custom-made Notesmith notebook.</small>
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
                  columns="repeat(auto-fit,minmax(120px,1fr))"
                  columnGap={spacing.large}
                  rowGap={spacing.large}
                  justifycontent="center"
                  alignContent="center"
                >
                  <Cell width={3}>
                    <StaticImage
                      src="../images/writing-closeup-3.jpg"
                      alt="Notesmith notebook bundle"
                      placeholder="blurred"
                    />
                    <small>A close-up of our paper. Ink is Pilot Iroshizuku take-sumi.</small>
                  </Cell>
                  <Cell width={2}>
                    <Content
                      margin="0 0 2rem 0"
                      h2margin="0 0 1.5rem 0"
                      h4Color={colors.link.normal}
                      h4FontWeight="400"
                      h2FontWeight="400"
                      h2FontSize="2.5rem"
                      paragraphfontsize="1.2rem"
                    >
                      <h4>{chapterData.chapterThree.heading}</h4>
                      <h2>{chapterData.chapterThree.title}</h2>
                      <p>We tested over 50 different writing papers from various brands to find the one that produces the best results with fountain pen inks.</p>
                      <p>Our white, super-smooth paper (70lb) scored high marks on bleeding, ghosting, and feathering among early test users.</p>
                    </Content>
                    <Notification
                      backgroundcolor={colors.paper.cream}
                      color={colors.primary.sevenHundred}
                      bordercolor='transparent'
                    >
                      <Flexbox
                        flex="flex"
                        alignitems="center"
                      >
                        <Icon>
                          <HandWaving color={colors.primary.sevenHundred} size="1.5rem" />
                        </Icon>
                        <Content
                          paragraphcolor={colors.primary.sevenHundred}
                        >
                          <p>We are working on discovering additional paper options.</p>
                        </Content>
                      </Flexbox>
                    </Notification>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container ref={element => setPosition(element, 4)}>
            <LayoutContainer>
              <SectionContent>
              <Content
                margin="0 0 2rem 0"
                h2margin="0 0 1.5rem 0"
                h4Color={colors.link.normal}
                h4FontWeight="400"
                h2FontWeight="400"
                h2FontSize="2.5rem"
                paragraphfontsize="1.2rem"
              >
                <h4>{chapterData.chapterFour.heading}</h4>
                <h2>{chapterData.chapterFour.title}</h2>
              </Content>
                <Grid
                  columns="repeat(auto-fit,minmax(120px,1fr))"
                  columnGap={spacing.large}
                  rowGap={spacing.large}
                  justifycontent="center"
                  alignContent="center"
                >
                  <Cell>
                    <StaticImage
                      src="../images/index-column-1.jpg"
                      alt="Notesmith logo image"
                      placeholder="blurred"
                      quality={100}
                    />
                    <Content
                      margin="1rem 0 0"
                      h3margin="1rem 0 0.5rem"
                      h3FontWeight="400"
                      paragraphfontsize="1.2rem"
                    >
                      <h3>Linen paper cover</h3>
                      <p>80lb cover paper. Finely patterned with a slight texture. Branding only on the back cover.</p>
                    </Content>
                  </Cell>
                  <Cell>
                    <StaticImage
                      src="../images/index-column-2.jpg"
                      alt="Notesmith logo image"
                      placeholder="blurred"
                      quality={100}
                    />
                    <Content
                      margin="1rem 0 0"
                      h3margin="1rem 0 0.5rem"
                      h3FontWeight="400"
                      paragraphfontsize="1.2rem"
                    >
                      <h3>Saddle stitched</h3>
                      <p>Machine stitched with two staples. Clean, precise cuts create a high quality product.</p>
                    </Content>
                  </Cell>
                  <Cell>
                    <StaticImage
                      src="../images/index-column-3.jpg"
                      alt="Notesmith logo image"
                      placeholder="blurred"
                      quality={100}
                    />
                    <Content
                      margin="1rem 0 0"
                      h3margin="1rem 0 0.5rem"
                      h3FontWeight="400"
                      paragraphfontsize="1.2rem"
                    >
                      <h3>Smooth white paper</h3>
                      <p>70lb text paper. 48 total pages. Smooth, white paper with your custom layout.</p>
                    </Content>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section
          backgroundcolor={colors.primary.sixHundred}
        >
          <Container ref={element => setPosition(element, 5)}>
            <LayoutContainer>
              <SectionContent>
              <Content
                margin="0 0 2rem 0"
                h2margin="0 0 1.5rem 0"
                h4Color={colors.link.normal}
                h4FontWeight="400"
                h2FontWeight="400"
                h2FontSize="2.5rem"
                paragraphfontsize="1.2rem"
              >
                <h4>{chapterData.chapterFour.heading}</h4>
                <h2>{chapterData.chapterFour.title}</h2>
              </Content>
                <Grid
                  columns="repeat(auto-fit,minmax(120px,1fr))"
                  columnGap={spacing.large}
                  rowGap={spacing.large}
                  justifycontent="center"
                  alignContent="center"
                >
                  <Cell>
                    <Content
                      margin="1rem 0 0"
                      h3margin="0.5rem 0 0"
                      h3FontWeight="400"
                    >
                      <h3>Lorem Ipsum</h3>
                      <p>New summer style with 6 colors available total.</p>
                    </Content>
                  </Cell>
                  <Cell>
                    <Content
                      margin="1rem 0 0"
                      h3margin="0.5rem 0 0"
                      h3FontWeight="400"
                    >
                      <h3>Lorem Ipsum</h3>
                      <p>New summer style with 6 colors available total.</p>
                    </Content>
                  </Cell>
                  <Cell>
                    <Content
                      margin="1rem 0 0"
                      h3margin="0.5rem 0 0"
                      h3FontWeight="400"
                    >
                      <h3>Lorem Ipsum</h3>
                      <p>New summer style with 6 colors available total.</p>
                    </Content>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default IndexPage
