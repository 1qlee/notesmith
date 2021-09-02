import React, { useState } from "react"
import { Book, HandWaving, Mouse, Package } from "phosphor-react"
import { colors, spacing, widths } from "../styles/variables"
import { StaticImage } from "gatsby-plugin-image"
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import { Container, LayoutContainer } from "../components/layout/Container"
import { Flexbox } from "../components/layout/Flexbox"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import Content from "../components/Content"
import Footer from "../components/ui/Footer"
import Icon from "../components/Icon"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import Notification from "../components/ui/Notification"
import PageAnimation from "../components/PageAnimation"
import PageGallery from "../components/PageGallery"
import RegisterForm from "../components/form/RegisterForm"
import Seo from "../components/layout/Seo"
import Tag from "../components/ui/Tag"

const chapterData = {
  chapterOne: {
    title: "Custom notebooks made-to-order",
    chapter: "01"
  },
  chapterTwo: {
    title: "Create a truly unique notebook of your own",
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
    heading: "Strive for quality"
  },
  chapterFive: {
    title: "Our current notebook specifications",
    chapter: "05",
    heading: "Good things come in bundles"
  }
}

const IndexPage = ({ data }) => {
  const [ hideNavbar, setHideNavbar ] = useState(false)
  const [ chapterOnePosition, setchapterOnePosition ] = useState()
  const [ chapterTwoPosition, setchapterTwoPosition ] = useState()
  const [ chapterThreePosition, setchapterThreePosition ] = useState()
  const [ chapterFourPosition, setchapterFourPosition ] = useState()
  const [ chapterFivePosition, setchapterFivePosition ] = useState()
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
        case 5:
          return setchapterFivePosition(element.offsetTop)
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
    if (chapterFourPosition / 1.2 < -currPos.y && -currPos.y > chapterFourPosition / 1.5) {
      setCurrentChapterTitle(chapterData.chapterFour.title)
      setCurrentChapterNumber(chapterData.chapterFour.chapter)
    }
    if (chapterFivePosition / 1.2 < -currPos.y && -currPos.y > chapterFivePosition / 1.5) {
      setCurrentChapterTitle(chapterData.chapterFive.title)
      setCurrentChapterNumber(chapterData.chapterFive.chapter)
    }

  }, [chapterOnePosition, chapterTwoPosition, chapterThreePosition, hideNavbar])

  return (
    <Layout>
      <Seo title="Create truly unique custom notebooks" />
      <Nav chapterNumber={currentChapterNumber} title={currentChapterTitle} hideNavbar={hideNavbar}></Nav>
      <SectionMain>
        <Section>
          <Container ref={element => setPosition(element, 1)}>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  columns="1fr"
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
                      headingtextalign="center"
                      h1fontweight="400"
                    >
                      <h1>Custom notebooks <b>made by you</b></h1>
                    </Content>
                    <Content
                      maxwidth={widths.content.index}
                      paragraphfontsize="1.25rem"
                      paragraphmarginbottom="1rem"
                      margin="0 auto"
                      smallfontsize="0.8rem"
                    >
                      <p>Fully customize the layout of every page in your notebook - from dot thickness to line spacing - and create your own custom-made notebook.</p>
                      <RegisterForm id="1" />
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
        <Section backgroundcolor={colors.primary.sixHundred}>
          <Container ref={element => setPosition(element, 1)}>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  columns="1fr"
                  columnGap={spacing.large}
                  rowGap={spacing.large}
                  justifycontent="center"
                  alignContent="center"
                >
                  <Cell center>
                    <Content
                      margin="0 0 2rem 0"
                      h2color={colors.primary.white}
                      h2fontweight="400"
                      h2fontsize="2.5rem"
                      headingtextalign="center"
                    >
                      <h2>Have you ever bought a notebook...</h2>
                    </Content>
                    <PageAnimation />
                  </Cell>
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
                  justifyContent="center"
                  alignContent="center"
                >
                  <Cell
                    width={3}
                  >
                    <StaticImage
                      src="../images/index-image-1.jpg"
                      alt="Notesmith logo image"
                      placeholder="blurred"
                      quality={100}
                    />
                    <small>Notesmith notebook in packs of two.</small>
                  </Cell>
                  <Cell
                    width={2}
                    className="is-fullwidth-mobile"
                  >
                    <Content
                      margin="0 0 2rem 0"
                      h2margin="0 0 1.5rem 0"
                      h4color={colors.link.normal}
                      h4fontweight="400"
                      h2fontweight="400"
                      h2fontsize="2.5rem"
                      paragraphfontsize="1.2rem"
                      paragraphmarginbottom="1rem"
                      maxwidth={widths.content.index}
                    >
                      <h4>{chapterData.chapterTwo.heading}</h4>
                      <h2>{chapterData.chapterTwo.title}</h2>
                      <p>Notesmith gives you the power to <b>customize every single page</b> to your needs. You can simply tweak conventional grid styles to your fancy, or create an entirely new layout that works for you.</p>
                      <p>At Notesmith, we don't keep an inventory of bland, generic notebooks collecting dust in some warehouse. Every custom notebook is made to order in our New York factory by experienced printing veterans.</p>
                    </Content>
                    <Content
                      h3fontweight="400"
                    >
                      <h3>How it works</h3>
                    </Content>
                    <Grid
                      columns="repeat(auto-fit,minmax(135px,1fr))"
                      columnGap={spacing.normal}
                    >
                      <Cell>
                        <Flexbox
                          flex="flex"
                          alignitems="center"
                        >
                          <Content
                            h3fontsize="1.2rem"
                            h3fontweight="400"
                            h3margin="0 0 0.5rem"
                          >
                            <Flexbox
                              flex="flex"
                              alignitems="center"
                              margin="0 0 0.5rem 0"
                            >
                              <Tag
                                margin="0"
                                fontsize="1rem"
                                padding="0.25rem 0.5rem"
                                backgroundcolor={colors.paper.cream}
                                color={colors.primary.sixHundred}
                              >
                                01
                              </Tag>
                              <Icon margin="0 0 0 0.25rem">
                                <Mouse
                                  size="1.5rem"
                                  color={colors.primary.sixHundred}
                                  weight="duotone"
                                />
                              </Icon>
                            </Flexbox>
                            <h3>Design layout</h3>
                            <p>Use our online tool to create your custom layout.</p>
                          </Content>
                        </Flexbox>
                      </Cell>
                      <Cell>
                        <Flexbox
                          flex="flex"
                          alignitems="center"
                        >
                          <Content
                            h3fontsize="1.2rem"
                            h3fontweight="400"
                            h3margin="0 0 0.5rem"
                          >
                            <Flexbox
                              flex="flex"
                              alignitems="center"
                              margin="0 0 0.5rem 0"
                            >
                              <Tag
                                margin="0"
                                fontsize="1rem"
                                padding="0.25rem 0.5rem"
                                backgroundcolor={colors.paper.cream}
                                color={colors.primary.sixHundred}
                              >
                                02
                              </Tag>
                              <Icon margin="0 0 0 0.25rem">
                                <Book
                                  size="1.5rem"
                                  color={colors.primary.sixHundred}
                                  weight="duotone"
                                />
                              </Icon>
                            </Flexbox>
                            <h3>Create notebook</h3>
                            <p>Put together your notebook with your custom pages.</p>
                          </Content>
                        </Flexbox>
                      </Cell>
                      <Cell>
                        <Flexbox
                          flex="flex"
                        >
                          <Content
                            h3fontsize="1.2rem"
                            h3fontweight="400"
                            h3margin="0 0 0.5rem"
                          >
                          <Flexbox
                            flex="flex"
                            alignitems="center"
                            margin="0 0 0.5rem 0"
                          >
                            <Tag
                              margin="0"
                              fontsize="1rem"
                              padding="0.25rem 0.5rem"
                              backgroundcolor={colors.paper.cream}
                              color={colors.primary.sixHundred}
                            >
                              03
                            </Tag>
                            <Icon margin="0 0 0 0.25rem">
                              <Package
                                size="1.5rem"
                                color={colors.primary.sixHundred}
                                weight="duotone"
                              />
                            </Icon>
                          </Flexbox>
                            <h3>Packed and ready</h3>
                            <p>Congratulations, your notebook is being shipped to you!</p>
                          </Content>
                        </Flexbox>
                      </Cell>
                    </Grid>
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
                  <Cell
                    width={2}
                    className="is-fullwidth-mobile"
                  >
                    <Content
                      margin="0 0 2rem 0"
                      h2margin="0 0 1.5rem 0"
                      h4color={colors.link.normal}
                      h4fontweight="400"
                      h2fontweight="400"
                      h2fontsize="2.5rem"
                      paragraphfontsize="1.2rem"
                      maxwidth={widths.content.index}
                    >
                      <h4>{chapterData.chapterThree.heading}</h4>
                      <h2>{chapterData.chapterThree.title}</h2>
                      <p></p>
                      <p>You don't have to worry about your writing smudging or spreading. We tested over 50 different writing papers from various brands to find the one that produces the best results with fountain pen inks.</p>
                      <p>Our white, super-smooth paper scored high marks on bleeding, ghosting, and feathering among early test users. 70lb paper adds slightly more thickness than traditional notebook paper for extra durability.</p>
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
                            paragraphfontsize="1rem"
                          >
                            <p>We are working on discovering additional paper options.</p>
                          </Content>
                        </Flexbox>
                      </Notification>
                    </Content>
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
                h4color={colors.link.normal}
                h4fontweight="400"
                h2fontweight="400"
                h2fontsize="2.5rem"
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
                      h3fontweight="400"
                      paragraphfontsize="1.2rem"
                    >
                      <h3>Linen paper cover</h3>
                      <p>Finely patterned with a slightly raised, but smooth texture. Branding only on the back cover.</p>
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
                      h3fontweight="400"
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
                      h3fontweight="400"
                      paragraphfontsize="1.2rem"
                    >
                      <h3>Smooth white paper</h3>
                      <p>Every page can be printed with a different layout. Smooth paper is a joy to write on.</p>
                    </Content>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section
          backgroundcolor={colors.paper.offWhite}
        >
          <Container ref={element => setPosition(element, 5)}>
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
                      src="../images/index-image-2.jpg"
                      alt="Notesmith notebook bundle"
                      placeholder="blurred"
                      quality={100}
                    />
                    <small>Two Notesmith notebooks bundled together.</small>
                  </Cell>
                  <Cell
                    width={2}
                    className="is-fullwidth-mobile"
                  >
                    <Content
                      margin="0 0 2rem 0"
                      h2margin="0 0 1.5rem 0"
                      h4color={colors.link.normal}
                      h4fontweight="400"
                      h2fontweight="400"
                      h2fontsize="2.5rem"
                      paragraphfontsize="1.2rem"
                      maxwidth={widths.content.index}
                    >
                      <h4>{chapterData.chapterFive.heading}</h4>
                      <h2>{chapterData.chapterFive.title}</h2>
                      <p>You'll find the current specifications for our notebooks below. We hope to be able to provide more customization options in the future. Including but not limited to: rounded corners, various sizes, multiple colors, more pages, different binding methods, etc.</p>
                      <Content
                        paragraphfontsize="1.2rem"
                        paragraphmarginbottom="0"
                      >
                        <Tag
                          fontsize="1.5rem"
                          backgroundcolor={colors.paper.cream}
                          color={colors.primary.sevenHundred}
                        >
                          $20 / pack
                        </Tag>
                      </Content>
                      <Content
                        paragraphfontsize="1.2rem"
                        paragraphmarginbottom="0"
                      >
                        <Flexbox
                          alignitems="center"
                          bordercolor={colors.primary.sixHundred}
                          className="has-border-bottom"
                          flex="flex"
                          justifycontent="space-between"
                          margin="1rem 0"
                          padding="0 0 1rem"
                        >
                          <p>Pages</p>
                          <p>48 total pages (70lb)</p>
                        </Flexbox>
                      </Content>
                      <Content
                        paragraphfontsize="1.2rem"
                        paragraphmarginbottom="0"
                      >
                        <Flexbox
                          alignitems="center"
                          bordercolor={colors.primary.sixHundred}
                          className="has-border-bottom"
                          flex="flex"
                          justifycontent="space-between"
                          margin="1rem 0"
                          padding="0 0 1rem"
                        >
                          <p>Size</p>
                          <p>5.5" x 8.5" (A5)</p>
                        </Flexbox>
                      </Content>
                      <Content
                        paragraphfontsize="1.2rem"
                        paragraphmarginbottom="0"
                      >
                        <Flexbox
                          alignitems="center"
                          bordercolor={colors.primary.sixHundred}
                          className="has-border-bottom"
                          flex="flex"
                          justifycontent="space-between"
                          margin="1rem 0"
                          padding="0 0 1rem"
                        >
                          <p>Cover</p>
                          <p>Linen paper, forest green (80c)</p>
                        </Flexbox>
                      </Content>
                      <Content
                        paragraphfontsize="1.2rem"
                        paragraphmarginbottom="0"
                      >
                        <Flexbox
                          alignitems="center"
                          bordercolor={colors.primary.sixHundred}
                          className="has-border-bottom"
                          flex="flex"
                          justifycontent="space-between"
                          margin="1rem 0"
                          padding="0 0 1rem"
                        >
                          <p>Quantity</p>
                          <p>2 notebooks</p>
                        </Flexbox>
                      </Content>
                      <Content
                        paragraphfontsize="1.2rem"
                        paragraphmarginbottom="0"
                      >
                        <Flexbox
                          alignitems="center"
                          bordercolor={colors.primary.sixHundred}
                          className="has-border-bottom"
                          flex="flex"
                          justifycontent="space-between"
                          margin="1rem 0"
                          padding="0 0 1rem"
                        >
                          <p>Manufactured</p>
                          <p>Made in U.S.A</p>
                        </Flexbox>
                      </Content>
                    </Content>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section
          backgroundcolor={colors.paper.cream}
        >
          <Container>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  columns={`minmax(120px, ${widths.content.index})`}
                >
                  <Cell>
                    <Content
                      margin="0 0 2rem 0"
                      h2margin="0 0 1.5rem 0"
                      h4color={colors.link.normal}
                      h4fontweight="400"
                      h2fontweight="400"
                      h2fontsize="2.5rem"
                      paragraphfontsize="1.2rem"
                    >
                      <h2>Sign up for early access</h2>
                      <RegisterForm id="2" />
                    </Content>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Footer />
      </SectionMain>
    </Layout>
  )
}

export default IndexPage
