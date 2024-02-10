import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import { Star, ArrowRight, ArrowBendRightDown, Note, MegaphoneSimple } from "@phosphor-icons/react"
import { colors, fonts, spacing, widths } from "../styles/variables"
import { StaticImage } from "gatsby-plugin-image"
import { Container, Row, Col } from 'react-grid-system'
import heroImage from "../images/index/hero.jpg"

import Book3d from "../components/index/Book3d"
import Button from "../components/ui/Button"
import Content from "../components/ui/Content"
import DemoControls from "../components/index/DemoControls"
import Icon from "../components/ui/Icon"
import Layout from "../components/layout/Layout"
import Materials from "../components/index/Materials"
import Notification from "../components/ui/Notification"
import CircledText from "../components/misc/CircledText"
import PageIcons from "../components/customize/PageIcons"
import Progress from "../components/ui/Progress"
import Reviews from "../components/index/Reviews"
import TabContent from "../components/index/TabContent"
import Tag from "../components/ui/Tag"
import TextLink from "../components/ui/TextLink"
import { Flexbox } from "../components/layout/Flexbox"
import { Patterns, Pattern } from "../components/misc/Patterns"
import { SectionMain, Section, SectionContent, SectionHeading } from "../components/layout/Section"
import { Tabs } from "../components/ui/Tabs"

