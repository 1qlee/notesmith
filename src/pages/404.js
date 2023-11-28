import React from "react"
import { spacing } from "../styles/variables"
import { isBrowser } from "../utils/helper-functions"

import Seo from "../components/layout/Seo"
import Layout from "../components/layout/Layout"
import Content from "../components/ui/Content"
import { Section, SectionMain, SectionContent } from "../components/layout/Section"
import { Container, Row, Col } from "react-grid-system"

const NotFoundPage = () => {
  if (isBrowser()) {
    return (
      <Layout
        seoDetails={{
          title: "Page not found",
        }}
      >
        <SectionMain
          className="has-max-height"
        >
          <Section>
            <SectionContent
              padding={`${spacing.section} 0`}
            >
              <Container xl lg md sm xs>
                <Row>
                  <Col>
                    <Content>
                      <h1>Page not found</h1>
                    </Content>
                  </Col>
                </Row>
              </Container>
            </SectionContent>
          </Section>
        </SectionMain>
      </Layout>
    )
  }
}

export default NotFoundPage