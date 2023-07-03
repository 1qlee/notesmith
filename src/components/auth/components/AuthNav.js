import React from "react"
import { Link } from "gatsby"

import { StyledTabs, StyledTab } from "../../ui/Tabs"

function AuthNav({
  page
}) {

  return (
    <StyledTabs>
      <StyledTab
        className={page === "Dashboard" ? "is-active" : null}
        as={Link}
        to="/account/dashboard"
      >
        Dashboard
      </StyledTab>
      <StyledTab
        className={page === "Books" ? "is-active" : null}
        as={Link}
        to="/account/books"
      >
        Books
      </StyledTab>
      <StyledTab
        className={page === "Templates" ? "is-active" : null}
        as={Link}
        to="/account/templates"
      >
        Templates
      </StyledTab>
      <StyledTab
        className={page === "Settings" ? "is-active" : null}
        as={Link}
        to="/account/settings"
      >
        Settings
      </StyledTab>
    </StyledTabs>
  )
}

export default AuthNav
