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
      name
      size
      slug
      type
      numOfPages
      paperWeight
      paperColor
      paperTooth
      category
      description
      stripePriceId
      price
      colors {
        name
        hex
      }
    }
  }
`

export default DefaultEditorPage
