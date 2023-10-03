import React from "react"
import { Link } from "gatsby"
import { colors, spacing } from "../../styles/variables"
import { ScreenClassRender } from "react-grid-system"

import { Section, SectionContent } from "../layout/Section"
import { Container, Row, Col } from 'react-grid-system'
import Divider from "../layout/Divider"
import RegisterForm from "../form/RegisterForm"
import Content from "../ui/Content"
import Logo from "../misc/Logo"

function getDate() {
  const d = new Date()

  return d.getFullYear()
}

const Footer = ({ screenClass }) => {
  
  return (
    <ScreenClassRender
      render={screenClass => {
        const isMobile = ["xs", "sm"].includes(screenClass)

        return (
          <Section backgroundcolor={colors.gray.nineHundred}>
            <SectionContent padding={`${spacing.medium} 0`}>
              <Container xs sm md lg xl>
                <Row>
                  <Col md={4} push={{ md: 2 }}>
                    <Content
                      paragraphcolor={colors.gray.oneHundred}
                      h4color={colors.gray.oneHundred}
                      h4fontweight="400"
                      h4margin={isMobile ? "0 0 16px" : "0"}
                    >
                      <h4>Sign up to join the waitlist for early access to all our features and notebooks</h4>
                    </Content>
                  </Col>
                  <Col md={4} push={{ md: 2 }}>
                    <RegisterForm />
                  </Col>
                </Row>
                <Row>
                  <Divider margin="32px" backgroundcolor={colors.gray.sixHundred} />
                </Row>
                <Row>
                  <Col lg={4}>
                    <Content
                      paragraphcolor={colors.gray.oneHundred}
                    >
                      <Link
                        to="/"
                      >
                        <Logo color={colors.gray.oneHundred} />
                      </Link>
                      <p>
                        © {getDate()} Notesmith LLC.
                      </p>
                    </Content>
                  </Col>
                </Row>
              </Container>
            </SectionContent>
          </Section>
        )
      }} 
    />
  )
}

export default Footer
