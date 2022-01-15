import React from "react"
import { useStaticQuery, graphql, navigate } from "gatsby"
import * as products from "../../../../data/products.json"

const DefaultProductPage = ({ data }) => {
  const { products, stripePrice } = data
  const { id, unit_amount, product } = stripePrice

  navigate(`/products/${products.category}/${products.slug}/${products.colors[0].name}`, { replace: true })

  return (
    <div>

    </div>
  )
}

export const pageQuery = graphql`
  query DefaultPageQuery($product__metadata__slug: String!) {
    stripePrice(product: {metadata: {slug: { eq: $product__metadata__slug }}}) {
      id,
      unit_amount,
      currency,
      product {
        id
        name
        description
        images
      }
    }
    products: productsJson(slug: { eq: $product__metadata__slug}) {
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

export default DefaultProductPage
