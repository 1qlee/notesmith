import React from "react"
import { colors, spacing } from "../styles/variables"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import Button from "../components/Button"
import Cart from "../components/shop/Cart"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import Orders from "../components/shop/Orders"
import SEO from "../components/layout/Seo"

const ShoppingCart = () => {
  return (
    <Layout>
      <SEO title="Cart" />
      <Nav chapterNumber="01" title="Cart"></Nav>
      <SectionMain className="has-max-height">
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  rowGap={spacing.normal}
                  columnGap={spacing.medium}
                  rows="auto"
                  justifycontent="center"
                >
                  <Cell width={8}>
                    <Cart />
                  </Cell>
                  <Cell width={4}>
                    <Orders />
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

export default ShoppingCart
