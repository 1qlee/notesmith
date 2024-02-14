import React from "react"
import { Link } from "gatsby"
import { colors, spacing } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"

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

const Footer = () => {
  const { user } = useFirebaseContext()

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
                <p>Subscribe to our mailing list and stay updated on all updates, promotions, and much more!</p>
              </Content>
            </Col>
            <Col md={4} push={{ md: 2 }}>
              <RegisterForm 
                fontsize="1rem"
                id="footer-register-form"
                color={colors.gray.oneHundred}
              />
            </Col>
          </Row>
          <Row>
            <Divider margin="32px 0" backgroundcolor={colors.gray.sixHundred} />
          </Row>
          <Row>
            <Col lg={4}>
              <Content
                paragraphcolor={colors.gray.oneHundred}
                margin="16px 0"
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
            <Col lg={2}>
              <Content
                linkcolor={colors.gray.oneHundred}
                h5margin="0 0 8px"
                h5color={colors.gray.oneHundred}
                margin="16px 0"
              >
                <h5>Support</h5>
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
            <Col lg={2}>
              <Content
                linkcolor={colors.gray.oneHundred}
                h5margin="0 0 8px"
                h5color={colors.gray.oneHundred}
                margin="16px 0"
              >
                <h5>Products</h5>
                <Box>
                  <Link to="/products/notebooks/pro-wired-notebook-a5-custom/white/">
                    Custom Notebooks
                  </Link>
                </Box>
              </Content>
            </Col>
            <Col lg={2}>
              <Content
                linkcolor={colors.gray.oneHundred}
                h5margin="0 0 8px"
                h5color={colors.gray.oneHundred}
                margin="16px 0"
              >
                <h5>Account</h5>
                {user ? (
                  <>
                    <Box>
                      <Link to="/account/dashboard">
                        Dashboard
                      </Link>
                    </Box>
                    <Box>
                      <Link to="/account/books">
                        Books
                      </Link>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box>
                      <Link to="/signin">
                        Sign in
                      </Link>
                    </Box>
                    <Box>
                      <Link to="/signin">
                        Sign up
                      </Link>
                    </Box>
                  </>
                )}
              </Content>
            </Col>
          </Row>
        </Container>
      </SectionContent>
    </Section>
  )
}

export default Footer
