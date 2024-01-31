import React from "react"
import { spacing, colors } from "../styles/variables"

import Content from "../components/ui/Content"
import Layout from "../components/layout/Layout"
import RegisterForm from "../components/form/RegisterForm"
import Seo from "../components/layout/Seo"
import { Container, Row, Col } from "react-grid-system"
import { Patterns, Pattern } from "../components/misc/Patterns"
import { Section, SectionMain, SectionContent } from "../components/layout/Section"
import { StyledLabel } from "../components/form/FormComponents"

const Waitlist = () => {
  return (
    <Layout
      seoDetails={{
        title: "Join the waiting list for early access",
      }}
    >
      <Patterns
        color={colors.gray.oneHundred}
      />
      <SectionMain className="has-max-height">
        <Section height="100%">
          <SectionContent
            padding={`${spacing.section} 0`}
            height="100%"
          >
            <Pattern
              pattern={13}
              height="calc(100% - 32px)"
              width="calc(100% - 32px)"
              top={32}
              left={32}
            />
            <Container xl lg md sm xs>
              <Row justify="center">
                <Col sm={5}>
                  <Content
                    paragraphfontsize="1.25rem"
                    margin="0 0 32px"
                  >
                    <h1>Get early access.</h1>
                    <p>Join the waitlist to get early access to the Notesmith platform. You will get access to all Notesmith features and you will be able to purchase notebooks at a 25% discounted price.</p>
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