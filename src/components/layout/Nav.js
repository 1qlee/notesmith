import React, { useState } from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"
import { Link } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { useShoppingCart } from "../../hooks/useShoppingCart"
import { isBrowser } from "../../utils/helper-functions"
import { List } from "@phosphor-icons/react"

import { Container } from "react-grid-system"
import Banner from "../ui/Banner"
import Logo from "../misc/Logo"
import Icon from "../ui/Icon"

const StyledNav = styled.nav`
  width: 100%;
  border-bottom: ${colors.borders.black};
  background-color: ${colors.white};
  &.has-shadow {
    box-shadow: 0 2px 0 ${colors.shadow.float};
  }
`

const NavLink = styled(Link)`
  opacity: 0.75;
  font-size: 0.875rem;
  white-space: nowrap;
  &:hover {
    opacity: 1;
  }
`

const NavSection = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  justify-content: ${props => props.justifycontent};
  height: 100%;
  &.nav-items {
    @media only screen and (max-width: 520px) {
      flex-direction: column;
      position: absolute;
      justify-content: flex-start;
      align-items: flex-end;
      top: 100%;
      height: auto;
      flex: 1;
      right: 0;
      display: none;
      background-color: ${colors.white};
      border: ${colors.borders.black};
      z-index: 99;
      &.is-active {
        display: flex;
      }
    }
  }
`

const NavItem = styled.div`
  color: ${colors.gray.nineHundred};
  font-weight: 400;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 1rem;
  &:last-child {
    padding: 16px 0 16px 16px;
    @media only screen and (max-width: 520px) {
      padding: 8px 16px;
    }
  }
`

const Navbar = styled.div`
  background-color: ${colors.white};
  display: ${props => props.hideNavbar ? "none" : "flex"};
  align-items: center;
  position: relative;
  justify-content: space-between;
  width: 100%;
  z-index: 999;
`

const NavLogo = styled.div`
  width: ${widths.logo};
  padding: 1rem 0;
  transition: background-color 0.1s;
`

const CartCounter = styled.span`
  margin-left: 0.25rem;
`

const NavMenu = styled.div`
  display: none;
  @media (max-width: 520px) {
    display: block;
  }
`

const Nav = ({ auth, hideNavbar }) => {
  const [showMenu, setShowMenu] = useState(false)
  let hideDashboard = false

  if (isBrowser) {
    // get pathnames
    const path = window.location.pathname

    // get the first part of the pathname
    const pathArray = path.split("/")
    const firstPath = pathArray[1]

    if (firstPath === "account") {
      hideDashboard = true
    }
  }

  const { user, signOut, loading } = useFirebaseContext()
  const { cartCount, clearCart } = useShoppingCart()

  const handleSignOut = () => {
    clearCart()
    signOut()
  }

  return (
    <StyledNav>
      <Banner 
        text="Get 25% off during the pre-order sale, live now!"
        link={{
          to: "/products/notebooks/pro-wired-notebook-a5-custom/white",
          text: "Shop now"
        }}
      />
      <Container xl lg md sm xs>
        <Navbar hideNavbar={hideNavbar}>
          <NavSection>
            <Link to="/">
              <NavLogo>
                <Logo width="100%" height="100%" color={colors.gray.nineHundred} />
              </NavLogo>
            </Link>
          </NavSection>
          <Icon
            as={NavMenu}
            onClick={() => setShowMenu(!showMenu)}
            size={20}
            padding="4px"
          >
            <List />
          </Icon>
          {!loading && (
            <NavSection
              justifycontent="flex-end"
              className={`nav-items ${showMenu ? "is-active " : ""}`}
            >
              <NavItem>
                <NavLink
                  to="/products/notebooks/pro-wired-notebook-a5-custom/white"
                  color={colors.gray.nineHundred}
                >
                  Shop
                </NavLink>
              </NavItem>
              {user ? (
                <>
                  {!hideDashboard && (
                    <NavItem>
                      <NavLink
                        to="/account/dashboard"
                        color={colors.gray.nineHundred}
                      >
                        Dashboard
                      </NavLink>
                    </NavItem>
                  )}
                  <NavItem>
                    <NavLink
                      as="a"
                      tabIndex={0}
                      onClick={() => handleSignOut()}
                      color={colors.gray.nineHundred}
                    >
                      Sign out
                    </NavLink>
                  </NavItem>
                </>
              ) : (
                <>
                  <NavItem>
                    <NavLink
                      to="/signin"
                      color={colors.gray.nineHundred}
                    >
                      Sign in
                    </NavLink>
                  </NavItem>
                  <NavItem
                    className="last-item"
                  >
                    <NavLink
                      to="/signup"
                      color={colors.gray.nineHundred}
                    >
                      Sign up
                    </NavLink>
                  </NavItem>
                </>
              )}
              <NavItem>
                <NavLink
                  to="/cart"
                  color={colors.gray.nineHundred}
                >
                  Cart
                  {cartCount > 0 && (
                    <CartCounter>
                      ({cartCount})
                    </CartCounter>
                  )}
                </NavLink>
              </NavItem>
            </NavSection>
          )}
        </Navbar>
      </Container>
    </StyledNav>
  )
}

export default Nav
