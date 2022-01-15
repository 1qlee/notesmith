import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { spacing } from "../../../../styles/variables"
import { StaticImage } from "gatsby-plugin-image"

import { Container, LayoutContainer } from "../../../../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../../../../components/layout/Section"
import ProductInfo from "../../../../components/shop/ProductInfo"
import Layout from "../../../../components/layout/Layout"
import Nav from "../../../../components/layout/Nav"
import Seo from "../../../../components/layout/Seo"

const ProductPage = ({ data, params }) => {
  const { products, stripePrice } = data
  const { id, unit_amount, product } = stripePrice
  const { coverColor } = params
  const [bookData, setBookData] = useState({
    ...products,
    coverColor: coverColor,
  })

  useEffect(() => {
    // if there is no coverColor or coverColor does not exist
    if (!coverColor || !bookData.colors.find(color => color.name === coverColor)) {
      const defaultCoverColor = bookData.colors[0].name
      // redirect the user to the first color by default
      navigate(`/products/${bookData.category}/${bookData.slug}/${defaultCoverColor}`, { replace: true })
      setBookData({
        ...products,
        coverColor: defaultCoverColor
      })
    }
    else {
      // else navigate to appropriate coverColor
      navigate(`/products/${bookData.category}/${bookData.slug}/${bookData.coverColor}`)
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
                    <StaticImage
                      src="../images/index-image-2.jpg"
                      alt="Notesmith notebooks"
                      placeholder="blurred"
                      quality={100}
                    />
                  </Cell>
                  <Cell width={2}>
                    <ProductInfo
                      bookData={bookData}
                      setBookData={setBookData}
                      stripeData={data.stripePrice}
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
      name
      size
      slug
      type
      numOfPages
      paperWeight
      paperColor
      paperTooth
      category
      description
      stripePriceId
      price
      colors {
        name
        hex
      }
    }
  }
`

export default ProductPage
