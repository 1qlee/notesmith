import React from "react"
import { colors, spacing } from "../styles/variables"
import { navigate, Link } from "gatsby"
import { useFirebaseContext } from "../utils/auth"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import Content from "../components/Content"
import LoginForm from "../components/form/LoginForm"
import Layout from "../components/layout/Layout"
import Logo from "../components/Logo"

const Login = () => {
  const { user } = useFirebaseContext()

  if (user) {
    navigate(`/app/dashboard`, { replace: true })
    return null
  }

  return (
    <Layout className="is-full-height">
      <SectionMain className="has-vertical-padding">
        <Section>
          <Container>
            <LayoutContainer>
              <SectionContent>
                <Grid
                  flow="row"
                  rowGap={spacing.medium}
                  columns="420px"
                  rows="auto"
                  justifyContent="center"
                >
                  <Cell center>
                    <Link to="/">
                      <Logo padded={true} color={colors.primary.sixHundred} />
                    </Link>
                  </Cell>
                  <Cell>
                    <LoginForm />
                  </Cell>
                  <Cell>
                    <Content textAlign="center">
                      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </Content>
                  </Cell>
                </Grid>
              </SectionContent>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Login
