import React, { useState, useEffect } from "react"
import { graphql, navigate } from "gatsby"
import { spacing, convertToPx, fonts, pageMargins, widths } from "../../../../styles/variables"
import { ToastContainer, toast } from 'react-toastify'

import { Container, LayoutContainer } from "../../../../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../../../../components/layout/Section"
import Content from "../../../../components/Content"
import Layout from "../../../../components/layout/Layout"
import Nav from "../../../../components/layout/Nav"
import ProductImages from "../../../../components/shop/ProductImages"
import ProductInfo from "../../../../components/shop/ProductInfo"
import Seo from "../../../../components/layout/Seo"
import ProductTemplate from "../../../../components/customize/product/ProductTemplate"
import ProductControls from "../../../../components/customize/product/ProductControls"

const ProductPage = ({ data, params }) => {
  const { productData, productImages, productThumbnails } = data
  const { coverColor } = params
  const [bookData, setBookData] = useState({
    ...productData,
    coverColor: coverColor,
  })
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
    maxContentHeight: bookData.heightPixel - pageMargins.vertical,
    maxContentWidth: bookData.widthPixel - pageMargins.horizontal,
    opacity: 1,
    radius: 0.1,
    rows: 42,
    rowSpacing: 5,
    show: false,
    crossSize: 1,
    slantAngle: 55,
    slants: 20,
    slantSpacing: 5,
    spacing: 5,
    staffSpacing: 5,
    staves: 9,
    svgHeight: bookData.heightPixel,
    svgWidth: bookData.widthPixel,
    template: "",
    thickness: 0.088,
    xHeight: 5,
  })
  const [svgSize, setSvgSize] = useState({
    height: bookData.heightPixel - pageMargins.vertical,
    width: bookData.widthPixel - pageMargins.horizontal,
  })
  const [maxSvgSize, setMaxSvgSize] = useState({})
  const [currentPageSide, setCurrentPageSide] = useState("right")
  const [selectedPageSvg, setSelectedPageSvg] = useState("")
  const [leftPageData, setLeftPageData] = useState({})
  const [rightPageData, setRightPageData] = useState({})
  const [cartThumbnail, setCartThumbnail] = useState([])

  useEffect(() => {
    // if there is no coverColor or coverColor does not exist
    if (!coverColor || !bookData.colors.find(color => color.slug === coverColor)) {
      const defaultCoverColor = bookData.colors[0].slug
      // redirect the user to the first color by default
      navigate(`/products/${bookData.category}/${bookData.slug}/${defaultCoverColor}`, { replace: true })
      setBookData({
        ...productData,
        coverColor: defaultCoverColor
      })
    }
    else {
      // else navigate to appropriate coverColor
      navigate(`/products/${bookData.category}/${bookData.slug}/${bookData.coverColor}`, { replace: true })
    }

    setMaxSvgSize({
      height: pageData.maxContentHeight - convertToPx(pageData.marginTop) - convertToPx(pageData.marginBottom),
      width: pageData.maxContentWidth - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight),
    })
  }, [bookData, coverColor, pageData])

  return (
    <Layout>
      <Seo title={bookData.name} />
      <Nav />
      <SectionMain>
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  columns="400px 1fr 300px"
                  columnGap={spacing.large}
                >
                  <Cell>
                    <ProductInfo
                      bookData={bookData}
                      cartThumbnail={cartThumbnail}
                      leftPageData={leftPageData}
                      rightPageData={rightPageData}
                      pageData={pageData}
                      setBookData={setBookData}
                      setPageData={setPageData}
                      toast={toast}
                    />
                  </Cell>
                  {pageData.show ? (
                    <>
                      <Cell center>
                        <ProductTemplate
                          bookData={bookData}
                          maxSvgSize={maxSvgSize}
                          currentPageSide={currentPageSide}
                          pageData={pageData}
                          setPageData={setPageData}
                          setSelectedPageSvg={setSelectedPageSvg}
                          setSvgSize={setSvgSize}
                        />
                      </Cell>
                      <Cell>
                        <ProductControls
                          currentPageSide={currentPageSide}
                          pageData={pageData}
                          selectedPageSvg={selectedPageSvg}
                          setCurrentPageSide={setCurrentPageSide}
                          setLeftPageData={setLeftPageData}
                          setPageData={setPageData}
                          setRightPageData={setRightPageData}
                          svgSize={svgSize}
                          toast={toast}
                        />
                      </Cell>
                    </>
                  ) : (
                    <Cell width={2}>
                      <ProductImages
                        coverColor={coverColor}
                        productImages={productImages}
                        productThumbnails={productThumbnails}
                        setCartThumbnail={setCartThumbnail}
                      />
                    </Cell>
                  )}
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent
                padding={`${spacing.large} 0`}
                className="has-border-top"
              >
                <Grid
                  columns="1fr 3fr"
                  columnGap={spacing.large}
                >
                  <Cell>
                    <Content
                      headingfontfamily={fonts.secondary}
                      h3fontsize="1rem"
                    >
                      <h3>Product Description</h3>
                    </Content>
                  </Cell>
                  <Cell>
                    <Content
                      paragraphfontsize="1.2rem"
                      width={widths.content.normal}
                    >
                      <p>{bookData.longDescription}</p>
                    </Content>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
      <ToastContainer
        autoClose={3000}
        closeOnClick
        draggable
        draggablePercent={50}
        hideProgressBar={false}
        icon={false}
        limit={3}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        position="bottom-center"
        rtl={false}
        style={{
          fontFamily: fonts.secondary,
          fontSize: "0.75rem",
        }}
      />
    </Layout>
  )
}

export const pageQuery = graphql`
  query ProductPageQuery($id: String!, $slug: String!) {
    productData: productsJson(id: { eq: $id }) {
      camelName
      category
      description
      longDescription
      heightInch
      heightPixel
      name
      numOfPages
      paperColor
      paperTooth
      paperWeight
      price
      size
      slug
      stripePriceId
      weight
      widthInch
      widthPixel
      infoBoxes {
        heading
        text
      }
      colors {
        name
        hex
        slug
      }
    }
    productImages: allFile(filter: { relativeDirectory: { eq: $slug }}) {
      nodes {
        childImageSharp {
          fluid {
            src
            originalName
          }
          gatsbyImageData(
            width: 800
            placeholder: TRACED_SVG
            quality: 100
          )
        }
      }
    }
    productThumbnails: allFile(filter: { relativeDirectory: { eq: $slug }}) {
      nodes {
        childImageSharp {
          fluid {
            src
            originalName
          }
          gatsbyImageData(
            width: 80
            height: 80
            placeholder: TRACED_SVG
            quality: 100
          )
        }
      }
    }
  }
`

export default ProductPage
