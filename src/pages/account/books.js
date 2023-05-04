import React from "react"
import { graphql } from "gatsby"
import PrivateRoute from "../../components/auth/PrivateRoute"
import UserBooks from "../../components/auth/UserBooks"

function BooksPage({ data }) {
  return <PrivateRoute component={UserBooks} allProducts={data.allProductsJson} />
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
