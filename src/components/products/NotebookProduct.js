import React, { useState } from "react"
import { spacing } from "../../styles/variables"
import { StaticImage } from "gatsby-plugin-image"

import { Container, LayoutContainer } from "../layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../layout/Section"
import ProductInfo from "../shop/ProductInfo"
import Layout from "../layout/Layout"
import Nav from "../layout/Nav"
import Seo from "../layout/Seo"

const NotebookProduct = () => {
  const [bookData, setBookData] = useState({
    size: "A5",
    dimensions: "5.5in x 8.5in",
    width: 528,
    height: 816,
    color: "Cadet Gray",
    quantity: 1,
    title: "Signature Notebook",
    price: 20,
    numOfPages: 160,
    cover: "Sand matte lamination",
    binding: "Wired",
  })

  return (
    <Layout>
      <Seo title="Truly Custom Notebooks For All People" />
      <Nav chapterNumber="07" title="The signature Notesmith notebook"></Nav>
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

export default NotebookProduct
