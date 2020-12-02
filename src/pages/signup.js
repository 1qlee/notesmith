import React from "react"
import { colors, spacing } from "../styles/variables"
import { navigate, Link } from "gatsby"
import { CheckCircle } from "phosphor-react"
import { useFirebaseContext } from "../utils/auth"

import { Grid, Cell } from "styled-css-grid"
import { SectionMain } from "../components/layout/Section"
import Content from "../components/Content"
import SignUpForm from "../components/form/SignUpForm"
import Layout from "../components/layout/Layout"
import Logo from "../components/Logo"
import Icon from "../components/Icon"

const SignUp = () => {
  const { user } = useFirebaseContext()

  if (user) {
    navigate(`/app/dashboard`, { replace: true })
    return null
  }

  return (
    <Layout className="is-full-height">
      <SectionMain className="has-no-padding">
        <Grid
          columns="1fr 1fr"
          height="100%"
        >
          <Grid
            height="100%"
            flow="row"
            rowGap={spacing.normal}
            justifyContent="end"
            columns="2fr 1fr"
            columnGap="1rem"
            rows="40px"
            style={{
              backgroundColor: colors.primary.sixHundred
            }}
          >
            <Cell left={2}>
              <Grid
                columns="40px 3fr"
                columnGap="1rem"
                alignContent="center"
              >
                <Icon>
                  <CheckCircle weight="duotone" size={32} color={colors.white} />
                </Icon>
                <p style={{color: colors.white}}>Lorem Ipsum</p>
              </Grid>
            </Cell>
            <Cell left={2}>
              <Grid
                columns="40px 3fr"
                columnGap="1rem"
                alignContent="center"
              >
                <Icon>
                  <CheckCircle weight="duotone" size={32} color={colors.white} />
                </Icon>
                <p style={{color: colors.white}}>Lorem Ipsum</p>
              </Grid>
            </Cell>
          </Grid>
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
              <SignUpForm />
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

export default SignUp
