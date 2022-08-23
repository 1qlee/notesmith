import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { widths, colors, fonts } from "../../../styles/variables"
import { useFirebaseContext } from "../../../utils/auth"

const StyledSidebar = styled.div`
  display: flex;
  border-bottom: 2px solid ${colors.gray.nineHundred};
  margin-bottom: 2rem;
  width: 100%;
`

const SidebarLink = styled.a`
  color: ${colors.gray.nineHundred};
  display: block;
  font-family: ${fonts.secondary};
  font-weight: 700;
  padding: 1rem 0;
  font-size: 0.875rem;
  margin-bottom: 1px;
  &:not(:last-child) {
    margin-right: 2rem;
  }
  &:hover {
    &:not(.is-active) {
      box-shadow: 0 4px 0 ${colors.gray.nineHundred};
    }
  }
  &.is-active {
    box-shadow: 0 4px 0 ${colors.gray.nineHundred};
  }
`

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
`

function AuthNav({
  page
}) {
  const { signOut } = useFirebaseContext()

  return (
    <StyledSidebar>
      <SidebarLink
        className={page === "Dashboard" ? "is-active" : null}
        as={Link}
        to="/account/dashboard"
      >
        <SidebarItem>
          Dashboard
        </SidebarItem>
      </SidebarLink>
      <SidebarLink
        className={page === "Books" ? "is-active" : null}
        as={Link}
        to="/account/books"
      >
        <SidebarItem>
          Books
        </SidebarItem>
      </SidebarLink>
      <SidebarLink
        className={page === "Templates" ? "is-active" : null}
        as={Link}
        to="/account/templates"
      >
        <SidebarItem>
          Templates
        </SidebarItem>
      </SidebarLink>
      <SidebarLink
        className={page === "Settings" ? "is-active" : null}
        as={Link}
        to="/account/settings"
      >
        <SidebarItem
          className={page === "Settings" ? "is-active" : null}
        >
          Settings
        </SidebarItem>
      </SidebarLink>
    </StyledSidebar>
  )
}

export default AuthNav
