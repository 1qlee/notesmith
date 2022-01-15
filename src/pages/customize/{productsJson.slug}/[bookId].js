import React from "react"
import { graphql } from "gatsby"
import Editor from "../../../components/customize/Editor"

const EditorPage = ({ data, params }) => {
  return (
    <Editor
      bookId={params.bookId}
      productData={data.productData}
    />
  )
}

export const pageQuery = graphql`
  query EditorPageQuery($slug: String!) {
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

export default EditorPage
