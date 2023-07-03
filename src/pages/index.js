import React, { useState } from "react"
import { graphql } from "gatsby"
import { Star, ArrowRight, WarningCircle, NoteBlank, ArrowBendRightDown } from "phosphor-react"
import { colors, fonts, spacing, widths } from "../styles/variables"
import { StaticImage } from "gatsby-plugin-image"
import { Container, Row, Col, setConfiguration } from 'react-grid-system'

import { Flexbox } from "../components/layout/Flexbox"
import { SectionMain, Section, SectionContent, SectionHeading } from "../components/layout/Section"
import { Tabs } from "../components/ui/Tabs"
import Book3d from "../components/index/Book3d"
import Box from "../components/ui/Box"
import Button from "../components/ui/Button"
import CircledText from "../components/misc/CircledText"
import Content from "../components/ui/Content"
import DemoControls from "../components/index/DemoControls"
import Icon from "../components/ui/Icon"
import Layout from "../components/layout/Layout"
import PageDemoCarousel from "../components/index/PageDemoCarousel"
import PageIcons from "../components/customize/PageIcons"
import { Patterns, Pattern } from "../components/misc/Patterns"
import Progress from "../components/ui/Progress"
import Reviews from "../components/index/Reviews"
import RegisterForm from "../components/form/RegisterForm"
import TabContent from "../components/index/TabContent"
import Tag from "../components/ui/Tag"
import TextLink from "../components/ui/TextLink"

