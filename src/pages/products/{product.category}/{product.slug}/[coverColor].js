import React, { useState, useEffect } from "react"
import { graphql, navigate,  } from "gatsby"
import { colors, spacing, pageMargins, pageDataConfig } from "../../../../styles/variables"
import toast from 'react-hot-toast'

import { Container, Row, Col } from 'react-grid-system'
import { SectionMain, Section, SectionContent } from "../../../../components/layout/Section"
import Layout from "../../../../components/layout/Layout"
import ProductInfo from "../../../../components/product/ProductInfo"
import ProductTemplate from "../../../../components/product/ProductTemplate"
import ProductControls from "../../../../components/product/ProductControls"
import ProductHero from "../../../../components/product/ProductHero"
import ProductImages from "../../../../components/product/ProductImages"
import ProductFiftyFifty from "../../../../components/product/ProductFiftyFifty"
import Divider from "../../../../components/ui/Divider"

const ProductPage = ({ data, params }) => {
  const { product, productImages, additionalImages, productThumbnails, fiftyFiftyImages } = data
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
  const [svgLoaded, setSvgLoaded] = useState(false)

  useEffect(() => {
    // set thumbnail image for cart
    const filteredThumbnails = productThumbnails.nodes.filter(img => img.name.split("-")[0] === coverColor)
    filteredThumbnails.sort((a,b) => a.name.split("-")[1] < b.name.split("-")[1] ? -1 : 0)
    const firstThumbnail = filteredThumbnails[0]
    setCartThumbnail(firstThumbnail)
    
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
                        md="content"
                        style={{
                          '@media only screen and (max-width: 991px)': {
                            paddingLeft: "0 !important",
                            paddingRight: "0 !important",
                          }
                        }}
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
                      style={{
                        '@media only screen and (max-width: 991px)': {
                          marginBottom: "32px !important",
                        }
                      }}
                    >
                      <ProductTemplate
                        bookData={bookData}
                        currentPageSide={currentPageSide}
                        pageData={pageData}
                        setDimensions={setDimensions}
                        setMax={setMax}
                        setLeftPageData={setLeftPageData}
                        setPageData={setPageData}
                        setRightPageData={setRightPageData}
                        setSelectedPageSvg={setSelectedPageSvg}
                        setSvgLoaded={setSvgLoaded}
                        svgLoaded={svgLoaded}
                      />
                    </Col>
                  </>
                ) : (
                  <Col>
                    <ProductImages 
                      coverColor={bookData.coverColor}
                      productImages={productImages}
                      additionalImages={additionalImages}
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
        <Divider 
          margin="32px 0"
        />
        {fiftyFiftyImages.nodes.map((image, index) => (
          <ProductFiftyFifty
            key={index}
            image={image}
            direction={index % 2 === 0 ? "left" : "right"}
            bookData={bookData}
          />
        ))}

        <ProductHero
          bookData={bookData}
          backgroundColor={colors.gray.nineHundred}
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
      discount
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
      formattedPrice
      size
      slug
      stripePriceId
      weight
      widthInch
      widthPixel
      fiftyFiftyTexts {
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
    productImages: allFile(
      filter: { relativeDirectory: { eq: $slug }}
      sort: { name: ASC }
    ) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            width: 1245
            quality: 90
            placeholder: BLURRED
            formats: [AUTO, WEBP]
          )
        }
      }
    }
    additionalImages: allFile(filter: { relativeDirectory: { eq: $slug } name: { glob: "all*" }}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            quality: 90
            width: 1245,
            placeholder: BLURRED
            formats: [AUTO, WEBP]
          )
        }
      }
    }
    fiftyFiftyImages: allFile(filter: { relativeDirectory: { eq: $slug } name: { glob: "fiftyfifty*" }}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            quality: 90
            width: 740,
            placeholder: BLURRED
            formats: [AUTO, WEBP]
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
            placeholder: BLURRED
            formats: [AUTO, WEBP]
          )
        }
      }
    }
  }
`

export default ProductPage