import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import { Star, ArrowRight, WarningCircle, NoteBlank, ArrowBendRightDown } from "@phosphor-icons/react"
import { colors, fonts, spacing, widths } from "../styles/variables"
import { StaticImage } from "gatsby-plugin-image"
import { Container, Row, Col, setConfiguration } from 'react-grid-system'
import RandomLine from "../components/misc/Lines" 

import { Flexbox } from "../components/layout/Flexbox"
import { SectionMain, Section, SectionContent, SectionHeading } from "../components/layout/Section"
import { Tabs } from "../components/ui/Tabs"
import Book3d from "../components/index/Book3d"
import Box from "../components/ui/Box"
import Button from "../components/ui/Button"
import Content from "../components/ui/Content"
import DemoControls from "../components/index/DemoControls"
import Icon from "../components/ui/Icon"
import Layout from "../components/layout/Layout"
import PageDemoCarousel from "../components/index/PageDemoCarousel"
import PageIcons from "../components/customize/PageIcons"
import { Patterns, Pattern } from "../components/misc/Patterns"
import Progress from "../components/ui/Progress"
import Reviews from "../components/index/Reviews"
import TabContent from "../components/index/TabContent"
import Tag from "../components/ui/Tag"
import TextLink from "../components/ui/TextLink"
import Seo from "../components/layout/Seo"

