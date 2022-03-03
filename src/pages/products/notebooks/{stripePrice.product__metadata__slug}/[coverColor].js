import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { spacing, convertToPx } from "../../../../styles/variables"
import { StaticImage } from "gatsby-plugin-image"

import { Container, LayoutContainer } from "../../../../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../../../../components/layout/Section"
import { Flexbox } from "../../../../components/layout/Flexbox"
import Template from "../../../../components/customize/pageComponents/Template"
import Templatesbar from "../../../../components/customize/bars/Templatesbar"
import ProductInfo from "../../../../components/shop/ProductInfo"
import Layout from "../../../../components/layout/Layout"
import Nav from "../../../../components/layout/Nav"
import Seo from "../../../../components/layout/Seo"

const ProductPage = ({ data, params }) => {
  const { products, stripePrice } = data
  const { id, unit_amount, product } = stripePrice
  const { coverColor } = params
  const [currentPageSide, setCurrentPageSide] = useState("left")
  const [bookData, setBookData] = useState({
    ...products,
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
    rows: 43,
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
  const canvasSize = {
    height: 688,
    width: 445,
  }

  useEffect(() => {
    // if there is no coverColor or coverColor does not exist
    if (!coverColor || !bookData.colors.find(color => color.slug === coverColor)) {
      const defaultCoverColor = bookData.colors[0].slug
      // redirect the user to the first color by default
      navigate(`/products/${bookData.category}/${bookData.slug}/${defaultCoverColor}`, { replace: true })
      setBookData({
        ...products,
        coverColor: defaultCoverColor
      })
    }
    else {
      // else navigate to appropriate coverColor
      navigate(`/products/${bookData.category}/${bookData.slug}/${bookData.coverColor}`, { replace: true })
    }
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
                  columnGap={spacing.xlarge}
                >
                  <Cell width={3}>
                    {selectedTemplate.show ? (
                      <Flexbox
                        flex="flex"
                      >
                        <Templatesbar
                          pageData={selectedTemplate}
                          setPageData={setSelectedTemplate}
                          selectedPageSvg={selectedPageSvg}
                        />
                        <Template
                          bookData={bookData}
                          canvasSize={canvasSize}
                          currentPageSide={currentPageSide}
                          pageData={selectedTemplate}
                          setPageData={setSelectedTemplate}
                          setSelectedPageSvg={setSelectedPageSvg}
                        />
                      </Flexbox>
                    ) : (
                      <StaticImage
                        src="../images/index-image-2.jpg"
                        alt="Notesmith notebooks"
                        placeholder="blurred"
                        quality={100}
                      />
                    )}
                  </Cell>
                  <Cell width={2}>
                    <ProductInfo
                      bookData={bookData}
                      setBookData={setBookData}
                      stripeData={data.stripePrice}
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
  query ProductPageQuery($product__metadata__slug: String!) {
    stripePrice(product: {metadata: {slug: { eq: $product__metadata__slug }}}) {
      id,
      unit_amount,
      currency,
      product {
        id
        name
        description
        images
      }
    }
    products: productsJson(slug: { eq: $product__metadata__slug}) {
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
  }
`

export default ProductPage
