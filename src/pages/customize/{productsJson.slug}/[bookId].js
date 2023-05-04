import React from "react"
import { graphql } from "gatsby"
import Editor from "../../../components/customize/Editor"

const EditorPage = ({ data, params }) => {
  return (
    <Editor
      bookId={params.bookId}
      productData={data.productData}
      productImages={data.productImages}
    />
  )
}

export const pageQuery = graphql`
  query EditorPageQuery($slug: String!) {
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
      weight
      colors {
        name
        hex
        slug
      }
    }
    productImages: allFile(filter: { relativeDirectory: { eq: $slug}}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            width: 80
            height: 80
            quality: 100
          )
        }
      }
    }
    
  }
`

export default EditorPage
