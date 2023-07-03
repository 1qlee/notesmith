import React from "react"
import { spacing, colors } from "../styles/variables"

import Layout from "../components/layout/Layout"
import { Container, Row, Col } from "react-grid-system"
import RegisterForm from "../components/form/RegisterForm"
import { Section, SectionMain, SectionContent } from "../components/layout/Section"
import Content from "../components/ui/Content"
import { StyledLabel } from "../components/form/FormComponents"

const Waitlist = () => {
  return (
    <Layout title="Join the pre-order waitlist">
      <SectionMain className="has-max-height">
        <Section>
          <SectionContent
            padding={`${spacing.large} 0`}
          >
            <Container xl lg md sm xs>
              <Row justify="center">
                <Col sm={5}>
                  <Content
                    h1fontsize="3rem"
                    paragraphfontsize="1.25rem"
                    textalign="center"
                    margin="0 0 32px"
                  >
                    <h1>Your custom notebook awaits you</h1>
                    <p>Join the waitlist to get early access to the Notesmith platform where you can create custom layouts and templates.</p>
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