import React, { useState, useEffect } from "react"
import { graphql, navigate } from "gatsby"
import { spacing, convertToPx, fonts, convertToMM } from "../../../../styles/variables"
import { ToastContainer, toast } from 'react-toastify'
import "../../../../styles/gallery.css"

import { Container, LayoutContainer } from "../../../../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../../../../components/layout/Section"
import { Flexbox } from "../../../../components/layout/Flexbox"
import Layout from "../../../../components/layout/Layout"
import Nav from "../../../../components/layout/Nav"
import ProductInfo from "../../../../components/shop/ProductInfo"
import Seo from "../../../../components/layout/Seo"
import Template from "../../../../components/customize/pageComponents/Template"
import ProductImages from "../../../../components/shop/ProductImages"
import Templatesbar from "../../../../components/customize/bars/Templatesbar"

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
  const [selectedTemplate, setSelectedTemplate] = useState({
    alignmentHorizontal: "center",
    alignmentVertical: "top",
    ascSpacing: 5,
    dscSpacing: 5,
    xHeight: 5,
    slantSpacing: 5,
    slantAngle: 55,
    slants: 20,
    angle: 30,
    columns: 27,
    contentHeight: convertToMM(pageHeight),
    contentWidth: convertToMM(pageWidth),
    radius: 0.1,
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
    rows: 42,
    show: false,
    spacing: 5,
    template: "",
    thickness: 0.088,
    size: 1,
  })
  const [borderData, setBorderData] = useState({
    sync: true,
    toggle: true,
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
                  columns="repeat(auto-fit,minmax(120px,1fr))"
                  columnGap={spacing.large}
                >
                  <Cell width={4}>
                    {selectedTemplate.show ? (
                      <Flexbox
                        flex="flex"
                      >
                        <Templatesbar
                          borderData={borderData}
                          canvasPageSize={canvasPageSize}
                          currentPageSide={currentPageSide}
                          dashedLineData={dashedLineData}
                          pageContentSize={pageContentSize}
                          pageData={selectedTemplate}
                          selectedPageSvg={selectedPageSvg}
                          setBorderData={setBorderData}
                          setCurrentPageSide={setCurrentPageSide}
                          setDashedLineData={setDashedLineData}
                          setLeftPageData={setLeftPageData}
                          setPageData={setSelectedTemplate}
                          setRightPageData={setRightPageData}
                          toast={toast}
                        />
                        <Template
                          borderData={borderData}
                          bookData={bookData}
                          canvasPageSize={canvasPageSize}
                          currentPageSide={currentPageSide}
                          dashedLineData={dashedLineData}
                          pageData={selectedTemplate}
                          setPageContentSize={setPageContentSize}
                          setPageData={setSelectedTemplate}
                          setSelectedPageSvg={setSelectedPageSvg}
                          selectedTemplate={selectedTemplate}
                          workingPageHeight={workingPageHeight}
                          workingPageWidth={workingPageWidth}
                        />
                      </Flexbox>
                    ) : (
                      <ProductImages
                        coverColor={coverColor}
                        productImages={productImages}
                        productThumbnails={productThumbnails}
                        setCartThumbnail={setCartThumbnail}
                      />
                    )}
                  </Cell>
                  <Cell width={2}>
                    <ProductInfo
                      bookData={bookData}
                      cartThumbnail={cartThumbnail}
                      leftPageData={leftPageData}
                      rightPageData={rightPageData}
                      selectedTemplate={selectedTemplate}
                      setBookData={setBookData}
                      setSelectedTemplate={setSelectedTemplate}
                      toast={toast}
                    />
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
        theme="dark"
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
