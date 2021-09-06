import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { widths, colors } from "../../styles/variables"
import { Books, ChalkboardSimple, GearSix } from "phosphor-react"

import Icon from "../Icon"

const StyledSidebar = styled.div`
  background-color: ${colors.primary.sixHundred};
  min-width: ${widths.sidebar};
  width: ${widths.sidebar};
  padding: 0 2rem;
`

const SideBarLink = styled.a`
  color: ${colors.primary.white};
  display: block;
  border-radius: 1rem;
  margin: 0.5rem 0;
  padding: 1rem;
  &:hover {
    &:not(.is-active) {
      background-color: ${colors.primary.hover};
      color: ${colors.gray.nineHundred};
    }
  }
  &.is-active {
    background-color: ${colors.primary.active};
    color: ${colors.gray.nineHundred};
  }
`

const SideBarItem = styled.div`
  display: flex;
  align-items: center;
`

function Sidebar({
  page
}) {
  return (
    <StyledSidebar>
      <SideBarLink
        className={page === "Dashboard" ? "is-active" : null}
        as={Link}
        to="/app/dashboard"
      >
        <SideBarItem>
          <Icon margin="0 0.5rem 0 0">
            <ChalkboardSimple size={20} />
          </Icon>
          <span>Dashboard</span>
        </SideBarItem>
      </SideBarLink>
      <SideBarLink
        className={page === "Books" ? "is-active" : null}
        as={Link}
        to="/app/books"
      >
        <SideBarItem>
          <Icon margin="0 0.5rem 0 0">
            <Books size={20} />
          </Icon>
          <span>Books</span>
        </SideBarItem>
      </SideBarLink>
      <SideBarLink
        className={page === "Settings" ? "is-active" : null}
        as={Link}
        to="/app/settings"
      >
        <SideBarItem
          className={page === "Settings" ? "is-active" : null}
        >
          <Icon margin="0 0.5rem 0 0">
            <GearSix size={20} />
          </Icon>
          <span>Settings</span>
        </SideBarItem>
      </SideBarLink>
    </StyledSidebar>
  )
}

export default Sidebar
