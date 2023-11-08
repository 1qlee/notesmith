import React from "react"
import { spacing } from "../styles/variables"
import { Container, Row, Col } from 'react-grid-system'

import { Section, SectionContent, SectionMain } from "../components/layout/Section"
import Content from "../components/ui/Content"
import Layout from "../components/layout/Layout"

const ReturnsPage = () => {
  return (
    <Layout>
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
                    <h1>Return policy</h1>
                  </Content>
                </Col>
              </Row>
              <Row>
                <Col>
                  
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default ReturnsPage