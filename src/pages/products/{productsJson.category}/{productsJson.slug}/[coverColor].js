import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { spacing, convertToPx } from "../../../../styles/variables"
import { StaticImage, GatsbyImage } from "gatsby-plugin-image"
import ImageGallery from 'react-image-gallery'
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
  const [selectedPageSvg, setSelectedPageSvg] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState({
    template: "blank",
    show: false,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    spacing: 5,
    opacity: 1,
    thickness: 0.088,
    dotRadius: 0.6,
    rows: 42,
    columns: 27,
    marginTop: 2.273,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    width: 127,
    lineWidth: 100,
    pageHeight: bookData.heightPixel - convertToPx(6.35),
    pageWidth: bookData.widthPixel - convertToPx(13.335),
  })
  const [leftPages, setLeftPages] = useState({})
  const [rightPages, setRightPages] = useState({})
  const [pageContentSize, setPageContentSize] = useState({})
  const [activeImages, setActiveImages] = useState([])
  const [cartThumbnail, setCartThumbnail] = useState([])
  const workingPageHeight = canvasPageSize.height - convertToPx(6.35)
  const workingPageWidth = canvasPageSize.width - convertToPx(13.335)

  function parseImages(images, color, thumbnails) {
    // filter images by the specified color
    const dummyArray = []
    const filteredImages = images.nodes.filter(img => img.childImageSharp.fluid.originalName.split("-")[0] === color)
    const filteredThumbnails = thumbnails.nodes.filter(img => img.childImageSharp.fluid.originalName.split("-")[0] === color)
    const firstThumbnail = filteredThumbnails[0].childImageSharp

    filteredImages.forEach((img, index) => {
      dummyArray.push({
        original: img.childImageSharp.fluid.src,
        thumbnail: filteredThumbnails[index].childImageSharp.fluid.src,
      })
    })

    setCartThumbnail(firstThumbnail)
    setActiveImages(dummyArray)
  }

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

    parseImages(productImages, bookData.coverColor, productThumbnails)
  }, [bookData.coverColor])

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
                  columnGap={spacing.medium}
                >
                  <Cell width={4}>
                    {selectedTemplate.show ? (
                      <Flexbox
                        flex="flex"
                      >
                        <Templatesbar
                          canvasPageSize={canvasPageSize}
                          currentPageSide={currentPageSide}
                          pageContentSize={pageContentSize}
                          pageData={selectedTemplate}
                          selectedPageSvg={selectedPageSvg}
                          setCurrentPageSide={setCurrentPageSide}
                          setLeftPages={setLeftPages}
                          setPageData={setSelectedTemplate}
                          setRightPages={setRightPages}
                        />
                        <Template
                          bookData={bookData}
                          canvasPageSize={canvasPageSize}
                          currentPageSide={currentPageSide}
                          pageData={selectedTemplate}
                          setPageContentSize={setPageContentSize}
                          setPageData={setSelectedTemplate}
                          setSelectedPageSvg={setSelectedPageSvg}
                          workingPageHeight={workingPageHeight}
                          workingPageWidth={workingPageWidth}
                        />
                      </Flexbox>
                    ) : (
                      <div>
                        <ImageGallery
                          items={activeImages}
                          thumbnailPosition="left"
                          showPlayButton={false}
                          showNav={false}
                          showBullets={true}
                          showFullscreenButton={false}
                        />
                      </div>
                    )}
                  </Cell>
                  <Cell width={2}>
                    <ProductInfo
                      bookData={bookData}
                      cartThumbnail={cartThumbnail}
                      setBookData={setBookData}
                      selectedTemplate={selectedTemplate}
                      setSelectedTemplate={setSelectedTemplate}
                    />
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
            width: 839
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
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
            width: 100
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        }
      }
    }
  }
`

export default ProductPage
