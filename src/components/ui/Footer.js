import React from "react"
import { Link } from "gatsby"
import { colors, spacing } from "../../styles/variables"

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

const Footer = () => {
  return (
    <Section backgroundcolor={colors.gray.nineHundred}>
      <SectionContent padding={`${spacing.medium} 0`}>
        <Container xs sm md lg xl>
          <Row>
            <Col sm={4} push={{ sm: 2 }}>
              <Content
                paragraphcolor={colors.gray.oneHundred}
                h3color={colors.gray.oneHundred}
                h3fontweight="400"
                h3margin="0 0 0.5rem"
                margin="0 0 1rem"
              >
                <h3>Sign up to get access to promotions, special offers, news, and more</h3>
              </Content>
            </Col>
            <Col sm={4} push={{ sm: 2 }}>
              <RegisterForm />
            </Col>
          </Row>
          <Row>
            <Divider margin="16px" backgroundcolor={colors.gray.sixHundred} />
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
}

export default Footer
