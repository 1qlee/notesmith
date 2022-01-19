import React from "react"
import { graphql } from "gatsby"
import Editor from "../../../components/customize/Editor"

const EditorPage = ({ data, params }) => {
  return (
    <Editor
      bookId={params.bookId}
      productData={data.productData}
      productImageData={data.images}
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
      colors {
        name
        hex
        slug
      }
    }
    images: allFile(filter: { relativeDirectory: { eq: $slug}}) {
      nodes {
        childImageSharp {
          gatsbyImageData(
            width: 200
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        }
      }
    }
  }
`

export default EditorPage
