import React, { useState, useEffect } from "react"
import { graphql, navigate } from "gatsby"
import { colors, convertToPx, spacing, pageMargins } from "../../../../styles/variables"
import { toast } from 'react-toastify'

import { Container, Row, Col, setConfiguration } from 'react-grid-system'
import { SectionMain, Section, SectionContent } from "../../../../components/layout/Section"
import Layout from "../../../../components/layout/Layout"
import Toastify from "../../../../components/ui/Toastify"
import Nav from "../../../../components/layout/Nav"
import ProductImages from "../../../../components/shop/ProductImages"
import ProductInfo from "../../../../components/shop/ProductInfo"
import Seo from "../../../../components/layout/Seo"
import ProductTemplate from "../../../../components/customize/product/ProductTemplate"
import ProductControls from "../../../../components/customize/product/ProductControls"
import ProductDescription from "../../../../components/shop/ProductDescription"
import ProductSplash from "../../../../components/shop/ProductSplash"
import ProductHalfandHalf from "../../../../components/shop/ProductHalfandHalf"
import ProductHero from "../../../../components/shop/ProductHero"

const ProductPage = ({ data, params }) => {
  const { productData, productImages, productThumbnails, splashImage, halfandhalfImages } = data
  const sortedHalfandhalfImages = halfandhalfImages.nodes.sort((a, b) => {
    return a.name > b.name ? 1 : -1
  })
  const { coverColor } = params
  const { heightPixel, widthPixel } = productData
  const svgHeight = heightPixel
  const svgWidth = widthPixel
  const [bookData, setBookData] = useState({
    ...productData,
    coverColor: coverColor,
  })
  const defaultPageData = {
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
    maxContentHeight: svgHeight - pageMargins.vertical,
    maxContentWidth: svgWidth - pageMargins.horizontal,
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
    svgHeight: svgHeight,
    svgWidth: svgWidth,
    template: "",
    thickness: 0.088,
    xHeight: 5,
  }
  const [pageData, setPageData] = useState(defaultPageData)
  const [svgSize, setSvgSize] = useState({
    height: bookData.heightPixel - pageMargins.vertical,
    width: bookData.widthPixel - pageMargins.horizontal,
  })
  const [maxSvgSize, setMaxSvgSize] = useState({})
  const [currentPageSide, setCurrentPageSide] = useState("both")
  const [selectedPageSvg, setSelectedPageSvg] = useState("")
  const [leftPageData, setLeftPageData] = useState({})
  const [rightPageData, setRightPageData] = useState({})
  const [cartThumbnail, setCartThumbnail] = useState([])
  const [showControls, setShowControls] = useState(false)

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
  }, [productData, bookData, coverColor, pageData])

  return (
    <Layout>
      <Seo title={bookData.name} />
      <Nav />
      <SectionMain>
        <Section>
          <SectionContent padding={`${spacing.large} 0`}>
            <Container xs sm md lg xl>
              <Row>
                {pageData.show ? (
                  <>
                    <Col sm="content" md="content" lg="content" xl="content" xxl="content">
                      <ProductControls
                        currentPageSide={currentPageSide}
                        pageData={pageData}
                        showControls={showControls}
                        selectedPageSvg={selectedPageSvg}
                        setShowControls={setShowControls}
                        setCurrentPageSide={setCurrentPageSide}
                        setLeftPageData={setLeftPageData}
                        setPageData={setPageData}
                        setRightPageData={setRightPageData}
                        svgSize={svgSize}
                        toast={toast}
                      />
                    </Col>
                    <Col sm="content" md="content" lg="content" xl="content" xxl="content">
                      <ProductTemplate
                        bookData={bookData}
                        maxSvgSize={maxSvgSize}
                        currentPageSide={currentPageSide}
                        pageData={pageData}
                        setPageData={setPageData}
                        setSelectedPageSvg={setSelectedPageSvg}
                        setSvgSize={setSvgSize}
                      />
                    </Col>
                  </>
                ) : (
                  <Col xl={8} lg={8} xxl={8} md={8}>
                    <ProductImages
                      coverColor={coverColor}
                      productImages={productImages}
                      productThumbnails={productThumbnails}
                      setCartThumbnail={setCartThumbnail}
                    />
                  </Col>
                )}
                <Col>
                  <ProductInfo
                    bookData={bookData}
                    cartThumbnail={cartThumbnail}
                    leftPageData={leftPageData}
                    rightPageData={rightPageData}
                    defaultPageData={defaultPageData}
                    pageData={pageData}
                    setLeftPageData={setLeftPageData}
                    setRightPageData={setRightPageData}
                    setBookData={setBookData}
                    setPageData={setPageData}
                    toast={toast}
                  />
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
        <ProductDescription 
          bookData={bookData}
          headingText="High quality materials"
        />
        {sortedHalfandhalfImages.map((image, index) => (
          <ProductHalfandHalf
            image={image}
            bookData={bookData}
            direction={index % 2 === 0 ? "left" : "right"}
          />
        ))}
        <ProductSplash 
          image={splashImage}
          backgroundcolor={colors.gray.oneHundred}
        />
        <ProductHero 
          bookData={bookData}
        />
      </SectionMain>
      <Toastify />
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
      halfandhalf {
        heading
        text
      }
      heightInch
      heightPixel
      name
      numOfPages
      paperColor
      paperTooth
      paperWeight
      infoList
      price
      size
      slug
      stripePriceId
      weight
      widthInch
      widthPixel
      hero {
        heading
        text
      }
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
        name
        childImageSharp {
          gatsbyImageData(
            width: 800
            quality: 100
          )
        }
      }
    }
    splashImage: allFile(filter: { relativeDirectory: { eq: $slug } name: { eq: "splash" }}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            width: 1200
            quality: 100
          )
        }
      }
    }
    halfandhalfImages: allFile(filter: { relativeDirectory: { eq: $slug } name: { glob: "halfandhalf*" }}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            width: 500
            quality: 100
          )
        }
      }
    }
    productThumbnails: allFile(filter: { relativeDirectory: { eq: $slug }}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            width: 80
            height: 80
            quality: 100
          )
        }
      }
    }
  }
`

export default ProductPage
