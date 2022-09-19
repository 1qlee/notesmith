import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import { Star, ArrowUpRight, WarningCircle, ArrowRight } from "phosphor-react"
import { colors, fonts, spacing, widths } from "../styles/variables"
import { StaticImage } from "gatsby-plugin-image"
import "../components/index/index.css"

import { BoxList, BoxListImages } from "../components/index/BoxList"
import { Container, LayoutContainer } from "../components/layout/Container"
import { Flexbox } from "../components/layout/Flexbox"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import { StyledLabel } from "../components/form/FormComponents"
import Book3d from "../components/index/Book3d"
import Button from "../components/Button"
import BoxText from "../components/index/BoxText"
import CircledText from "../components/CircledText"
import Content from "../components/Content"
import DemoControls from "../components/index/DemoControls"
import Icon from "../components/Icon"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import Notification from "../components/ui/Notification"
import PageIcons from "../components/customize/PageIcons"
import Pattern from "../components/misc/Patterns"
import Progress from "../components/ui/Progress"
import Reviews from "../components/index/Reviews"
import Seo from "../components/layout/Seo"
import TextLink from "../components/TextLink"
import { Tabs } from "../components/ui/Tabs"
import Tag from "../components/ui/Tag"
import SectionHeading from "../components/index/SectionHeading"
import TabContent from "../components/index/TabContent"
import PageDemoCarousel from "../components/index/PageDemoCarousel"

