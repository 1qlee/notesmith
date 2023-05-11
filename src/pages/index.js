import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import { Star, ArrowUpRight, ArrowRight, WarningCircle } from "phosphor-react"
import { colors, fonts, spacing, widths } from "../styles/variables"
import { StaticImage } from "gatsby-plugin-image"

import { Flexbox } from "../components/layout/Flexbox"
import { Container, Row, Col } from 'react-grid-system'
import { Patterns, Pattern } from "../components/misc/Patterns"
import { SectionMain, Section, SectionContent, SectionHeading } from "../components/layout/Section"
import { StyledLabel } from "../components/form/FormComponents"
import { Tabs } from "../components/ui/Tabs"
import Book3d from "../components/index/Book3d"
import Button from "../components/ui/Button"
import CircledText from "../components/misc/CircledText"
import Content from "../components/ui/Content"
import DemoControls from "../components/index/DemoControls"
import Icon from "../components/ui/Icon"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import Note from "../components/ui/Note"
import PageDemoCarousel from "../components/index/PageDemoCarousel"
import PageIcons from "../components/customize/PageIcons"
import Philosophies from "../components/index/Philosophies"
import Progress from "../components/ui/Progress"
import Reviews from "../components/index/Reviews"
import Seo from "../components/layout/Seo"
import TabContent from "../components/index/TabContent"
import Tag from "../components/ui/Tag"
import TextLink from "../components/ui/TextLink"
import Notification from "../components/ui/Notification"

