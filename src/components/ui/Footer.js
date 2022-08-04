import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors, spacing } from "../../styles/variables"

import { Section, SectionContent } from "../layout/Section"
import { Container, LayoutContainer } from "../layout/Container"
import { Grid, Cell } from "styled-css-grid"
import Content from "../Content"
import Logo from "../Logo"

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
                columns="repeat(auto-fit,minmax(120px,1fr))"
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
              </Grid>
            </StyledFooter>
          </SectionContent>
        </LayoutContainer>
      </Container>
    </Section>
  )
}

export default Footer
