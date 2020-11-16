import React, { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import styled from "styled-components"

import { colors } from "../../styles/variables"

import { FlexContainer } from "./Container"
import Button from "../Button"
import ClientOnly from "../ClientOnly"
import Loader from "../Loader"
import Logo from "../Logo"

const StyledNav = styled.nav`
  background-color: ${colors.white};
  width: 100%;
`

const HorizontalNav = styled.div`
  background-color: ${colors.paper.cream};
  display: ${props => props.hideNavbar ? "none" : "block"};
  left: 0;
  position: fixed;
  height: 96px;
  width: 100%;
  z-index: 9;
`

const HorizontalNavInnerBox = styled.div`
  background-color: ${colors.paper.cream};
  border-color: ${colors.gray.sixHundred};
  border-style: solid;
  border-width: 1px 0;
  padding-left: 96px;
  position: relative;
  top: 1rem;
`

const VerticalNav = styled.div`
  height: 100%;
  position: fixed;
  width: 96px;
  z-index: 10;
`

const VerticalNavInnerBox = styled.div`
  border-color: ${colors.gray.sixHundred};
  border-style: solid;
  border-width: 0 1px;
  height: 100%;
  left: 1rem;
  text-align: center;
  padding-top: 1rem;
  position: relative;
  width: 79px;
`

const VerticalNavItem = styled.div`
  white-space: nowrap;
  transform: rotate(90deg);
  &:first-child {
    margin-top: 96px;
  }
`

const ChapterNumberHeader = styled.h2`
  line-height: 2rem;
  margin: 1rem 0.5rem 96px 0.5rem;
`

const ChapterNameHeader = styled.div`
  display: inline-block;
  letter-spacing: 1px;
  padding: 0.25rem;
  position: relative;
  text-transform: uppercase;
  &::before {
    background-color: ${props => props.color};
    content: "";
    height: 1px;
    left: -0.6rem;
    position: absolute;
    top: 0.95rem;
    width: 0.5rem;
  }
  &::after {
    background-color: ${props => props.color};
    content: "";
    height: 1px;
    right: -0.6rem;
    position: absolute;
    top: 0.95rem;
    width: 0.5rem;
  }
  p {
    color: ${props => props.color};
    margin-bottom: 0;
    font-weight: 700;
    font-size: 0.6rem;
  }
`

const NavSection = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  justify-content: ${props => props.justifyContent};
`

const NavItem = styled.div`
  color: ${colors.gray.eightHundred};
  display: flex;
  align-items: center;
  padding: 1rem;
`

const NavButton = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 1rem;
  position: relative;
  text-align: center;
  transition: background-color 200ms;
  width: 300px;
  &.is-active {
    background-color: ${colors.white};
    color: ${colors.gray.nineHundred};
  }
  &:hover {
    cursor: pointer;
  }
`

const NavLogo = styled.div`
  position: relative;
  padding: 1rem;
`

function Nav(props) {
  const { isLoading, isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

  return (
    <StyledNav>
      <HorizontalNav hideNavbar={props.hideNavbar}>
        <HorizontalNavInnerBox>
          <FlexContainer maxWidth="1500px">
            <NavSection justifyContent="flex-start">
              <Link to="/">
                <NavLogo>
                  <Logo color={colors.primary.sixHundred} />
                </NavLogo>
              </Link>
            </NavSection>
            <ClientOnly>
              <NavSection justifyContent="flex-end">
                <NavItem>
                  <Link to="/login">Firebase Login</Link>
                </NavItem>
                {isAuthenticated ? (
                  <>
                    <NavItem>
                      <Link to="account">{user.email}</Link>
                    </NavItem>
                    <NavItem>
                      <Button
                        onClick={() => logout()}
                        borderRadius="0.25rem"
                        color={colors.white}
                        background={colors.primary.sixHundred}
                        className="is-small"
                      >
                        Log Out
                      </Button>
                    </NavItem>
                  </>
                ) : (
                  <>
                    <NavItem>
                      <Button
                        onClick={() => loginWithRedirect({
                          appState: { targetUrl: `${window.location.pathname}`},
                        })}
                        color={colors.white}
                        background={colors.primary.sixHundred}
                        className="is-small"
                      >
                        Auth0 Login
                      </Button>
                    </NavItem>
                  </>
                )}
              </NavSection>
            </ClientOnly>
          </FlexContainer>
        </HorizontalNavInnerBox>
      </HorizontalNav>
      <VerticalNav>
        <VerticalNavInnerBox>
          <ChapterNumberHeader>{props.chapterNumber}</ChapterNumberHeader>
          <VerticalNavItem>
            <ChapterNameHeader color={colors.primary.sixHundred}>
              <p>{props.title}</p>
            </ChapterNameHeader>
          </VerticalNavItem>
        </VerticalNavInnerBox>
      </VerticalNav>
    </StyledNav>
  )
}

Nav.propTypes = {
  chapterNumber: PropTypes.string.isRequired,
  chapterName: PropTypes.string.isRequired,
}

export default Nav
