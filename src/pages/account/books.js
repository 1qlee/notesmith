import React from "react"
import { graphql } from "gatsby"
import PrivateRoute from "../../components/auth/PrivateRoute"
import AuthBooks from "../../components/auth/AuthBooks"

import Seo from "../../components/layout/Seo"

function BooksPage({ data }) {
  return <PrivateRoute component={AuthBooks} allProducts={data.allProductsJson} />
}

export default BooksPage

export const pageQuery = graphql`
  query allProductsData {
    allProductsJson {
      nodes {
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
        preorderPrice
        price
        size
        slug
        stripePriceId
        stripePreorderPriceId
        widthInch
        widthPixel
        colors {
          name
          hex
          slug
        }
      }
    }
  }
`

export const Head = () => (
  <Seo title="Edit book" />
)