const IndexPage = ({ data }) => {
  setConfiguration({ gutterWidth: 64 })
  const { tabImages } = data
  const [activeTab, setActiveTab] = useState(0)
  const config = {
    alignmentHorizontal: "center",
    alignmentVertical: "top",
    angle: 60,
    ascSpacing: 5,
    borderData: {
      sync: true,
      toggle: true,
      thickness: 0.088,
      opacity: 1,
    },
    columns: 99,
    columnSpacing: 5,
    dashedLineData: {
      sync: true,
      thickness: 0.088,
      opacity: 1,
      dashArray: "2 4 4 2",
      dashOffset: 0,
    },
    dscSpacing: 5,
    hexagonRadius: 5,
    lineWidth: 100,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    opacity: 1,
    radius: 0.1,
    rows: 99,
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
    strokeWidth: 0.088,
    xHeight: 5,
  }
  const [pageData, setPageData] = useState(config)
  const leftPageData = {
    template: ""
  }
  const rightPageData = {
    template: ""
  }

  return (
    <Layout>
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
                    padding="0 0 32px"
                    h1margin="0 0 32px"
                    className="has-border-bottom"
                    style={{ clipPath: `url(#pattern-26)` }}
                  >
                    <h1>Design <span style={{position: 'relative', display: "inline-block"}}><RandomLine />custom</span> notebooks</h1>
                    <p>Fully customize the layout of every page - from dot thickness to line spacing - and create your own unique, custom-made notebook.</p>
                  </Content>
                  <Content
                    backgroundcolor={colors.gray.nineHundred}
                    paragraphcolor={colors.gray.oneHundred}
                    paragraphmargin="0"
                    h5margin="8px 0"
                    h5fontsize="1.25rem"
                    h5color={colors.gray.oneHundred}
                    padding="16px"
                  >
                    <Flexbox
                      alignitems="center"
                      justifycontent="space-between"
                    >
                      <h5>The pre-order sale is now live!</h5>
                      <Tag
                        padding="3px 6px"
                        backgroundcolor={colors.yellow.twoHundred}
                        border={colors.borders.black}
                        color={colors.gray.nineHundred}
                      >
                        SALE
                      </Tag>
                    </Flexbox>
                    <p>Our notebooks are be 25% off during this time and will ship for free to customers in the U.S.</p>
                    <Button
                      as={Link}
                      to="/products/notebooks/pro-wired-notebook-a5-custom/white"
                      backgroundcolor={colors.gray.oneHundred}
                      color={colors.gray.nineHundred}
                      padding="16px"
                      width="100%"
                    >
                      Shop now
                    </Button>
                  </Content>
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
                    Our signature
                  </SectionHeading>
                </Col>
              </Row>
              <Row>
                <Col md={6} lg={4}>
                  <Content
                    h2margin="0 0 2rem 0"
                    h2fontsize="3rem"
                    h5fontsize="0.75rem"
                    paragraphfontsize="1.25rem"
                    paragraphmargin="0 0 16px"
                    maxwidth={widths.content.index}
                    margin="0 0 32px"
                  >
                    <h2>Custom layouts on <i>every single page</i></h2>
                    <p>With Notesmith, you can customize every single page to your needs. Use our editor to simply tweak conventional grid styles to your fancy, or create an entirely new layout that works for you.</p>
                  </Content>
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                  >
                    <TextLink
                      className="has-icon"
                      color={colors.gray.nineHundred}
                      fontweight="700"
                      fontsize="1.25rem"
                      as={Link}
                    >
                      <span>Shop now</span>
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
                    paragraphfontsize="1.25rem"
                    h5fontsize="1.25rem"
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
                      h5fontsize="1.25rem"
                      h5margin="0"
                    >
                      <h5>Try it out</h5>
                    </Content>
                    <Icon margin="0 0 0 4px">
                      <ArrowBendRightDown size={20} weight="bold" color={colors.gray.nineHundred} />
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
                      hideNone={true}
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
                    justifycontent="center"
                    margin="0 0 32px"
                  >
                    <Button
                      backgroundcolor={colors.white}
                      color={colors.gray.nineHundred}
                      border={`1px solid ${colors.gray.nineHundred}`}
                      padding="16px"
                      margin="0 16px 0 0"
                      width="50%"
                      onClick={() => setPageData({
                        ...pageData,
                        template: null,
                      })}
                    >
                      Hide layout
                    </Button>
                    {/* <Button
                      backgroundcolor={colors.gray.nineHundred}
                      color={colors.gray.oneHundred}
                      border={`1px solid ${colors.gray.nineHundred}`}
                      padding="1rem"
                      width="50%"
                      onClick={() => setPageData({
                        ...config,
                        template: pageData.template,
                      })}
                    >
                      Reset layout
                    </Button> */}
                  </Flexbox>
                  <hr />
                  <Flexbox
                    flex="flex"
                    alignitems="flex-start"
                    margin="16px 0 0" 
                  >
                    <Icon margin="4px 0 0">
                      <WarningCircle color={colors.gray.nineHundred} />
                    </Icon>
                    <Content
                      margin="0 0 0 4px"
                      smallmargin="0"
                      smallfontsize="1rem"
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
                    Materials
                  </SectionHeading>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <Content
                    h2margin="0 0 2rem"
                    paragraphfontsize="1.25rem"
                    paragraphmargin="0 0 16px"
                    margin="0 0 32px"
                  >
                    <h2>Only the best, guaranteed</h2>
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
                    h3fontsize="2rem"
                    h3color={colors.gray.oneHundred}
                    h3margin="0 0 16px"
                  >
                    <h3>Create a Notesmith account to get access to all customization tools and features</h3>
                  </Content>
                </Col>
                <Col md={5} push={{ md: 1 }}>
                  <Content
                    paragraphcolor={colors.gray.oneHundred}
                    paragraphfontsize="1.25rem"
                  >
                    <p>
                      Sign up to get access to the Notesmith platform where you can create custom notebook layouts. All users will enjoy 25% discounted notebook pricing and free shipping during the pre-order sale.
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
                      fontsize="1.25rem"
                      underlinecolor={colors.gray.oneHundred}
                      hovercolor={colors.gray.nineHundred}
                      as={Link}
                      to="/signup"
                    >
                      <span>Sign up</span>
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
                    Paper
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
                    <h2>Fountain pen friendly paper</h2>
                    <p>After conducting tests on more than 50 types of paper, we chose the one that exhibited the best performance with various inks. Our white, ultra-smooth paper received top ratings from early users in bleeding, ghosting, and feathering assessments.</p>
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
                    center="flex-start"
                    margin="16px 0"
                  >
                    <Icon>
                      <WarningCircle color={colors.gray.nineHundred} size={16} />
                    </Icon>
                    <Content
                      margin="0 0 0 4px"
                      smallmargin="0"
                      smallfontsize="1rem"
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
                    Reviews
                  </SectionHeading>
                </Col>
              </Row>
              <Row>
                <Col md={6} lg={6} xl={4}>
                  <Content
                    h2margin="0 0 2rem"
                    paragraphfontsize="1.25rem"
                    margin="0 0 32px"
                  >
                    <h2>Feedback from early users</h2>
                    <p>We recently ran a test trial where we provided notebooks to over a hundred users. Read what some of them had to say about their experience with Notesmith.</p>
                  </Content>
                  <hr />
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    margin="16px 0"
                  >
                    <Icon>
                      <NoteBlank color={colors.gray.nineHundred} size={16} />
                    </Icon>
                    <Content
                      margin="0 0 0 4px"
                      smallmargin="0"
                      smallfontsize="1rem"
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