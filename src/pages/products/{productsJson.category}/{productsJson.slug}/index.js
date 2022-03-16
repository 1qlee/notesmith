import React from "react"
import { graphql, navigate } from "gatsby"

const DefaultProductPage = ({ data }) => {
  const { products } = data

  navigate(`/products/${products.category}/${products.slug}/${products.colors[0].slug}`, { replace: true })

  return (
    <div>

    </div>
  )
}

export const pageQuery = graphql`
  query DefaultPageQuery($id: String!) {
    products: productsJson(id: { eq: $id }) {
      name
      size
      slug
      camelName
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
        slug
      }
    }
  }
`

export default DefaultProductPage
