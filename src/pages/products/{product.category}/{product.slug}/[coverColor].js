import React, { useState, useEffect } from "react"
import { graphql, navigate } from "gatsby"
import { colors, spacing, pageMargins } from "../../../../styles/variables"
import { toast } from 'react-toastify'
import { convertToPx } from "../../../../utils/helper-functions"

import { Container, Row, Col } from 'react-grid-system'
import { SectionMain, Section, SectionContent } from "../../../../components/layout/Section"
import Layout from "../../../../components/layout/Layout"
import ProductImages from "../../../../components/customize/product/ProductImages"
import ProductInfo from "../../../../components/customize/product/ProductInfo"
import ProductTemplate from "../../../../components/customize/product/ProductTemplate"
import ProductControls from "../../../../components/customize/product/ProductControls"
import ProductDescription from "../../../../components/customize/product/ProductDescription"
import ProductGallery from "../../../../components/customize/product/ProductGallery"
import ProductHero from "../../../../components/customize/product/ProductHero"

const ProductPage = ({ data, params }) => {
  const { product, productImages, descriptionImages, productThumbnails, galleryImages } = data
  const { coverColor } = params
  const { heightPixel, widthPixel } = product
  const svgHeight = heightPixel
  const svgWidth = widthPixel
  const [bookData, setBookData] = useState({
    ...product,
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
  const [svgSize, setSvgData] = useState({
    height: bookData.heightPixel - pageMargins.vertical,
    width: bookData.widthPixel - pageMargins.horizontal,
  })
  const [maxSvgSize, setMaxSvgSize] = useState({})
  const [currentPageSide, setCurrentPageSide] = useState("both")
  const [selectedPageSvg, setSelectedPageSvg] = useState("")
  const [leftPageData, setLeftPageData] = useState({})
  const [rightPageData, setRightPageData] = useState({})
  const [cartThumbnail, setCartThumbnail] = useState([])
  const [max, setMax] = useState({
    rows: 200,
    columns: 200,
  })

  useEffect(() => {
    // if there is no coverColor or coverColor does not exist
    if (!coverColor || !bookData.colors.find(color => color.slug === coverColor)) {
      const defaultCoverColor = bookData.colors[0].slug
      // redirect the user to the first color by default
      navigate(`/products/${bookData.category}/${bookData.slug}/${defaultCoverColor}`, { replace: true })
      setBookData({
        ...product,
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
  }, [product, bookData, coverColor, pageData])

  return (
    <Layout
      seoDetails={{
        title: `${product.name}`,
        description: product.description,
        image: productImages.nodes[0].childImageSharp.gatsbyImageData.images.fallback.src,
      }}
    >
      <SectionMain>
        <Section>
          <SectionContent padding={`${spacing.large} 0`}>
            <Container xs sm md lg xl>
              <Row justify="start" gutterWidth={32}>
                {pageData.show ? (
                  <>
                    <Col md="content" id="product-controls">
                      <ProductControls
                        currentPageSide={currentPageSide}
                        pageData={pageData}
                        max={max}
                        selectedPageSvg={selectedPageSvg}
                        setCurrentPageSide={setCurrentPageSide}
                        setLeftPageData={setLeftPageData}
                        setPageData={setPageData}
                        setRightPageData={setRightPageData}
                        svgSize={svgSize}
                        toast={toast}
                      />
                    </Col>
                    <Col id="product-template">
                      <ProductTemplate
                        bookData={bookData}
                        maxSvgSize={maxSvgSize}
                        currentPageSide={currentPageSide}
                        pageData={pageData}
                        setPageData={setPageData}
                        setMax={setMax}
                        setSelectedPageSvg={setSelectedPageSvg}
                        setSvgData={setSvgData}
                      />
                    </Col>
                  </>
                ) : (
                  <Col md={8}>
                    <ProductImages
                      coverColor={coverColor}
                      productImages={productImages}
                      productThumbnails={productThumbnails}
                      setCartThumbnail={setCartThumbnail}
                    />
                  </Col>
                )}
                <Col lg={4}>
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
          images={descriptionImages}
        />
        <ProductHero
          bookData={bookData}
          backgroundColor={colors.gray.nineHundred}
        />
        <ProductGallery 
          images={galleryImages}
          bookData={bookData}
          heading="Gallery"
        />
      </SectionMain>
    </Layout>
  )
}

export const pageQuery = graphql`
  query ProductPageQuery($id: String!, $slug: String!) {
    product(id: { eq: $id }) {
      camelName
      category
      custom
      description
      longDescription
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
      galleryTexts {
        heading
        text
        alt
      }
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
    descriptionImages: allFile(filter: { relativeDirectory: { eq: $slug } name: { glob: "description*" }}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            width: 1500
            quality: 80
          )
        }
      }
    }
    productImages: allFile(filter: { relativeDirectory: { eq: $slug }}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            width: 870
            quality: 80
          )
        }
      }
    }
    galleryImages: allFile(filter: { relativeDirectory: { eq: $slug } name: { glob: "gallery*" }}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            quality: 80
            width: 1400,
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
            quality: 80
          )
        }
      }
    }
  }
`

export default ProductPage