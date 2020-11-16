import React, { useState } from "react"
import { colors, spacing } from "../styles/variables"
import { Link } from "gatsby"

import { Container, LayoutContainer } from "../components/layout/Container"
import { Grid, Cell } from "styled-css-grid"
import { SectionMain, Section, SectionLayout } from "../components/layout/Section"
import Content from "../components/Content"
import SignupForm from "../components/form/SignupForm"
import Layout from "../components/layout/Layout"
import Logo from "../components/Logo"

const Signup = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  return (
    <Layout className="is-full-height">
      <SectionMain className="has-no-padding">
        <Grid
          columns="1fr 1fr"
          height="100%"
        >
          <div style={{background: colors.primary.sixHundred, height: "100%", width: "100%"}}>
            <Content>
              <p style={{color: colors.white}}>Lorem Ipsum</p>
            </Content>
          </div>
          <Grid
            flow="row"
            rowGap={spacing.medium}
            columns="420px"
            rows="auto"
            justifyContent="center"
            alignContent="center"
          >
            <Cell center>
              <Link to="/">
                <Logo padded={true} color={colors.primary.sixHundred} />
              </Link>
            </Cell>
            <Cell>
              <p>{email}</p>
              <p>{password}</p>
              <SignupForm />
            </Cell>
            <Cell>
              <Content textAlign="center">
                <p>Already have an account? <Link to="/login">Log in</Link></p>
              </Content>
            </Cell>
          </Grid>
        </Grid>
      </SectionMain>
    </Layout>
  )
}

export default Signup
