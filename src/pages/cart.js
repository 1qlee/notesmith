import React from "react"
import { colors, spacing } from "../styles/variables"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import Button from "../components/Button"
import Cart from "../components/shop/Cart"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import OrderSummary from "../components/shop/OrderSummary"
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
                  columns="repeat(auto-fit,minmax(360px,1fr))"
                  rows="auto"
                  justifycontent="center"
                >
                  <Cell width={2}>
                    <Cart />
                  </Cell>
                  <Cell width={1}>
                    <OrderSummary />
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
