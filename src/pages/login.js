import React, { useState } from "react"
import { colors, spacing } from "../styles/variables"
import { Link } from "gatsby"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionLayout } from "../components/layout/Section"
import Content from "../components/Content"
import LoginForm from "../components/form/LoginForm"
import Layout from "../components/layout/Layout"
import Logo from "../components/Logo"

const Login = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  return (
    <Layout className="is-full-height">
      <SectionMain className="is-normal-padding">
        <Section>
          <Container>
            <LayoutContainer>
              <SectionLayout>
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
                    <p>{email}</p>
                    <p>{password}</p>
                    <LoginForm />
                  </Cell>
                  <Cell>
                    <Content textAlign="center">
                      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </Content>
                  </Cell>
                </Grid>
              </SectionLayout>
            </LayoutContainer>
          </Container>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Login
