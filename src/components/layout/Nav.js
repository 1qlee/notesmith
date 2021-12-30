import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"
import { Link } from "gatsby"
import { Tote } from "phosphor-react"
import { useFirebaseContext } from "../../utils/auth"
import { useShoppingCart } from "use-shopping-cart"
import { InstagramLogo } from "phosphor-react"

import Button from "../Button"
import Icon from "../Icon"
import Logo from "../Logo"

const StyledNav = styled.nav`
  background-color: ${colors.white};
  width: 100%;
`

const NavSection = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  justify-content: ${props => props.justifycontent};
  height: 100%;
  &.has-border-left {
    border-left: 2px solid ${colors.primary.sixHundred};
  }
`

const NavItem = styled.div`
  color: ${colors.primary.fourHundred};
  font-weight: 700;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.825rem;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  transition: color 0.1s, background-color 0.1s;
  &:hover {
    background-color: ${colors.primary.sixHundred};
    color: ${colors.gray.oneHundred};
  }
`

const HorizontalNav = styled.div`
  background-color: ${colors.paper.offWhite};
  border-bottom: 2px solid ${colors.primary.sixHundred};
  box-shadow: 0 2px 4px ${colors.shadow.float};
  display: ${props => props.hideNavbar ? "none" : "flex"};
  align-items: center;
  position: fixed;
  justify-content: space-between;
  left: 50%;
  height: 82px;
  transform: translateX(-50%);
  width: 100%;
  padding: 0 2rem;
  z-index: 9;
  @media only screen and (max-width: ${widths.tablet}) {
    padding-left: 0;
  }
`

const VerticalNav = styled.div`
  background-color: ${colors.primary.sixHundred};
  height: 100%;
  position: fixed;
  width: 80px;
  z-index: 10;
  @media only screen and (max-width: ${widths.tablet}) {
    width: 100%;
    height: 1rem;
  }
`

const VerticalNavInnerBox = styled.div`
  background-color: ${colors.paper.cream};
  box-shadow: 1px 0 4px ${colors.shadow.float};
  height: 100%;
  left: 0;
  text-align: center;
  padding-top: 1rem;
  position: relative;
  width: 80px;
  @media only screen and (max-width: ${widths.tablet}) {
    height: 1rem;
    width: 100%;
    padding-top: 0;
    display: flex;
    align-items: center;
  }
`

const VerticalNavItem = styled.div`
  white-space: nowrap;
  transform: rotate(90deg);
  &:first-child {
    margin-top: 96px;
  }
  @media only screen and (max-width: ${widths.tablet}) {
    transform: rotate(0deg);
  }
`

const VerticalNavFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  @media only screen and (max-width: ${widths.tablet}) {
    display: none;
  }
`

const ChapterNumberHeader = styled.h2`
  margin: 1rem 1rem 96px 1rem;
  color: ${colors.primary.sixHundred};
  @media only screen and (max-width: ${widths.tablet}) {
    margin: 0 1rem 0;
    font-size: 0.6rem;
    padding: 0.25rem;
  }
`

const ChapterNameHeader = styled.div`
  color: ${colors.primary.sixHundred};
  display: inline-block;
  letter-spacing: 1px;
  padding: 0.25rem;
  position: relative;
  text-transform: uppercase;
  p {
    color: ${props => props.color};
    margin-bottom: 0;
    font-weight: 700;
    font-size: 0.8rem;
    font-family: "Crimson Pro";
  }
  @media only screen and (max-width: ${widths.tablet}) {
    p {
      font-size: 0.6rem;
    }
  }
`

const NavLogo = styled.div`
  width: 160px;
  height: 80px;
  transition: background-color 0.1s;
  &:hover {
    svg {
      stroke: ${colors.primary.sixHundred};
    }
  }
`

function Nav(props) {
  const { user, signOut, loading } = useFirebaseContext()
  const { cartCount, totalPrice } = useShoppingCart()

  return (
    <StyledNav>
      <HorizontalNav hideNavbar={props.hideNavbar}>
        <Link to="/">
          <NavLogo>
            <Logo width="100%" height="100%" color={colors.gray.nineHundred} />
          </NavLogo>
        </Link>
        {!loading && (
          <>
            <NavSection justifycontent="center">
              <Link to="/notebooks/">
                <NavItem>Shop</NavItem>
              </Link>
              {user ? (
                <>
                  <Link to="/app/dashboard">
                    <NavItem>
                      Dashboard
                    </NavItem>
                  </Link>
                  <NavItem
                    onClick={() => signOut()}
                  >
                    Sign out
                  </NavItem>
                </>
              ) : (
                <>
                  <Link to="/signin">
                    <NavItem>
                      Sign in
                    </NavItem>
                  </Link>
                  <Link to="/signup">
                    <NavItem className="last-item">
                      Sign Up
                    </NavItem>
                  </Link>
                </>
              )}
            </NavSection>
            <Button
              className="has-icon"
              backgroundcolor={colors.primary.sixHundred}
              color={colors.gray.oneHundred}
              as={Link}
              to="/cart"
            >
              <Icon>
                <Tote size="1.5rem" />
              </Icon>
              {cartCount === 1 ? (
                <span>{cartCount} item</span>
              ) : (
                <span>{cartCount} items</span>
              )}
            </Button>
          </>
        )}
      </HorizontalNav>
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
