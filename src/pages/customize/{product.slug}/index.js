import React from "react"
import { graphql } from "gatsby"
import Editor from "../../../components/customize/Editor"

import Seo from "../../../components/layout/Seo"

const DefaultEditorPage = ({ data }) => {
  return (
    <Editor
      productData={data.product}
    />
  )
}

export const pageQuery = graphql`
  query DefaultEditorPageQuery($slug: String!) {
    product(slug: { eq: $slug }) {
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
`

export default DefaultEditorPage