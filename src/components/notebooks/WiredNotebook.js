import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { spacing } from "../../styles/variables"
import { StaticImage } from "gatsby-plugin-image"

import { Container, LayoutContainer } from "../layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../layout/Section"
import ProductInfo from "../shop/ProductInfo"
import Layout from "../layout/Layout"
import Nav from "../layout/Nav"
import Seo from "../layout/Seo"
import notebooks from "../../data/notebooks.json"

const WiredNotebook = () => {
  const bookData = notebooks.wired
  const data = useStaticQuery(graphql`
    query productQuery {
      stripePrice(id: { eq: "price_1IbAlnIN24Fw2SWdOVRXdimr" }) {
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
    }
  `)

  return (
    <Layout>
      <Seo title="shit" />
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

export default WiredNotebook
