import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { widths, colors, fonts } from "../../../styles/variables"
import { Books, ChalkboardSimple, GearSix, SignOut } from "phosphor-react"
import { useFirebaseContext } from "../../../utils/auth"

import Icon from "../../Icon"
import Logo from "../../Logo"
import { Flexbox } from "../../layout/Flexbox"

const StyledSidebar = styled.div`
  background-color: ${colors.white};
  border-right: 1px solid ${colors.gray.nineHundred};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: ${widths.sidebar};
  width: ${widths.sidebar};
`

const SidebarLink = styled.a`
  color: ${colors.gray.nineHundred};
  display: block;
  font-family: ${fonts.secondary};
  font-weight: 700;
  padding: 1rem;
  font-size: 0.75rem;
  border-bottom: 1px solid ${colors.gray.nineHundred};
  &:first-child {
    border-top: 1px solid ${colors.gray.nineHundred};
  }
  &:hover {
    &:not(.is-active) {
      background-color: ${colors.gray.twoHundred};
    }
  }
  &.is-active {
    background-color: ${colors.gray.nineHundred};
    color: ${colors.gray.oneHundred};
    padding-left: 1.5rem;
  }
`

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
`

const SidebarContent = styled.div`
  height: calc(100% - 4rem);
  width: 100%;
`

function Sidebar({
  page
}) {
  const { signOut } = useFirebaseContext()

  return (
    <StyledSidebar>
      <Flexbox
        padding="1rem"
        alignitems="center"
        flex="flex"
      >
        <Logo width="125px" height="100%" color={colors.gray.nineHundred} />
      </Flexbox>
      <SidebarContent>
        <SidebarLink
          className={page === "Dashboard" ? "is-active" : null}
          as={Link}
          to="/account/dashboard"
        >
          <SidebarItem>
            <Icon margin="0 0.5rem 0 0">
              <ChalkboardSimple size="1rem" />
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
              <Books size="1rem" />
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
              <GearSix size="1rem" />
            </Icon>
            <span>Settings</span>
          </SidebarItem>
        </SidebarLink>
      </SidebarContent>
      <Flexbox>
        <SidebarLink
          onClick={() => signOut()}
        >
          <SidebarItem
            className={page === "Settings" ? "is-active" : null}
          >
            <Icon margin="0 0.5rem 0 0">
              <SignOut size={16} />
            </Icon>
            <span>Sign out</span>
          </SidebarItem>
        </SidebarLink>
      </Flexbox>
    </StyledSidebar>
  )
}

export default Sidebar
