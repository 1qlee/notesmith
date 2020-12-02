import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import styled from "styled-components"
import { useFirebaseContext } from "../../utils/auth"

import { colors, widths } from "../../styles/variables"

import Button from "../Button"
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
  height: 78px;
  position: relative;
  top: 1rem;
`

const HorizontalNavContainer = styled.div`
  display: flex;
  max-width: ${widths.desktop};
  margin: 0 auto;
  width: 100%;
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
  width: 78px;
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
  &.first-item {
    padding: 1rem 1rem 1rem 0;
  }
  &.last-item {
    padding: 1rem 0 1rem 1rem;
  }
`

function Nav(props) {
  const { user, signOut, loading } = useFirebaseContext()

  return (
    <StyledNav>
      <HorizontalNav hideNavbar={props.hideNavbar}>
        <HorizontalNavInnerBox>
          <HorizontalNavContainer>
            <NavSection justifyContent="flex-start">
              <Link to="/">
                <NavItem className="first-item">
                  <Logo color={colors.primary.sixHundred} />
                </NavItem>
              </Link>
            </NavSection>
            {!loading && (
              <NavSection justifyContent="flex-end">
                {user ? (
                  <>
                    <NavItem>
                      <Link to="/app/dashboard">Dashboard</Link>
                    </NavItem>
                    <NavItem className="last-item">
                      <Button
                        color={colors.white}
                        backgroundColor={colors.primary.sixHundred}
                      >
                        Log Out
                      </Button>
                    </NavItem>
                  </>
                ) : (
                  <>
                    <NavItem>
                      <Link to="/login">Log In</Link>
                    </NavItem>
                    <NavItem className="last-item">
                      <Button
                        color={colors.white}
                        backgroundColor={colors.primary.sixHundred}
                        as={Link}
                        to="/signup"
                      >
                        Sign Up
                      </Button>
                    </NavItem>
                  </>
                )}
              </NavSection>
            )}
          </HorizontalNavContainer>
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

function NavProfile() {

}

Nav.propTypes = {
  chapterNumber: PropTypes.string,
  title: PropTypes.string,
  hideNavbar: PropTypes.bool,
}

export default Nav
