import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import { Star, ArrowRight, ArrowBendRightDown, Note } from "@phosphor-icons/react"
import { colors, fonts, spacing, widths } from "../styles/variables"
import { StaticImage } from "gatsby-plugin-image"
import { Container, Row, Col } from 'react-grid-system'
import heroImage from "../images/index/hero-4.jpg"

import Book3d from "../components/index/Book3d"
import Button from "../components/ui/Button"
import Content from "../components/ui/Content"
import DemoControls from "../components/index/DemoControls"
import Icon from "../components/ui/Icon"
import Layout from "../components/layout/Layout"
import Materials from "../components/index/Materials"
import Notification from "../components/ui/Notification"
import HeroContent from "../components/index/HeroContent"
import PageIcons from "../components/customize/PageIcons"
import Progress from "../components/ui/Progress"
import Reviews from "../components/index/Reviews"
import TabContent from "../components/index/TabContent"
import Tag from "../components/ui/Tag"
import { Flexbox } from "../components/layout/Flexbox"
import { SectionMain, SectionHero, Section, SectionContent, SectionHeading } from "../components/layout/Section"
import { Tabs } from "../components/ui/Tabs"
import Box from "../components/ui/Box"

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
      strokeWidth: 0.1,
      opacity: 100,
    },
    columns: 99,
    columnSpacing: 5,
    dashedLineData: {
      sync: true,
      strokeWidth: 0.1,
      opacity: 100,
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
    opacity: 100,
    radius: 0.25,
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
    strokeWidth: 0.1,
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
        title: "Custom notebooks with your custom layouts and fountain pen friendly paper",
      }}
    >
      <SectionMain>
        <SectionHero
          backgroundimage={heroImage}
          minheight="calc(100vh - 60px)"
          backgroundposition="center center"
          backgroundsize="cover"
          flex
        >
          <Container style={{flexGrow: "1"}} xl lg md sm xs>
            <HeroContent />
          </Container>
        </SectionHero>
        <Section>
          <SectionContent
            padding={`${spacing.section} 0 0`}
          >
            <Container xl lg md sm xs>
              <Box
                margin="0 0 8rem"
              >
                <Content
                  h2margin="0"
                  h2fontsize="2rem"
                  textalign="center"
                  maxwidth={widths.content.large}
                  margin="0 auto"
                >
                  <h2>Notesmith is an American brand that specializes in crafting stationery using premium materials. All of our products are manufactured in-house at our factory in New York.</h2>
                </Content>
              </Box>
              <hr />
            </Container>
          </SectionContent>
        </Section>
        <Section>
          <SectionContent>
            <Container xl lg md sm xs>
              <Row>
                <Col>
                  <SectionHeading>
                    Custom Notebook Layouts
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
                    <h2>Re-imagine conventional layouts</h2>
                    <p>With Notesmith, you can customize every single page to your needs. Simply tweak conventional grid styles to your fancy, or create an entirely new layout that works for you.</p>
                  </Content>
                  <Button
                    className="has-icon"
                    fontsize="1.25rem"
                    padding="16px 32px"
                    as={Link}
                    to="/products/notebooks/pro-wired-notebook-a5-custom/white/"
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
                  >
                    <Flexbox
                      margin="0 0 16px"
                      align="center"
                    >
                      <h5>Try out our templating demo</h5>
                    </Flexbox>
                    <p>Just click on any of the template boxes below and the layout of the book will change automatically. Use the controls to make adjustments to the layout.</p>
                  </Content>
                  <Flexbox
                    margin="0 0 16px"
                    align="flex-end"
                  >
                    <Content
                      h5margin="0"
                    >
                      <h5>Click on any page template</h5>
                    </Content>
                    <Icon margin="0 0 0 4px">
                      <ArrowBendRightDown size={16} weight="bold" color={colors.gray.nineHundred} />
                    </Icon>
                  </Flexbox>
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
                    showLabels={true}
                  />
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
                    padding="8px"
                  >
                    <Flexbox
                      flex="flex"
                      align="flex-start"
                      margin="0"
                    >
                      <Content
                        margin="0 0 0 8px"
                        smallmargin="0"
                        smallfontsize="0.75rem"
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
                    Ink friendly paper
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
                    <h2>Incredibly smooth, ink-loving paper</h2>
                    <p>We make our notebooks with incredibly smooth paper that allows for effortless gliding when writing with your favorite fountain pen or other ink-based pen. Our paper has zero bleed-through or feathering and minimal ghosting.</p>
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
                    Quality Guaranteed
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
                    <h2>Made to order with premium materials</h2>
                    <p>From cover to cover, our notebooks are built with premium quality materials sourced entirely from American vendors. Every notebook is made to order in our factory in New York.</p>
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
        <Section>
          <SectionContent>
            <Container xl lg md sm xs>
              <Row>
                <Col>
                  <SectionHeading>
                    Real user feedback
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
                    <h2>Feedback from our users</h2>
                    <p>Read what some of our users have had to say about their experience with Notesmith. (Quotes shown are real words from real users with anonymized names.)</p>
                  </Content>
                </Col>
                <Col md={6} lg={6} xl={8}>
                  <Reviews />
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
        {/* <Section
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
        </Section> */}
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