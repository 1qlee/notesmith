import React from "react"
import { graphql } from "gatsby"
import PrivateRoute from "../../components/auth/PrivateRoute"
import AuthBooks from "../../components/auth/AuthBooks"

import Seo from "../../components/layout/Seo"

function BooksPage({ data }) {
  return <PrivateRoute component={AuthBooks} allProducts={data.allProductn} />
}

export default BooksPage

export const pageQuery = graphql`
  query allProduct {
    allProduct {
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
  }
`