const IndexPage = ({ data }) => {
  setConfiguration({ gutterWidth: 64 })
  const { tabImages } = data
  const [activeTab, setActiveTab] = useState(0)
  const [pageData, setPageData] = useState({
    alignmentHorizontal: "center",
    alignmentVertical: "top",
    angle: 30,
    ascSpacing: 5,
    borderData: {
      sync: true,
      toggle: true,
      thickness: 0.088,
      opacity: 1,
    },
    columns: 27,
    columnSpacing: 5,
    dashedLineData: {
      sync: true,
      thickness: 0.088,
      opacity: 1,
      dashArray: "2 4 4 2",
      dashOffset: 0,
    },
    dscSpacing: 5,
    hexagonRadius: 1,
    lineWidth: 100,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    opacity: 1,
    radius: 0.1,
    rows: 20,
    rowSpacing: 5,
    show: false,
    crossSize: 1,
    slantAngle: 55,
    slants: 20,
    slantSpacing: 5,
    spacing: 5,
    staffSpacing: 5,
    staves: 9,
    svgHeight: 607,
    svgWidth: 366,
    template: "",
    thickness: 0.088,
    xHeight: 5,
  })
  const leftPageData = {
    template: ""
  }
  const rightPageData = {
    template: ""
  }

  return (
    <Layout title="Made-to-order notebooks crafted with your unique, custom printed pages">
      <Patterns 
        color={colors.gray.twoHundred} 
      />
      <SectionMain>
        <Section>
          <SectionContent
            padding={`${spacing.xlarge} 0`}
          >
            <Pattern
              pattern={26}
              height="100%"
              width={200}
              top={12}
              left={0}
            />
            <Container xl lg md sm xs>
              <Row>
                <Col xl={4} lg={4} offset={{ sm: 2, lg: 0 }} sm={8}>
                  <Content
                    paragraphfontsize="1.25rem"
                    smallfontsize="0.8rem"
                    margin="0 0 32px"
                    h1margin="0 0 32px"
                    style={{ clipPath: `url(#pattern-26)` }}
                  >
                    <h1>Design <b><CircledText text="custom" /></b> notebooks</h1>
                    <p>Fully customize the layout of every page - from dot thickness to line spacing - and create your own unique, custom-made notebook.</p>
                  </Content>
                  <Content
                    paragraphmargin="0"
                    h5margin="8px 0"
                    h5fontweight="800"
                    className="has-border-top"
                    padding="32px 0 0"
                    margin="0"
                  >
                    <Flexbox
                      alignitems="center"
                      justifycontent="space-between"
                    >
                      <h5>Pre-order sale</h5>
                      <Tag
                        padding="3px 6px"
                        backgroundcolor={colors.white}
                        border={colors.borders.black}
                        color={colors.gray.nineHundred}
                      >
                        Announcement
                      </Tag>
                    </Flexbox>
                    <p>You can now sign up for the waitlist to join the pre-order sale of our notebooks at an exclusive 25% discounted price.</p>
                  </Content>
                  <RegisterForm 
                    border
                    fontsize="1rem"
                    margin="16px 0 0"
                    top="12px"
                    color={colors.gray.nineHundred}
                  />
                </Col>
                <Col xl={8} lg={8}>
                  <PageDemoCarousel />
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
        <Section>
          <SectionContent>
            <Container xl lg md sm xs>
              <Row>
                <Col>
                  <SectionHeading>
                    Signature custom notebook
                  </SectionHeading>
                </Col>
              </Row>
              <Row>
                <Col md={6} lg={4}>
                  <Content
                    h2margin="0 0 2rem 0"
                    h2fontsize="3rem"
                    h2fontweight="400"
                    h5fontsize="0.75rem"
                    paragraphfontsize="1.25rem"
                    paragraphmargin="0 0 16px"
                    maxwidth={widths.content.index}
                    margin="0 0 32px"
                  >
                    <h2>Your custom layouts on <b>every single page</b></h2>
                    <p>With Notesmith, you can <i>customize every single page</i> to your needs. Use our editor to simply tweak conventional grid styles to your fancy, or create an entirely new layout that works for you.</p>
                  </Content>
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                  >
                    <TextLink
                      className="has-icon"
                      color={colors.gray.nineHundred}
                      fontweight="700"
                      href="/waitlist"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Join the waitlist</span>
                      <Icon
                        margin="0 0 0 4px"
                      >
                        <ArrowRight color={colors.gray.nineHundred} />
                      </Icon>
                    </TextLink>
                  </Flexbox>
                </Col>
                <Col md={6} lg={4}>
                  <Book3d 
                    pageData={pageData}
                    setPageData={setPageData}
                  />
                </Col>
                <Col lg={4}>
                  <Content
                    margin="0 0 32px"
                    paragraphfontsize="1rem"
                    h5margin="0"
                    h5fontweight="700"
                  >
                    <Flexbox
                      margin="0 0 16px"
                      alignitems="flex-start"
                      justifycontent="space-between"
                    >
                      <h5>Choose from a template below</h5>
                      <Tag
                        padding="3px 6px"
                        backgroundcolor={colors.white}
                        border={colors.borders.black}
                        color={colors.gray.nineHundred}
                        margin="0 0 0 8px"
                      >
                        Demo
                      </Tag>
                    </Flexbox>
                    <p>Just click on any of the template boxes below and the layout of the book will change automatically. Use the controls to make adjustments to the layout.</p>
                  </Content>
                  <Flexbox
                    margin="0 0 16px"
                    alignitems="flex-end"
                  >
                    <Content
                      paragraphfontweight="700"
                    >
                      <p>Try it out</p>
                    </Content>
                    <Icon margin="0 0 0 4px">
                      <ArrowBendRightDown size="1rem" weight="bold" color={colors.gray.nineHundred} />
                    </Icon>
                  </Flexbox>
                  <Flexbox
                    flex="flex"
                    flexwrap="wrap"
                    margin="0 0 16px"
                  >
                    <PageIcons
                      checkActiveVar={pageData.template}
                      data={pageData}
                      iconMargin="0 24px 16px 0"
                      isProductPage={true}
                      leftPageData={leftPageData}
                      rightPageData={rightPageData}
                      setData={setPageData}
                      showLabels={false}
                    />
                  </Flexbox>
                  <DemoControls
                    pageData={pageData}
                    setPageData={setPageData}
                  />
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    margin="0 0 32px"
                  >
                    <Button
                      backgroundcolor={colors.white}
                      color={colors.gray.nineHundred}
                      border={`1px solid ${colors.gray.nineHundred}`}
                      padding="1rem"
                      margin="0 1rem 0 0"
                      width="50%"
                      onClick={() => setPageData({
                        ...pageData,
                        template: null,
                      })}
                    >
                      Hide layout
                    </Button>
                    <Button
                      backgroundcolor={colors.gray.nineHundred}
                      color={colors.gray.oneHundred}
                      border={`1px solid ${colors.gray.nineHundred}`}
                      padding="1rem"
                      width="50%"
                      onClick={() => setPageData({
                        ...pageData,
                        slants: 21,
                        columns: 27,
                        radius: 0.1,
                        groupSpacing: 5,
                        hexagonRadius: 1,
                        lineWidth: 100,
                        opacity: 1,
                        rows: pageData.template === "seyes" ? 97 : 42,
                        thickness: 0.088,
                        size: 1,
                      })}
                    >
                      Reset layout
                    </Button>
                  </Flexbox>
                  <hr />
                  <Flexbox
                    flex="flex"
                    alignitems="flex-start"
                    margin="16px 0 0" 
                  >
                    <Icon>
                      <WarningCircle color={colors.gray.sixHundred} />
                    </Icon>
                    <Content
                      margin="0 0 0 4px"
                      smallmargin="0"
                    >
                      <small>This demo is only a quick example. Our editor has more advanced features and options.</small>
                    </Content>
                  </Flexbox>
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
        <Section>
          <SectionContent>
            <Container xl lg md sm xs>
              <Row>
                <Col>
                  <SectionHeading>
                    High quality materials
                  </SectionHeading>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <Content
                    h2fontweight="400"
                    h2margin="0 0 2rem"
                    paragraphfontsize="1.25rem"
                    paragraphmargin="0 0 16px"
                    margin="0 0 32px"
                  >
                    <h2>We use only the best stuff, guaranteed</h2>
                    <p>From the beginning, our only goal was to create an outstanding notebook - nothing more, nothing less. From cover to cover, our notebooks are built with high quality materials only.</p>
                  </Content>
                </Col>
                <Col lg={8}>
                  <Tabs 
                    tabList={["Paper", "Cover", "Lamination", "Binding"]}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    fontsize="1rem"
                  />
                  <TabContent
                    activeTab={activeTab}
                    tabImages={tabImages.nodes}
                  />
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
        <Section
          backgroundcolor={colors.gray.nineHundred}
        >
          <SectionContent
            padding={`${spacing.large} 0`}
          >
            <Container sm xs>
              <Row>
                <Col md={5} push={{md: 1}}>
                  <Content
                    h3fontweight="400"
                    h3fontsize="2rem"
                    h3color={colors.gray.oneHundred}
                    h3margin="0"
                  >
                    <h3>Join the waitlist to get early access to all of Notesmith's features and notebooks</h3>
                  </Content>
                </Col>
                <Col md={5} push={{ md: 1 }}>
                  <Content
                    paragraphcolor={colors.gray.oneHundred}
                  >
                    <p>
                      In early access, all notebooks will be sold at a discounted price. Please sign up to participate in this limited time offer and come celebrate our launch together! Users will be granted access on a rolling basis.
                    </p>
                  </Content>
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    margin="16px 0 0"
                  >
                    <TextLink
                      className="has-icon"
                      color={colors.gray.oneHundred}
                      underlinecolor={colors.gray.oneHundred}
                      hovercolor={colors.gray.nineHundred}
                      href="/waitlist"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Join the waitlist</span>
                      <Icon
                        margin="0 0 0 8px"
                      >
                        <ArrowRight 
                          size="1rem" 
                          color={colors.gray.oneHundred} 
                          weight="bold"
                        />
                      </Icon>
                    </TextLink>
                  </Flexbox>
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
        <Section>
          <SectionContent>
            <Container xl lg md sm xs>
              <Row>
                <Col>
                  <SectionHeading>
                    Fountain pen friendly
                  </SectionHeading>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <Content
                    paragraphfontsize="1.25rem"
                    margin="0 0 2rem 0"
                    h2margin="0 0 2rem 0"
                  >
                    <h2>Smooth, ink-loving paper</h2>
                    <p>After testing over 50 kinds of paper, we settled on the one that had the best results with multiple inks. This white, super-smooth paper scored high marks on bleeding, ghosting, and feathering tests among early users.</p>
                  </Content>
                  <Box>
                    <Flexbox
                      padding="16px 0"
                      flex="flex"
                      alignitems="center"
                      justifycontent="space-between"
                      bordercolor={colors.gray.nineHundred}
                    >
                      <Content
                        width="128px"
                      >
                        <p>
                          Bleeding
                        </p>
                      </Content>
                      <Progress
                        barcolor={colors.gray.nineHundred}
                        completion={93}
                        margin="0"
                        wrappercolor={colors.gray.threeHundred}
                      />
                      <Tag
                        backgroundcolor={colors.white}
                        color={colors.gray.nineHundred}
                        border={colors.borders.black}
                        padding="4px 6px"
                        fontfamily={fonts.secondary}
                        margin="0 0 0 0.5rem"
                      >
                        <Icon
                          margin="0 1px 1px 0"
                        >
                          <Star weight="fill" color={colors.gray.nineHundred} />
                        </Icon>
                        <span>4.7</span>
                      </Tag>
                    </Flexbox>
                    <Flexbox
                      padding="16px 0"
                      flex="flex"
                      alignitems="center"
                      justifycontent="space-between"
                      className="has-border-top"
                      bordercolor={colors.gray.nineHundred}
                    >
                      <Content
                        width="128px"
                      >
                        <p>
                          Feathering
                        </p>
                      </Content>
                      <Progress
                        barcolor={colors.gray.nineHundred}
                        completion={90}
                        margin="0"
                        wrappercolor={colors.gray.threeHundred}
                      />
                      <Tag
                        backgroundcolor={colors.white}
                        color={colors.gray.nineHundred}
                        border={colors.borders.black}
                        padding="4px 6px"
                        fontfamily={fonts.secondary}
                        margin="0 0 0 0.5rem"
                      >
                        <Icon
                          margin="0 1px 1px 0"
                        >
                          <Star weight="fill" color={colors.gray.nineHundred} />
                        </Icon>
                        <span>4.5</span>
                      </Tag>
                    </Flexbox>
                    <Flexbox
                      padding="16px 0"
                      flex="flex"
                      alignitems="center"
                      justifycontent="space-between"
                      className="has-border-top"
                      margin="0 0 16px"
                    >
                      <Content
                        width="128px"
                      >
                        <p>
                          Ghosting
                        </p>
                      </Content>
                      <Progress
                        barcolor={colors.gray.nineHundred}
                        completion={75}
                        margin="0"
                        wrappercolor={colors.gray.threeHundred}
                      />
                      <Tag
                        backgroundcolor={colors.white}
                        color={colors.gray.nineHundred}
                        border={colors.borders.black}
                        padding="4px 6px"
                        fontfamily={fonts.secondary}
                        margin="0 0 0 0.5rem"
                      >
                        <Icon
                          margin="0 1px 1px 0"
                        >
                          <Star weight="fill" color={colors.gray.nineHundred} />
                        </Icon>
                        <span>3.8</span>
                      </Tag>
                    </Flexbox>
                  </Box>
                  <hr />
                  <Flexbox
                    flex="flex"
                    alignitems="flex-start"
                    margin="16px 0"
                  >
                    <Icon>
                      <WarningCircle color={colors.gray.sixHundred} />
                    </Icon>
                    <Content
                      margin="0 0 0 4px"
                      smallmargin="0"
                    >
                      <small>Results are from a survey conducted on early test users.</small>
                    </Content>
                  </Flexbox>
                </Col>
                <Col lg={8}>
                  <Flexbox
                    justifycontent="center"
                  >
                    <StaticImage
                      src="../images/index/writing-closeup.jpg"
                      alt="Ink on paper"
                      loading="eager"
                      quality={100}
                    />
                  </Flexbox>
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
        <Section>
          <SectionContent>
            <Container xl lg md sm xs>
              <Row>
                <Col>
                  <SectionHeading>
                    Early reviews
                  </SectionHeading>
                </Col>
              </Row>
              <Row>
                <Col md={6} lg={6} xl={4}>
                  <Content
                    h2margin="0 0 2rem"
                    h2fontweight="400"
                    paragraphfontsize="1.25rem"
                    margin="0 0 32px"
                  >
                    <h2>Feedback from our early users</h2>
                    <p>We recently ran a test trial where we provided notebooks to over a hundred users. Read what some of them had to say about their experience with Notesmith.</p>
                  </Content>
                  <hr />
                  <Flexbox
                    flex="flex"
                    alignitems="flex-start"
                    margin="16px 0"
                  >
                    <Icon>
                      <NoteBlank color={colors.gray.sixHundred} />
                    </Icon>
                    <Content
                      margin="0 0 0 4px"
                      smallmargin="0"
                    >
                      <small>Quotes represent real words from real users with fake names.</small>
                    </Content>
                  </Flexbox>
                </Col>
                <Col md={6} lg={6} xl={8}>
                  <Reviews />
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export const pageQuery = graphql`
  query IndexPageQuery {
    tabImages: allFile(filter: { relativeDirectory: { eq: "index-tab-images" }}) {
      nodes {
        childImageSharp {
          fluid {
            src
            originalName
          }
          gatsbyImageData(
            width: 996
            placeholder: BLURRED
            quality: 100
          )
        }
      }
    }
  }
`

export default IndexPage
