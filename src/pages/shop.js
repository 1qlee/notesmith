import React, { useState } from "react"
import { spacing } from "../styles/variables"
import { SwitchTransition, CSSTransition } from "react-transition-group"
import testImg from "../images/book-bundle.jpg"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import Page from "../components/shop/Page"
import EditPageForm from "../components/form/EditPageForm"
import ProductInfo from "../components/shop/ProductInfo"
import Layout from "../components/layout/Layout"
import Nav from "../components/layout/Nav"
import SEO from "../components/layout/Seo"

const ShopPage = ({ data }) => {
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
      <Nav chapterNumber="07" title="The signature Notesmith notebook"></Nav>
      <SectionMain>
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  columns="repeat(auto-fit,minmax(60px,1fr))"
                  columnGap={spacing.medium}
                >
                  <Cell width={6}>
                    {editMode ? (
                      <Page
                        pageData={pageData}
                        bookData={bookData}
                      />
                    ) : (
                      <img style={{ border: `12px solid #e8e7e3`}}src={testImg} alt="testimg" />
                    )}
                  </Cell>
                  <Cell width={4}>
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
