import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { widths, colors, fonts } from "../../styles/variables"
import { Books, ChalkboardSimple, GearSix, SignOut } from "phosphor-react"
import { useFirebaseContext } from "../../utils/auth"

import Content from "../Content"
import Icon from "../Icon"

const StyledSidebar = styled.div`
  background-color: ${colors.white};
  border-right: 1px solid ${colors.gray.threeHundred};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: ${widths.sidebar};
  padding: 0 2rem;
  width: ${widths.sidebar};
`

const SidebarLink = styled.a`
  color: ${colors.primary.sixHundred};
  display: block;
  border-radius: 0.25rem;
  margin: 0.25rem 0;
  font-family: ${fonts.secondary};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  &:hover {
    &:not(.is-active) {
      background-color: ${colors.primary.hover};
      color: ${colors.primary.nineHundred};
    }
  }
  &.is-active {
    background-color: ${colors.gray.oneHundred};
    color: ${colors.primary.nineHundred};
  }
`

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
`

const SidebarFooter = styled.div`

`

function Sidebar({
  page
}) {
  const { signOut } = useFirebaseContext()

  return (
    <StyledSidebar>
      <div>
        <Content
          margin="2rem 0"
        >
          <h3>Navigation</h3>
        </Content>
        <SidebarLink
          className={page === "Dashboard" ? "is-active" : null}
          as={Link}
          to="/account/dashboard"
        >
          <SidebarItem>
            <Icon margin="0 0.5rem 0 0">
              <ChalkboardSimple size={20} />
            </Icon>
            <span>Dashboard</span>
          </SidebarItem>
        </SidebarLink>
        <SidebarLink
          className={page === "Books" ? "is-active" : null}
          as={Link}
          to="/account/books"
        >
          <SidebarItem>
            <Icon margin="0 0.5rem 0 0">
              <Books size={20} />
            </Icon>
            <span>My Books</span>
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
            <Icon margin="0 0.5rem 0 0">
              <GearSix size={20} />
            </Icon>
            <span>Settings</span>
          </SidebarItem>
        </SidebarLink>
      </div>
      <SidebarFooter>
        <SidebarLink
          onClick={() => signOut()}
        >
        <SidebarItem
          className={page === "Settings" ? "is-active" : null}
        >
          <Icon margin="0 0.5rem 0 0">
            <SignOut size={20} />
          </Icon>
          <span>Sign out</span>
        </SidebarItem>
        </SidebarLink>
      </SidebarFooter>
    </StyledSidebar>
  )
}

export default Sidebar
