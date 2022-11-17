import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors, spacing } from "../../styles/variables"

import { Section, SectionContent } from "../layout/Section"
import { Container, LayoutContainer } from "../layout/Container"
import { Grid, Cell } from "styled-css-grid"
import RegisterForm from "../form/RegisterForm"
import Content from "../ui/Content"
import Logo from "../misc/Logo"

const StyledFooter = styled.footer`
  width: 100%;
  height: 100%;
`

function getDate() {
  const d = new Date()

  return d.getFullYear()
}

const Footer = () => {
  return (
    <Section backgroundcolor={colors.gray.nineHundred}>
      <Container>
        <LayoutContainer>
          <SectionContent padding={`${spacing.large} 0`}>
            <StyledFooter>
              <Grid
                columns="repeat(3, 1fr)"
                columnGap={spacing.normal}
                rowGap={spacing.normal}
              >
                <Cell>
                  <Content
                    paragraphcolor={colors.gray.oneHundred}
                  >
                    <Link
                      to="/"
                    >
                      <Logo color={colors.gray.oneHundred} />
                    </Link>
                    <p>
                      © {getDate()} Notesmith LLC. All rights reserved.
                    </p>
                  </Content>
                </Cell>
                <Cell></Cell>
                <Cell>
                  <Content
                    paragraphcolor={colors.gray.oneHundred}
                    h3color={colors.gray.oneHundred}
                    h3fontweight="400"
                    h3margin="0 0 0.5rem"
                    margin="0 0 1rem"
                  >
                    <h3>Stay up to date</h3>
                    <p>Sign up to get access to promotions, special offers, news, and much more.</p>
                  </Content>
                  <RegisterForm 
                    color="light"
                  />
                </Cell>
              </Grid>
            </StyledFooter>
          </SectionContent>
        </LayoutContainer>
      </Container>
    </Section>
  )
}

export default Footer
