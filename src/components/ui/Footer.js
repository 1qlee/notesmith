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
import Box from "./Box"

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
                      paragraphfontsize="1.25rem"
                    >
                      <p>Sign up for our newsletter to get access to discounts, updates, and more</p>
                    </Content>
                  </Col>
                  <Col md={4} push={{ md: 2 }}>
                    <RegisterForm 
                      fontsize="1rem"
                    />
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
                        © {getDate()} Notesmith LLC
                      </p>
                    </Content>
                  </Col>
                  <Col lg={4}>
                    <Content
                      linkcolor={colors.gray.oneHundred}
                    >
                      <Box>
                        <Link to="/faq">
                          FAQ
                        </Link>
                      </Box>
                      <Box>
                        <Link to="/return-policy">
                          Return Policy
                        </Link>
                      </Box>
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
