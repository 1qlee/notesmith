import React from "react"
import { spacing } from "../styles/variables"

import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import ShoppingCart from "../components/shop/ShoppingCart"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import Seo from "../components/layout/Seo"
import { Container } from "react-grid-system"

const Cart = () => {
  return (
    <Layout>
      <Seo title="Your cart" />
      <Nav />
      <SectionMain className="has-max-height">
        <Section>
          <SectionContent
            padding={`${spacing.large} 0`}
          >
            <Container xs sm md lg xl>
              <ShoppingCart />
            </Container>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Cart
