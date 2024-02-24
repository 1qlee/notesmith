import React, { useState, useEffect } from "react"
import { graphql, navigate,  } from "gatsby"
import { colors, spacing, pageMargins, pageDataConfig } from "../../../../styles/variables"
import toast from 'react-hot-toast'

import { Container, Row, Col } from 'react-grid-system'
import { SectionMain, Section, SectionContent } from "../../../../components/layout/Section"
import Layout from "../../../../components/layout/Layout"
import ProductInfo from "../../../../components/customize/product/ProductInfo"
import ProductTemplate from "../../../../components/customize/product/ProductTemplate"
import ProductControls from "../../../../components/customize/product/ProductControls"
import ProductDescription from "../../../../components/customize/product/ProductDescription"
import ProductGallery from "../../../../components/customize/product/ProductGallery"
import ProductHero from "../../../../components/customize/product/ProductHero"
import ProductImages from "../../../../components/customize/product/ProductImages"

const ProductPage = ({ data, params }) => {
  const { product, productImages, descriptionImages, productThumbnails, galleryImages } = data
  const { coverColor } = params
  const { heightPixel, widthPixel } = product
  const [bookData, setBookData] = useState({
    ...product,
    coverColor: coverColor,
  })
  const defaultPageData = {
    ...pageDataConfig,
    maxContentHeight: heightPixel - pageMargins.vertical,
    maxContentWidth: widthPixel - pageMargins.horizontal,
    activeTemplate: null,
    showControls: false,
  }
  const [pageData, setPageData] = useState(defaultPageData)
  const [currentPageSide, setCurrentPageSide] = useState("both")
  const [selectedPageSvg, setSelectedPageSvg] = useState("")
  const [dimensions, setDimensions] = useState({})
  const [leftPageData, setLeftPageData] = useState({})
  const [rightPageData, setRightPageData] = useState({})
  const [cartThumbnail, setCartThumbnail] = useState([])
  const [max, setMax] = useState({
    rows: 0,
    columns: 0,
  })
  const [hideScroll, setHideScroll] = useState(false)
  const [svgLoaded, setSvgLoaded] = useState(false)

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
  }, [product, bookData, coverColor])

  return (
    <Layout
      hideScroll={hideScroll}
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
              <Row 
                justify="start" 
                gutterWidth={32}
                style={{ overflowAnchor: "none" }}
              >
                {pageData.show ? (
                  <>
                    {pageData.showControls && (
                      <Col
                        id="product-controls"
                        md="content"
                      >
                        <ProductControls
                          currentPageSide={currentPageSide}
                          dimensions={dimensions}
                          max={max}
                          pageData={pageData}
                          selectedPageSvg={selectedPageSvg}
                          setCurrentPageSide={setCurrentPageSide}
                          setLeftPageData={setLeftPageData}
                          setPageData={setPageData}
                          setRightPageData={setRightPageData}
                          toast={toast}
                        />
                      </Col>
                    )}
                    <Col 
                      id="product-template"
                    >
                      <ProductTemplate
                        bookData={bookData}
                        currentPageSide={currentPageSide}
                        pageData={pageData}
                        setDimensions={setDimensions}
                        setMax={setMax}
                        setPageData={setPageData}
                        setSelectedPageSvg={setSelectedPageSvg}
                        setSvgLoaded={setSvgLoaded}
                        svgLoaded={svgLoaded}
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
                    dimensions={dimensions}
                    pageData={pageData}
                    max={max}
                    selectedPageSvg={selectedPageSvg}
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
          setHideScroll={setHideScroll}
          headingText="Specs"
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
            quality: 100
          )
        }
      }
    }
    productImages: allFile(filter: { relativeDirectory: { eq: $slug }}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            width: 1750
            quality: 100
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