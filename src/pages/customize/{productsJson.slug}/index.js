import React from "react"
import { graphql } from "gatsby"
import Editor from "../../../components/customize/Editor"

const DefaultEditorPage = ({ data }) => {
  return (
    <Editor
      productData={data.productData}
    />
  )
}

export const pageQuery = graphql`
  query DefaultEditorPageQuery($slug: String!) {
    productData: productsJson(slug: { eq: $slug }) {
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
