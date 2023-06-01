import React from "react"
import { Link } from "gatsby"
import { colors, widths } from "../../../styles/variables"

import { Container } from 'react-grid-system'
import { Flexbox } from "../../layout/Flexbox"
import { AuthContentBox, AuthSection } from "./AuthSections"
import AuthNav from "./AuthNav"
import Logo from "../../misc/Logo"
import Seo from "../../layout/Seo"

function AuthLayout({
  children,
  page
}) {
  return (
    <AuthSection>
      <Container
        xl lg md sm xs
      >
        <Seo title={page} />
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
        </Flexbox>
        <AuthNav
          page={page}
        />
        <AuthContentBox>
          {children}
        </AuthContentBox>
      </Container>
    </AuthSection>
  )
}

export default AuthLayout