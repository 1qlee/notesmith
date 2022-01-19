import React from "react"
import { Link, graphql } from "gatsby"

function Products({ data }) {
  return (
    <div>
      <div>Notebooks</div>
      {data.allStripeProduct.nodes.map(product => (
        <Link key={product.name} to={`/products/${product.metadata.category}/${product.metadata.slug}`}>
          {product.name}
        </Link>
      ))}
    </div>
  )
}

export const query = graphql`
  query {
    allStripeProduct {
      nodes {
        name
        metadata {
          category
          slug
        }
      }
    }
  }
`

export default Products