const IndexPage = ({ data }) => {
  const { tabImages } = data
  const tabList = ["Paper", "Cover", "Lamination", "Binding"]
  const [activeTab, setActiveTab] = useState(0)
  const [pageData, setPageData] = useState({
    alignmentHorizontal: "center",
    alignmentVertical: "top",
    angle: 60,
    ascSpacing: 5,
    borderData: {
      sync: true,
      toggle: true,
      strokeWidth: 0.088,
      opacity: 1,
    },
    columns: 99,
    columnSpacing: 5,
    dashedLineData: {
      sync: true,
      strokeWidth: 0.088,
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
  })
  const leftPageData = {
    template: ""
  }
  const rightPageData = {
    template: ""
  }
  const [svgLoaded, setSvgLoaded] = useState(false)

  return (
    <Layout
      seoDetails={{
        title: "Made-to-order custom notebooks crafted with your unique, custom printed pages and layouts",
      }}
    >
      <Patterns 
        color={colors.gray.oneHundred} 
      />
      <SectionMain>
        <Section
          backgroundimage={heroImage}
          height="calc(100vh - 109.5px)"
        >
          <SectionContent
            padding={`${spacing.xlarge} 0`}
          >
            <Container xl lg md sm xs>
              <Row justify="center">
                <Col xl={5} lg={5} offset={{ sm: 2, lg: 0 }} sm={8}>
                  <Content
                    paragraphfontsize="1.25rem"
                    smallfontsize="0.8rem"
                    margin="112px 0 0"
                    h1margin="0 0 32px"
                    headingtextalign="center"
                    paragraphtextalign="center"
                    textalign="center"
                  >
                    <h1>Made-to-order<br /><CircledText text="custom" /><span>&nbsp;notebooks</span></h1>
                    <p>Fully customize the layout of every page - from dot thickness to line spacing - and create your own unique, custom-made notebook.</p>
                    <Button
                      as={Link}
                      to="/products/notebooks/pro-wired-notebook-a5-custom/white/"
                      padding="16px 32px"
                      margin="16px 0"
                      fontsize="1.25rem"
                    >
                      <span>Shop notebooks</span>
                      <Icon
                        margin="0 0 0 4px"
                      >
                        <ArrowRight 
                          color={colors.gray.oneHundred} 
                          weight="bold"
                        />
                      </Icon>
                    </Button>
                  </Content>
                </Col>
              </Row>
            </Container>
          </SectionContent>
          <Notification
            backgroundcolor={colors.yellow.threeHundred}
            color={colors.gray.nineHundred}
            className="is-pulsating"
            borderradius="16px"
            padding="16px"
            boxshadow={colors.shadow.layeredLarge}
            align="center"
            justify="center"
            as={Link}
            to="/products/notebooks/pro-wired-notebook-a5-custom/white/"
            style={{
              position: 'absolute',
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "-5%",
            }}
          >
            <Icon
              margin="0 8px 0 0"
            >
              <MegaphoneSimple
                size={20}
                weight="duotone"
                color={colors.yellow.sixHundred}
              />
            </Icon>
            <span><b>Early Access Sale! Get 25% off all notebooks for a limited time.</b></span>
          </Notification>
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
                    <p>With Notesmith, you can customize every single page to your needs. Simply tweak conventional grid styles to your fancy, or create an entirely new layout that works for you.</p>
                  </Content>
                  <Button
                    className="has-icon"
                    fontsize="1.25rem"
                    padding="16px 32px"
                    as={Link}
                    to="/products/notebooks/pro-wired-notebook-a5-custom/white/"
                  >
                    <span>Shop now</span>
                    <Icon
                      margin="0 0 0 4px"
                    >
                      <ArrowRight 
                        color={colors.gray.oneHundred} 
                        weight="bold"
                      />
                    </Icon>
                  </Button>
                </Col>
                <Col md={6} lg={4}>
                  <Book3d 
                    pageData={pageData}
                    setPageData={setPageData}
                    svgLoaded={svgLoaded}
                    setSvgLoaded={setSvgLoaded}
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
                      align="flex-start"
                      justify="space-between"
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
                    align="flex-end"
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
                      hideNone
                      hideBlank
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
                  {pageData.template && (
                    <Flexbox
                      flex="flex"
                      align="center"
                      justify="center"
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
                  )}
                  <hr />
                  <Notification
                    backgroundcolor={colors.gray.oneHundred}
                    borderradius="16px"
                  >
                    <Flexbox
                      flex="flex"
                      align="flex-start"
                      margin="0"
                    >
                      <Icon margin="0 0 0">
                        <Note size={24} weight="light" color={colors.gray.sixHundred} />
                      </Icon>
                      <Content
                        margin="0 0 0 8px"
                        smallmargin="0"
                        smallfontsize="1rem"
                      >
                        <small>This demo is only a quick example. Our editor has more advanced features and options.</small>
                      </Content>
                    </Flexbox>
                  </Notification>
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
                  <Materials 
                    tab={tabList[activeTab]}
                  />
                </Col>
                <Col lg={8}>
                  <Tabs 
                    tabList={tabList}
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
            padding={`${spacing.xlarge} 0`}
          >
            <Container xl lg md sm xs>
              <Row justify="center">
                <Col xl={5} lg={5} offset={{ sm: 2, lg: 0 }} sm={8}>
                  <Content
                    h3fontsize="2rem"
                    h3color={colors.gray.oneHundred}
                    h3margin="0 0 16px"
                    paragraphcolor={colors.gray.fourHundred}
                    paragraphfontsize="1.25rem"
                    textalign="center"
                  >
                    <h3>Early Access Sale is now live!</h3>
                    <p>
                      During the Early Access Sale, all notebooks are 25% off! You can create your custom notebook by going to the link below.
                    </p>
                    <Button
                      as={Link}
                      to="/products/notebooks/pro-wired-notebook-a5-custom/white/"
                      padding="16px 32px"
                      margin="16px 0"
                      fontsize="1.25rem"
                      border={`1px solid ${colors.gray.oneHundred}`}
                    >
                      <span>Shop notebooks</span>
                      <Icon
                        margin="0 0 0 4px"
                      >
                        <ArrowRight
                          color={colors.gray.oneHundred}
                          weight="bold"
                        />
                      </Icon>
                    </Button>
                  </Content>
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
                  <div>
                    <Flexbox
                      padding="16px 0"
                      flex="flex"
                      align="center"
                      justify="space-between"
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
                      align="center"
                      justify="space-between"
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
                      align="center"
                      justify="space-between"
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
                  </div>
                </Col>
                <Col lg={8}>
                  <Flexbox
                    justify="center"
                  >
                    <StaticImage
                      src="../images/index/writing-closeup.jpg"
                      alt="Close up of writing done with black ink on our paper"
                      loading="eager"
                      quality={50}
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
                  <Notification
                    backgroundcolor={colors.gray.oneHundred}
                    borderradius="16px"
                  >
                    <Flexbox
                      flex="flex"
                      align="flex-start"
                    >
                      <Icon>
                        <Note color={colors.gray.sixHundred} weight="light" size={20} />
                      </Icon>
                      <Content
                        margin="0 0 0 8px"
                        smallmargin="0"
                        smallfontsize="1rem"
                      >
                        <small>Quotes represent real words from real users with fake names.</small>
                      </Content>
                    </Flexbox>
                  </Notification>
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
            placeholder: BLURRED
            quality: 90
          )
        }
      }
    }
  }
`

export default IndexPage