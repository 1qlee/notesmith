import React from "react"
import { Link, graphql } from "gatsby"

function Products({ data }) {
  return (
    <div>
      <div>Notebooks</div>
      {data.allProductsJson.nodes.map(product => (
        <Link key={product.name} to={`/products/${product.category}/${product.slug}`}>
          {product.name}
        </Link>
      ))}
    </div>
  )
}

export const query = graphql`
  query {
    allProductsJson {
      nodes {
        name
        slug
        category
      }
    }
  }
`

export default Products
