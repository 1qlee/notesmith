import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql, navigate } from "gatsby"
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

const WiredNotebook = ({ coverColor }) => {
  const [bookData, setBookData] = useState({
    ...notebooks.wiredNotebook,
    coverColor: coverColor
  })
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

  useEffect(() => {
    // if there is no coverColor, redirect the user to bright-white by default
    if (!coverColor || !notebooks.wiredNotebook.colors.find(color => color.name === coverColor)) {
      navigate("/notebooks/wired-notebook/bright-white", { replace: true })
      setBookData({
        ...notebooks.wiredNotebook,
        coverColor: "bright-white"
      })
    }
    else {
      navigate(`/notebooks/wired-notebook/${bookData.coverColor}`)
    }
  }, [bookData.coverColor])

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

export default WiredNotebook
