import React, { useState, useEffect } from "react"
import { graphql, navigate } from "gatsby"
import { spacing, convertToPx, fonts, convertToMM, widths } from "../../../../styles/variables"
import { ToastContainer, toast } from 'react-toastify'
import "../../../../styles/gallery.css"

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
  const [currentPageSide, setCurrentPageSide] = useState("right")
  const canvasPageSize = {
    height: 816,
    width: 528,
  }
  const [bookData, setBookData] = useState({
    ...productData,
    coverColor: coverColor,
  })
  const pageHeight = bookData.heightPixel - convertToPx(6.35)
  const pageWidth = bookData.widthPixel - convertToPx(13.335)
  const [selectedPageSvg, setSelectedPageSvg] = useState("")
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
    contentHeight: convertToMM(pageHeight),
    contentWidth: convertToMM(pageWidth),
    dashedLineData: {
      sync: true,
      thickness: 0.088,
      opacity: 1,
      dashArray: "",
      dashOffset: 0,
    },
    dscSpacing: 5,
    groupSpacing: 5,
    hexagonRadius: 1,
    lineWidth: 100,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    opacity: 1,
    pageHeight: pageHeight,
    pageWidth: pageWidth,
    radius: 0.1,
    rows: 42,
    show: false,
    size: 1,
    slantAngle: 55,
    slants: 20,
    slantSpacing: 5,
    spacing: 5,
    template: "",
    thickness: 0.088,
    xHeight: 5,
  })
  const [leftPageData, setLeftPageData] = useState({})
  const [rightPageData, setRightPageData] = useState({})
  const [pageContentSize, setPageContentSize] = useState({})
  const [cartThumbnail, setCartThumbnail] = useState([])
  const workingPageHeight = canvasPageSize.height - convertToPx(6.35)
  const workingPageWidth = canvasPageSize.width - convertToPx(13.335)

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
  }, [bookData.coverColor, coverColor])

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
                  columns="300px 1fr 400px"
                  columnGap={spacing.large}
                >
                  {pageData.show ? (
                    <>
                      <Cell>
                        <ProductControls
                          canvasPageSize={canvasPageSize}
                          currentPageSide={currentPageSide}
                          pageContentSize={pageContentSize}
                          pageData={pageData}
                          selectedPageSvg={selectedPageSvg}
                          setCurrentPageSide={setCurrentPageSide}
                          setLeftPageData={setLeftPageData}
                          setPageData={setPageData}
                          setRightPageData={setRightPageData}
                          toast={toast}
                        />
                      </Cell>
                      <Cell center>
                        <ProductTemplate
                          bookData={bookData}
                          canvasPageSize={canvasPageSize}
                          currentPageSide={currentPageSide}
                          pageData={pageData}
                          setPageContentSize={setPageContentSize}
                          setPageData={setPageData}
                          setSelectedPageSvg={setSelectedPageSvg}
                          workingPageHeight={workingPageHeight}
                          workingPageWidth={workingPageWidth}
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
