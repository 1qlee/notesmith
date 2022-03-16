import React from "react"
import { spacing } from "../styles/variables"

import { Container, LayoutContainer } from "../components/layout/Container"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import ShoppingCart from "../components/shop/ShoppingCart"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import SEO from "../components/layout/Seo"

const Cart = () => {
  return (
    <Layout>
      <SEO title="Your cart" />
      <Nav />
      <SectionMain className="has-max-height">
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <ShoppingCart />
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Cart
