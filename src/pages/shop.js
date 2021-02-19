import React, { useState } from "react"
import { colors, spacing } from "../styles/variables"
import { SwitchTransition, CSSTransition } from "react-transition-group"
import testImg from "./notesmith00256.png"
import { loadStripe } from "@stripe/stripe-js"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import Page from "../components/shop/Page"
import EditPageForm from "../components/shop/EditPageForm"
import ProductInfo from "../components/shop/ProductInfo"
import Button from "../components/Button"
import Content from "../components/Content"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import SEO from "../components/layout/Seo"

let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe("pk_test_51IDyQgIN24Fw2SWdxYeN3XD8L7tVpLQQawaAnHJJ8o9QpTmFjPFSBDkS9InCMk9jyM1X15QV96qSoMxfAoYUl3ZZ00Z8vTGVpk")
  }
  return stripePromise
}

const ShopPage = () => {
  const [editMode, setEditMode] = useState(false)
  const [pageData, setPageData] = useState({
    type: "Blank",
    spacing: 5,
    opacity: 1,
    thickness: 1,
    rows: 43,
    columns: 27,
    marginTop: 5,
    marginLeft: 5,
    width: 1
  })
  const [bookData, setBookData] = useState({
    size: "Medium",
    width: 528,
    height: 816,
    color: "Cadet Gray",
    quantity: 1
  })

  return (
    <Layout>
      <SEO title="Truly Custom Notebooks For All People" />
      <Nav></Nav>
      <SectionMain>
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  columns="1fr 1fr"
                  columnGap={spacing.medium}
                >
                  <Cell>
                    {editMode ? (
                      <Page
                        pageData={pageData}
                        bookData={bookData}
                      />
                    ) : (
                      <img src={testImg} />
                    )}
                  </Cell>
                  <Cell>
                    <SwitchTransition mode="out-in">
                      <CSSTransition
                        key={editMode}
                        addEndListener={(node, done) => {
                          node.addEventListener("transitionend", done, false)
                        }}
                        classNames="fade"
                      >
                        {editMode ? (
                          <>
                            <EditPageForm
                              setEditMode={setEditMode}
                              setPageData={setPageData}
                              pageData={pageData}
                            />
                          </>
                        ) : (
                          <ProductInfo
                            setEditMode={setEditMode}
                            bookData={bookData}
                            setBookData={setBookData}
                          />
                        )}
                      </CSSTransition>
                    </SwitchTransition>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default ShopPage
