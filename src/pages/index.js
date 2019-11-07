import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import Layout from "../components/layout"
import BookPage from "../components/BookPage"
import ToastFooter from "../components/ToastFooter"
import Container from "../components/Container"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Container>
      <BookPage pageNumber="01">
        <small>INTRODUCTION</small>
        <h1>Welcome to Notesmith</h1>
        <p>A new venture dedicated to the notebook fanatics, enthusiasts, hobbyists, and everyone else in between. </p>
        <p>Our mission is simple. To provide an easy way to design your own custom notebook and have it delivered straight to your doorstep.</p>
        <p>Please sign up below to stay updated!</p>
      </BookPage>
      <ToastFooter />
    </Container>
  </Layout>
)

export default IndexPage
