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
        <b>Dashboard</b>
      </StyledTab>
      <StyledTab
        className={page === "Books" ? "is-active" : null}
        as={Link}
        to="/account/books"
      >
        <b>Books</b>
      </StyledTab>
      {/* <StyledTab
        className={page === "Templates" ? "is-active" : null}
        as={Link}
        to="/account/templates"
      >
        Templates
      </StyledTab> */}
      <StyledTab
        className={page === "Settings" ? "is-active" : null}
        as={Link}
        to="/account/settings"
      >
        <b>Settings</b>
      </StyledTab>
    </StyledTabs>
  )
}

export default AuthNav