const IndexPage = ({ data }) => {
  const { tabImages } = data
  const [activeTab, setActiveTab] = useState(0)
  const [pageData, setPageData] = useState({
    alignmentHorizontal: "center",
    alignmentVertical: "top",
    angle: 30,
    ascSpacing: 5,
    columns: 27,
    dscSpacing: 5,
    groupSpacing: 5,
    hexagonRadius: 1,
    lineWidth: 100,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    opacity: 1,
    pageHeight: 607,
    pageWidth: 366,
    radius: 0.1,
    rows: 42,
    show: false,
    size: 1,
    slantAngle: 55,
    slants: 21,
    slantSpacing: 5,
    spacing: 3,
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
  const borderData = {
    sync: true,
    toggle: false,
    thickness: 0.088,
    opacity: 1,
  }
  const dashedLineData = {
    sync: true,
    thickness: 0.088,
    opacity: 1,
    dashArray: "",
    dashOffset: 0,
  }

  return (
    <Layout>
      <Seo title="Made-to-order notebooks crafted with your unique, custom printed pages" />
      <Nav hideNavbar={false}></Nav>
      <SectionMain>
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  className="stack-columns-950"
                  columns="1fr 2fr"
                  columnGap={spacing.large}
                  rowGap={spacing.large}
                >
                  <Cell>
                    <Flexbox>
                      <Pattern
                        width={300}
                        height={300}
                        top="-100px"
                        left="-120px"
                        pattern="pattern-34"
                        color={colors.gray.threeHundred}
                        zindex="1"
                      />
                      <Content
                        background={colors.white}
                        paragraphfontsize="1.25rem"
                        smallfontsize="0.8rem"
                        style={{ position: 'relative', zIndex: "3" }}
                        margin="0 0 2rem"
                        h1margin="0 0 2rem"
                        maxwidth={widths.content.index}
                      >
                        <h1>Design <CircledText text="custom" /> notebooks</h1>
                        <p>Fully customize the layout of every page - from dot thickness to line spacing - and create your own unique, custom-made notebook.</p>
                      </Content>
                      <Notification
                        padding="16px"
                        maxwidth={widths.notification}
                      >
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
                            borderradius="16px"
                            color={colors.yellow.nineHundred}
                          >
                            Announcement
                          </Tag>
                          <h3>Join the open beta</h3>
                          <p>Create an account to participate in the open beta. During this time, you will have full access to all Notesmith features and <i>all notebooks you purchase are discounted</i>.</p>
                          <a
                            href="https://www.kickstarter.com"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <Button
                              backgroundcolor={colors.gray.nineHundred}
                              color={colors.gray.oneHundred}
                              padding="1rem"
                              width="100%"
                            >
                              <span>Create an account</span>
                              <Icon>
                                <ArrowUpRight size="1rem" color={colors.gray.nineHundred} />
                              </Icon>
                            </Button>
                          </a>
                        </Content>
                      </Notification>
                    </Flexbox>
                  </Cell>
                  <Cell>
                    <PageDemoCarousel />
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <SectionHeading>
                  Signature custom notebook
                </SectionHeading>
                <Grid
                  columns="repeat(3, 1fr)"
                  columnGap={spacing.large}
                  rowGap={spacing.large}
                  className="autofit-columns-1195"
                >
                  <Grid
                    columns="1fr"
                  >
                    <Cell>
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
                        <h2>Notebooks with your custom layouts on <b>every single page</b></h2>
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
                          to="/products/notebooks/wired-notebook-a5/white"
                          fontfamily={fonts.secondary}
                          texttransform="uppercase"
                        >
                          Learn More
                        </TextLink>
                        <Icon
                          margin="0 0 0 0.25rem"
                        >
                          <ArrowRight size="1rem" color={colors.gray.nineHundred} weight="bold" />
                        </Icon>
                      </Flexbox>
                    </Cell>
                  </Grid>
                  <Cell>
                    <Book3d 
                      borderData={borderData}
                      dashedLineData={dashedLineData}
                      pageData={pageData}
                      setPageData={setPageData}
                    />
                  </Cell>
                  <Cell>
                    <StyledLabel
                      margin="0 0 1rem"
                    >
                      Select a layout
                    </StyledLabel>
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
                          template: "",
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
                    <Content
                      margin="1rem 0 0">
                      <small>This demo is only a quick example. Our editor has more advanced features and options.</small>
                    </Content>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <SectionHeading>
                  High quality materials
                </SectionHeading>
                <Grid
                  columns="1fr 2fr"
                  columnGap={spacing.large}
                  className="stack-columns-600 autofit-columns-1195"
                >
                  <Cell>
                    <Content
                      h2fontweight="400"
                      h2margin="0 0 2rem"
                      paragraphfontsize="1.25rem"
                      paragraphmarginbottom="1rem"
                      margin="0 0 32px"
                      maxwidth={widths.content.index}
                    >
                      <h2>Notebooks created with carefully curated components</h2>
                      <p>From the beginning, our only goal was to create an outstanding notebook - nothing more, nothing less. From cover to cover, our notebooks are built with high quality materials only.</p>
                    </Content>
                    <Grid
                      columns="repeat(auto-fit, minmax(120px, 1fr))"
                      columnGap={spacing.normal}
                    >
                      <Cell>
                        <BoxText>
                          <h3>Made-to-order</h3>
                          <p>Every notebook is custom made upon receiving an order.</p>
                        </BoxText>
                      </Cell>
                      <Cell>
                        <BoxText>
                          <h3>American-made</h3>
                          <p>All products are manufactured in our New York factory.</p>
                        </BoxText>
                      </Cell>
                    </Grid>
                  </Cell>
                  <Cell>
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
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section
          backgroundcolor={colors.gray.nineHundred}
        >
          <Container>
            <LayoutContainer>
              <SectionContent
                padding={`${spacing.large} ${spacing.xlarge}`}
              >
                <Grid
                  columns="1fr 1fr"
                  columnGap={spacing.large}
                  className="stack-columns-600"
                >
                  <Cell>
                    <Content
                      h2fontweight="400"
                      h2fontsize="2rem"
                      h2color={colors.gray.oneHundred}
                    >
                      <h2>Notesmith is launching exclusively on Kickstarter this fall.</h2>
                    </Content>
                  </Cell>
                  <Cell>
                    <Content
                      paragraphcolor={colors.gray.oneHundred}
                      paragraphfontsize="1.25rem"
                    >
                      <p>
                        Please follow our Kickstarter campaign to be notified of our launch. You will be subscribed to updates, news, and more information regarding Notesmith and our products.
                      </p>
                    </Content>
                    <Flexbox
                      flex="flex"
                      alignitems="center"
                      margin="16px 0 0"
                    >
                      <TextLink
                        href="https://www.kickstarter.com"
                        color={colors.gray.oneHundred}
                        target="_blank"
                        rel="noopener noreferrer"
                        texttransform="uppercase"
                        fontweight="700"
                        underlinecolor={colors.gray.oneHundred}
                      >
                        Follow us on Kickstarter
                      </TextLink>
                      <Icon
                        margin="0 0 0 8px"
                      >
                        <ArrowRight 
                          size="1rem" 
                          color={colors.gray.oneHundred} 
                          weight="bold"
                        />
                      </Icon>
                    </Flexbox>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <SectionHeading>
                  Fountain pen friendly
                </SectionHeading>
                <Grid
                  columns="repeat(3, 1fr)"
                  columnGap={spacing.large}
                  className="stack-columns-600 autofit-columns-1195"
                >
                  <Grid
                    columns="1fr"
                  >
                    <Cell>
                      <Content
                        paragraphfontsize="1.25rem"
                        margin="0 0 2rem 0"
                        h2margin="0 0 2rem 0"
                        h2fontweight="400"
                        maxwidth={widths.content.index}
                      >
                        <h2>Notebooks stuffed with smooth, ink-loving paper</h2>
                        <p>After testing over 50 kinds of paper, we settled on the one that had the best results with multiple inks. This white, super-smooth paper scored high marks on bleeding, ghosting, and feathering tests among early users.</p>
                      </Content>
                      <Flexbox
                        padding="1rem 0"
                        flex="flex"
                        alignitems="center"
                        justifycontent="space-between"
                        className="has-border-bottom"
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
                          padding="0.25rem"
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
                        padding="1rem 0"
                        flex="flex"
                        alignitems="center"
                        justifycontent="space-between"
                        className="has-border-bottom"
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
                          padding="0.25rem"
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
                        padding="1rem 0"
                        flex="flex"
                        alignitems="center"
                        justifycontent="space-between"
                        className="has-border-bottom"
                        margin="0 0 1rem"
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
                          padding="0.25rem"
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
                        margin="1rem 0 0"
                      >
                        <Icon>
                          <WarningCircle />
                        </Icon>
                        <Content
                          margin="0 0 0 0.25rem"
                          smallmargin="0"
                        >
                          <small>Results are from a survey conducted on early test users.</small>
                        </Content>
                      </Flexbox>
                    </Cell>
                  </Grid>
                  <Cell>
                    <StaticImage
                      src="../images/index/ink-on-paper-2.jpg"
                      alt="Ink on paper"
                      placeholder="tracedSVG"
                      loading="eager"
                      quality={100}
                    />
                    <StaticImage
                      src="../images/index/ink-on-paper-3.jpg"
                      alt="Ink on paper"
                      placeholder="tracedSVG"
                      loading="eager"
                      quality={100}
                    />
                  </Cell>
                  <Cell>
                    <StaticImage
                      src="../images/index/ink-on-paper-vertical.jpg"
                      alt="Ink on paper"
                      loading="eager"
                      placeholder="tracedSVG"
                      quality={100}
                    />
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <SectionHeading>
                  Early reviews
                </SectionHeading>
                <Grid
                  columns="1fr 2fr"
                  columnGap={spacing.large}
                  className="stack-columns-600 autofit-columns-1195"
                >
                  <Cell>
                    <Content
                      h2margin="0 0 2rem"
                      h2fontweight="400"
                      paragraphfontsize="1.25rem"
                      margin="0 0 2rem"
                      maxwidth={widths.content.index}
                    >
                      <h2>Feedback from our early test users</h2>
                      <p>Read what some of our early test users had to say about their experience with Notesmith. Please note that users have been cartoonized for anonymity.</p>
                    </Content>
                  </Cell>
                  <Cell>
                    <Reviews />
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
            width: 928
            placeholder: BLURRED
            quality: 100
          )
        }
      }
    }
  }
`

export default IndexPage
