import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Hello world</h1>
    <div>
      {data.allContentfulProduct.edges.map(({ node: product}) => (
        <p>{product.productName}</p>
      ))}
    </div>
    <Link to="/account">Log In</Link>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export const query = graphql`
  query IndexQuery {
    allContentfulProduct {
      edges {
        node {
          id
          productName
        }
      }
    }
  }
`


export default IndexPage
