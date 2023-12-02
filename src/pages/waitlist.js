import React from "react"
import { spacing, colors } from "../styles/variables"

import Seo from "../components/layout/Seo"
import Layout from "../components/layout/Layout"
import { Container, Row, Col } from "react-grid-system"
import RegisterForm from "../components/form/RegisterForm"
import { Section, SectionMain, SectionContent } from "../components/layout/Section"
import Content from "../components/ui/Content"
import { StyledLabel } from "../components/form/FormComponents"

const Waitlist = () => {
  return (
    <Layout
      seoDetails={{
        title: "Join the waiting list for early access",
      }}
    >
      <SectionMain className="has-max-height">
        <Section>
          <SectionContent
            padding={`${spacing.section} 0`}
          >
            <Container xl lg md sm xs>
              <Row justify="center">
                <Col sm={5}>
                  <Content
                    paragraphfontsize="1.25rem"
                    margin="0 0 32px"
                  >
                    <h1>Get early access!</h1>
                    <p>Join the waitlist to get early access to the Notesmith platform. You will get access to all Notesmith features and you will be able to purchase notebooks at a discounted price.</p>
                    <p>Sign up below to join the waitlist to create your own custom-made notebook!</p>
                  </Content>
                  <StyledLabel>
                    Best email to reach you at
                  </StyledLabel>
                  <RegisterForm
                    border
                    fontsize="1rem"
                    top="12px"
                    color={colors.gray.nineHundred}
                  />
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Waitlist

export const Head = () => (
  <Seo title="Join the pre-order waitlist" />
)