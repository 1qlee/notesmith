import React from "react"
import { Link } from "gatsby"
import { colors, widths } from "../../../styles/variables"
import { User } from "phosphor-react"

import { Container, LayoutContainer } from "../../layout/Container"
import { Flexbox } from "../../layout/Flexbox"
import { SectionMain, Section } from "../../layout/Section"
import AuthNav from "./AuthNav"
import Logo from "../../Logo"
import Icon from "../../Icon"

function AuthLayout({
  children,
  page
}) {
  return (
    <SectionMain className="has-no-padding has-max-height">
      <Section>
        <Container>
          <LayoutContainer>
            <Flexbox
              flex="flex"
              alignitems="center"
              justifycontent="space-between"
              padding="1rem 0"
              width="100%"
            >
              <Link
                to="/"
              >
                <Logo
                  color={colors.gray.nineHundred}
                  width={widths.logo}
                  height="100%"
                />
              </Link>
              <Icon>
                <User size="1.5rem" />
              </Icon>
            </Flexbox>
            <AuthNav 
              page={page}
            />
            {children}
          </LayoutContainer>
        </Container>
      </Section>
    </SectionMain>
  )
}

export default AuthLayout