import React from "react"
import { graphql } from "gatsby"
import PrivateRoute from "../../components/auth/PrivateRoute"
import AuthBooks from "../../components/auth/AuthBooks"

function BooksPage({ data }) {
  return <PrivateRoute component={AuthBooks} allProducts={data.allProduct} />
}

export default BooksPage

export const pageQuery = graphql`
  query allProduct {
    allProduct {
      nodes {
        camelName
        category
        custom
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
        weight
        colors {
          name
          hex
          slug
        }
      }
    }
  }
`