import React, { useState } from "react"
import { Link } from "gatsby"
import { Star, ArrowCircleDown, ArrowRight, WarningCircle } from "phosphor-react"
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
import CircledText from "../components/CircledText"
import Content from "../components/Content"
import DemoControls from "../components/index/DemoControls"
import Highlight from "../components/misc/Highlight"
import Icon from "../components/Icon"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import PageCarousel from "../components/index/PageCarousel"
import PageIcons from "../components/customize/PageIcons"
import Pattern from "../components/misc/Patterns"
import Progress from "../components/ui/Progress"
import RegisterForm from "../components/form/RegisterForm"
import Reviews from "../components/index/Reviews"
import Seo from "../components/layout/Seo"
import SpineText from "../components/index/SpineText"
import Tag from "../components/ui/Tag"

const IndexPage = ({ data }) => {
  const [activeImage, setActiveImage] = useState(0)
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
  const [borderData, setBorderData] = useState({
    sync: true,
    toggle: false,
    thickness: 0.088,
    opacity: 1,
  })
  const [dashedLineData, setDashedLineData] = useState({
    sync: true,
    thickness: 0.088,
    opacity: 1,
    dashArray: "",
    dashOffset: 0,
  })
  const leftPageData = {
    template: ""
  }
  const rightPageData = {
    template: ""
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
                  className="stack-columns-600"
                  columns="1fr 2fr"
                  columnGap={spacing.large}
                  rowGap={spacing.large}
                >
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
                    >
                      <h1>Design <CircledText text="custom" /> notebooks</h1>
                      <p>Fully customize the layout of every page - from dot thickness to line spacing - and create your own unique, custom-made notebook.</p>
                    </Content>
                    <hr />
                    <Content
                      linkcolor={colors.green.nineHundred}
                      linkcolorhover={colors.green.nineHundred}
                      linktextdecorationhover="none"
                      paragraphmarginbottom="1rem"
                      margin="2rem 0 0"
                    >
                      <h3>Win a free notebook!</h3>
                      <p>Follow our Kickstarter to enter the raffle for a free notebook! Simply click the button below and then sign up to be notified of our launch.</p>
                      <a
                        href="https://www.kickstarter.com"
                        target="_blank"
                        
                      >
                        <Button
                          color={colors.gray.oneHundred}
                          backgroundcolor={colors.gray.nineHundred}
                          padding="1rem"
                          width="300px"
                        >
                          <StaticImage
                            src="../images/ks-icon.png"
                            width={16}
                            quality={100}
                            loading="eager"
                          />
                          <span style={{ marginLeft: "0.5rem" }}>Follow us on Kickstarter</span>
                        </Button>
                      </a>
                    </Content>
                  </Flexbox>
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                    flexwrap="wrap"
                    justifyContent="flex-end"
                  >
                    <StaticImage 
                      src="../images/index/shit.jpg"
                      quality={100}
                      loading="eager"
                    />
                  </Flexbox>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  columns="repeat(3, 1fr)"
                  columnGap={spacing.large}
                  rowGap={spacing.large}
                  className="autofit-columns-1195"
                >
                  <Grid
                    columns="80px 1fr"
                    columnGap={spacing.large}
                    className="stack-columns-600"
                  >
                    <Cell>
                      <SpineText
                        fontsize="2rem"
                        fontweight="700"
                      >
                        Product
                      </SpineText>
                    </Cell>
                    <Cell>
                      <Content
                        h2margin="0 0 2rem 0"
                        h2fontsize="3rem"
                        h2fontweight="400"
                        h5fontsize="0.75rem"
                        paragraphfontsize="1.2rem"
                        paragraphmarginbottom="1rem"
                        maxwidth={widths.content.index}
                        margin="0 0 2rem"
                      >
                        <h2>Our signature custom notebook</h2>
                        <p>Notesmith gives you the power to <Highlight><i>customize every single page</i></Highlight> to your needs. You can simply tweak conventional grid styles to your fancy, or create an entirely new layout that works for you.</p>
                      </Content>
                      <Button
                        backgroundcolor={colors.gray.nineHundred}
                        color={colors.gray.oneHundred}
                        border={`1px solid ${colors.gray.nineHundred}`}
                        padding="1rem"
                        as={Link}
                        to="/products/notebooks/wired-notebook-a5/white"
                      >
                        <span>Create your notebook now</span>
                        <Icon
                          margin="0 0 0 0.25rem"
                        >
                          <ArrowRight size="1.25rem" color={colors.gray.oneHundred} />
                        </Icon>
                      </Button>
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
                    <Content
                      borderbottom={`2px solid ${colors.gray.nineHundred}`}
                      h3margin="0"
                      h3fontsize="1rem"
                      headingfontfamily={fonts.secondary}
                      padding="0 0 1rem"
                      margin="0 0 2rem"
                    >
                      <Flexbox
                        flex="flex"
                        alignitems="center"
                      >
                        <h3>Check out the demo</h3>
                        <Icon margin="0 0 0 0.25rem">
                          <ArrowCircleDown size="1.25rem" color={colors.gray.nineHundred} weight="fill" />
                        </Icon>
                      </Flexbox>
                    </Content>
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
                <Grid
                  columns="repeat(3, 1fr)"
                  columnGap={spacing.large}
                  className="stack-columns-600 autofit-columns-1195"
                >
                  <Grid
                    columns="80px 1fr"
                    columnGap={spacing.large}
                    className="stack-columns-600"
                  >
                    <Cell>
                      <SpineText
                        fontweight="700"
                        fontsize="2rem"
                      >
                        Specifications
                      </SpineText>
                    </Cell>
                    <Cell>
                      <Content
                        h2fontweight="400"
                        h2margin="0 0 2rem"
                        paragraphfontsize="1.2rem"
                        paragraphmarginbottom="1rem"
                      >
                        <h2>Crafted with high quality materials</h2>
                        <p>From cover to cover, our notebooks are built with thoughtfully curated components without cutting corners.</p>
                        <p>Every custom notebook is <Highlight><i>made to order</i></Highlight> in our New York factory by experienced printing veterans.</p>
                      </Content>
                    </Cell>
                  </Grid>
                  <Cell>
                    <BoxList
                      margin="0 0 1rem"
                      activeImage={activeImage}
                      setActiveImage={setActiveImage}
                    />
                    <hr />
                    <Flexbox
                      flex="flex"
                      margin="1rem 0 0"
                      alignitems="flex-start"
                    >
                      <Icon>
                        <WarningCircle />
                      </Icon>
                      <Content
                        margin="0 0 0 0.25rem"
                        smallmargin="0"
                      >
                        <small>Since we are still in the early stages of development, all specifications may be subject to change.</small>
                      </Content>
                    </Flexbox>
                  </Cell>
                  <Cell>
                    <BoxListImages />
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
                <Grid
                  columns="repeat(3, 1fr)"
                  columnGap={spacing.large}
                  className="stack-columns-600 autofit-columns-1195"
                >
                  <Grid
                    columns="80px 1fr"
                    columnGap={spacing.large}
                    className="stack-columns-600"
                  >
                    <Cell>
                      <SpineText
                        fontsize="2rem"
                        fontweight="700"
                      >
                        Paper
                      </SpineText>
                    </Cell>
                    <Cell>
                      <Content
                        paragraphfontsize="1.2rem"
                        margin="0 0 2rem 0"
                        h2margin="0 0 2rem 0"
                        h2fontweight="400"
                      >
                        <h2>Fountain pen friendly paper</h2>
                        <p>Our white, super-smooth paper scored high marks on bleeding, ghosting, and feathering tests among early users.</p>
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
                <Grid
                  columns="80px 1fr"
                  columnGap={spacing.large}
                  className="stack-columns-600"
                >
                  <Cell>
                    <SpineText
                      fontsize="2rem"
                      fontweight="700"
                    >
                      Reviews
                    </SpineText>
                  </Cell>
                  <Cell>
                    <Content
                      h2margin="0 0 2rem"
                      h2fontweight="400"
                      paragraphfontsize="1.2rem"
                      width={widths.content.index}
                      margin="0 0 2rem"
                    >
                      <h2>Feedback from our early test users</h2>
                      <p>Read what some of our early test users had to say about their experience with Notesmith. (Users have been cartoonized for anonymity.)</p>
                    </Content>
                    <Reviews />
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
                <Grid
                  columns="1fr"
                  columnGap={spacing.large}
                  className="stack-columns-600"
                >
                  <Cell center middle>
                    <Content
                      h2fontweight="400"
                      h2fontsize="3rem"
                      margin="0 0 2rem"
                    >
                      <h2>Coming soon to Kickstarter</h2>
                    </Content>
                    <a
                      href="https://www.kickstarter.com"
                      target="_blank"

                    >
                      <Button
                        color={colors.gray.oneHundred}
                        backgroundcolor={colors.gray.nineHundred}
                        padding="1rem"
                        width="300px"
                      >
                        <StaticImage
                          src="../images/ks-icon.png"
                          width={16}
                          quality={100}
                          loading="eager"
                        />
                        <span style={{ marginLeft: "0.5rem" }}>Follow us on Kickstarter</span>
                      </Button>
                    </a>
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
