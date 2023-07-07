import React from "react"

import { Container } from 'react-grid-system'
import { AuthContentBox, AuthSection } from "./AuthSections"
import AuthNav from "./AuthNav"

function AuthLayout({
  children,
  page
}) {
  return (
    <AuthSection>
      <Container
        xl lg md sm xs
      >
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