const IndexPage = ({ data }) => {
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
  const patternStyle = { position: 'relative', zIndex: "3" }

  return (
    <Layout>
      <Seo title="Made-to-order notebooks crafted with your unique, custom printed pages" />
      <Nav hideNavbar={false}></Nav>
      <SectionMain>
        <Section>
          <SectionContent>
            <Container xl lg md sm xs>
              <Row>
                <Col xl={4} lg={4} md={4}>
                  <Pattern
                    width={400}
                    height={300}
                    top="-80px"
                    left="-75px"
                    pattern="pattern-34"
                    color={colors.gray.threeHundred}
                    zindex="1"
                  />
                  <Content
                    backgroundcolor={colors.white}
                    paragraphfontsize="1.25rem"
                    smallfontsize="0.8rem"
                    style={patternStyle}
                    margin="0 0 2rem"
                    h1margin="0 0 2rem"
                  >
                    <h1>Design <CircledText text="custom" /> notebooks</h1>
                    <p>Fully customize the layout of every page - from dot thickness to line spacing - and create your own unique, custom-made notebook.</p>
                  </Content>
                  <Note>
                    <Content
                      paragraphmarginbottom="1rem"
                      h3fontsize="1rem"
                      h3margin="0.5rem 0"
                    >
                      <Tag
                        padding="4px 8px"
                        fontsize="0.625rem"
                        fontweight="700"
                        backgroundcolor={colors.yellow.threeHundred}
                        color={colors.yellow.nineHundred}
                      >
                        Announcement
                      </Tag>
                      <h3>Join the pre-order sale today!</h3>
                      <p>Pre-orders for our custom printed wired notebooks (A5) are now live! Click the button below to begin creating your very own notebook.</p>
                      <Button
                        backgroundcolor={colors.gray.nineHundred}
                        color={colors.gray.oneHundred}
                        padding="1rem"
                        width="100%"
                        as={Link}
                        to="/signup"
                      >
                        <span>Start pre-order</span>
                        <Icon>
                          <ArrowUpRight size="1rem" color={colors.gray.nineHundred} />
                        </Icon>
                      </Button>
                    </Content>
                  </Note>
                </Col>
                <Col xl={8} lg={8} md={8}>
                  <PageDemoCarousel />
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
        <Section>
          <Pattern
            width="100%"
            height="100%"
            top="0"
            left="0"
            pattern="pattern-26"
            color={colors.gray.threeHundred}
            zindex="1"
          />
          <SectionContent>
            <Philosophies 
              patternStyle={patternStyle}
            />
          </SectionContent>
        </Section>
        <Section>
          <SectionContent>
            <Container xl lg md sm xs>
              <Row>
                <SectionHeading>
                  Signature custom notebook
                </SectionHeading>
              </Row>
              <Row>
                <Col md={6} lg={4}>
                  <Content
                    h2margin="0 0 2rem 0"
                    h2fontsize="3rem"
                    h2fontweight="400"
                    h5fontsize="0.75rem"
                    paragraphfontsize="1.25rem"
                    paragraphmarginbottom="1rem"
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
                      color={colors.gray.nineHundred}
                      fontweight="700"
                      as={Link}
                      to="/products/notebooks/wired-notebook-a5-custom/white"
                      fontfamily={fonts.secondary}
                    >
                      <span>Shop notebooks</span>
                      <Icon
                        margin="0 0 0 0.25rem"
                      >
                        <ArrowRight size="1rem" color={colors.gray.nineHundred} weight="bold" />
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
                    margin="0 0 16px"
                    maxwidth={widths.content.index}
                    paragraphfontsize="1rem"
                    h5margin="0"
                    headingfontfamily={fonts.secondary}
                  >
                    <Flexbox
                      margin="0 0 16px"
                      alignitems="center"
                      className="has-border-bottom"
                      padding="0 0 16px"
                    >
                      <Tag
                        padding="4px 8px"
                        margin="0 8px 0 0"
                      >
                        Demo
                      </Tag>
                      <h5>Choose from a template below</h5>
                    </Flexbox>
                    <p>Just click on any of the template boxes below and the layout of the book will change automatically. Use the controls to make adjustments to the layout.</p>
                  </Content>
                  <Flexbox
                    flex="flex"
                    flexwrap="wrap"
                    margin="0 0 1rem"
                  >
                    <PageIcons
                      checkActiveVar={pageData.template}
                      data={pageData}
                      iconMargin="0 1rem 1rem 0"
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
                      margin="1rem 0"
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
                    alignitems="center"
                    margin="8px 0 0" 
                  >
                    <Icon>
                      <WarningCircle size={16} />
                    </Icon>
                    <Content
                      margin="0 0 0 0.25rem"
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
                <SectionHeading>
                  High quality materials
                </SectionHeading>
              </Row>
              <Row>
                <Col md={6} lg={4}>
                  <Content
                    h2fontweight="400"
                    h2margin="0 0 2rem"
                    paragraphfontsize="1.25rem"
                    paragraphmarginbottom="1rem"
                    maxwidth={widths.content.index}
                    margin="0 0 32px"
                  >
                    <h2>We use only the best stuff, guaranteed</h2>
                    <p>From the beginning, our only goal was to create an outstanding notebook - nothing more, nothing less. From cover to cover, our notebooks are built with high quality materials only.</p>
                  </Content>
                </Col>
                <Col md={6} lg={8}>
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
            padding={`${spacing.large} ${spacing.xlarge}`}
          >
            <Container xl lg md sm xs>
              <Row>
                <Col md={6}>
                  <Content
                    h2fontweight="400"
                    h2fontsize="2rem"
                    h2color={colors.gray.oneHundred}
                  >
                    <h2>Join the Notesmith pre-order sale now and enjoy an exclusive discounted price</h2>
                  </Content>
                </Col>
                <Col md={6}>
                  <Content
                    paragraphcolor={colors.gray.oneHundred}
                    paragraphfontsize="1.25rem"
                  >
                    <p>
                      During the pre-order sale, notebooks will be sold at a discounted price. Please sign up to participate in this limited time offer and come celebrate our launch together!
                    </p>
                  </Content>
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    margin="16px 0 0"
                  >
                    <TextLink
                      color={colors.gray.oneHundred}
                      fontweight="700"
                      underlinecolor={colors.gray.oneHundred}
                      as={Link}
                      to="/signup"
                    >
                      <span>Create an account now</span>
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
                <SectionHeading>
                  Fountain pen friendly
                </SectionHeading>
              </Row>
              <Row>
                <Col lg={4} md={6}>
                  <Content
                    paragraphfontsize="1.25rem"
                    margin="0 0 2rem 0"
                    h2margin="0 0 2rem 0"
                    h2fontweight="400"
                    maxwidth={widths.content.index}
                  >
                    <h2>Smooth, ink-loving paper</h2>
                    <p>After testing over 50 kinds of paper, we settled on the one that had the best results with multiple inks. This white, super-smooth paper scored high marks on bleeding, ghosting, and feathering tests among early users.</p>
                  </Content>
                  <Flexbox
                    padding="16px 0"
                    flex="flex"
                    alignitems="center"
                    justifycontent="space-between"
                    className="has-border-top"
                    bordercolor={colors.gray.nineHundred}
                  >
                    <StyledLabel
                      margin="0"
                      width="128px"
                    >
                      Bleeding
                    </StyledLabel>
                    <Progress
                      barcolor={colors.gray.nineHundred}
                      completion={93}
                      margin="0"
                      wrappercolor={colors.gray.threeHundred}
                    />
                    <Tag
                      backgroundcolor={colors.gray.nineHundred}
                      color={colors.gray.oneHundred}
                      padding="4px 6px"
                      fontfamily={fonts.secondary}
                      margin="0 0 0 0.5rem"
                    >
                      <Icon
                        margin="0 1px 1px 0"
                      >
                        <Star weight="fill" color={colors.gray.oneHundred} />
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
                    <StyledLabel
                      margin="0"
                      width="128px"
                    >
                      Feathering
                    </StyledLabel>
                    <Progress
                      barcolor={colors.gray.nineHundred}
                      completion={90}
                      margin="0"
                      wrappercolor={colors.gray.threeHundred}
                    />
                    <Tag
                      backgroundcolor={colors.gray.nineHundred}
                      color={colors.gray.oneHundred}
                      padding="4px 6px"
                      fontfamily={fonts.secondary}
                      margin="0 0 0 0.5rem"
                    >
                      <Icon
                        margin="0 1px 1px 0"
                      >
                        <Star weight="fill" color={colors.gray.oneHundred} />
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
                  >
                    <StyledLabel
                      margin="0"
                      width="128px"
                    >
                      Ghosting
                    </StyledLabel>
                    <Progress
                      barcolor={colors.gray.nineHundred}
                      completion={75}
                      margin="0"
                      wrappercolor={colors.gray.threeHundred}
                    />
                    <Tag
                      backgroundcolor={colors.gray.nineHundred}
                      color={colors.gray.oneHundred}
                      padding="4px 6px"
                      fontfamily={fonts.secondary}
                      margin="0 0 0 0.5rem"
                    >
                      <Icon
                        margin="0 1px 1px 0"
                      >
                        <Star weight="fill" color={colors.gray.oneHundred} />
                      </Icon>
                      <span>3.8</span>
                    </Tag>
                  </Flexbox>
                  <hr />
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    margin="8px 0 0"
                  >
                    <Icon>
                      <WarningCircle size={16} />
                    </Icon>
                    <Content
                      margin="0 0 0 4px"
                      smallmargin="0"
                    >
                      <small>Results are from a survey conducted on early test users.</small>
                    </Content>
                  </Flexbox>
                </Col>
                <Col lg={8} md={6}>
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
                <SectionHeading>
                  Early reviews
                </SectionHeading>
              </Row>
              <Row>
                <Col lg={4} md={6}>
                  <Content
                    h2margin="0 0 2rem"
                    h2fontweight="400"
                    paragraphfontsize="1.25rem"
                    margin="0 0 16px"
                    maxwidth={widths.content.index}
                  >
                    <h2>Feedback from our early test users</h2>
                    <p>We recently ran a test trial where we provided notebooks to over a hundred users. Read what some of them had to say about their experience with Notesmith.</p>
                  </Content>
                  <hr />
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    margin="8px 0 0"
                  >
                    <Icon>
                      <WarningCircle size={16} />
                    </Icon>
                    <Content
                      margin="0 0 0 4px"
                      smallmargin="0"
                    >
                      <small>Users have been cartoonized for anonymity. Quotes represent real reviews from actual users.</small>
                    </Content>
                  </Flexbox>
                </Col>
                <Col lg={8} md={6}>
                  <Reviews />
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
      </SectionMain>
      <Patterns color={colors.gray.twoHundred} />
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
