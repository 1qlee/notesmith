import React, { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import { colors, fonts, widths, breakpoints } from "../../styles/variables"
import { Link } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { useShoppingCart } from "../cart/context/cartContext"
import { isBrowser } from "../../utils/helper-functions"
import { ShoppingCartSimple, User } from "@phosphor-icons/react"

import { Container } from "react-grid-system"
import Banner from "../ui/Banner"
import Logo from "../misc/Logo"
import Tag from "../ui/Tag"
import Icon from "../ui/Icon"
import Button from "../ui/Button"

const StyledNav = styled.nav`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: ${colors.borders.black};
  background-color: ${colors.white};
  z-index: 33;
  &.has-shadow {
    box-shadow: 0 2px 0 ${colors.shadow.float};
  }
`

const CartBadge = styled(Tag)`
  position: absolute;
  transform: translate(50%, 0%);
  top: ${props => props.top};
  right: ${props => props.right};
  font-size: 0.625rem;
  @media only screen and (max-width: ${breakpoints.xs}) {
    transform: translate(50%, 0%) scale(0.75);
  }
`

const NavButton = styled(Button)`
  padding: 8px;
  position: relative;
  background-color: ${colors.white};
  color: ${colors.gray.nineHundred};
  margin: 0 4px;
  &:hover {
    background-color: ${colors.gray.twoHundred};
  }
`

const NavLink = styled(Link)`
  opacity: 0.75;
  font-size: 1rem;
  white-space: nowrap;
  padding: 8px 16px;
  border-radius: 8px;
  &:hover {
    opacity: 1;
    background-color: ${colors.gray.twoHundred};
  }
`

const NavSection = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  justify-content: ${props => props.justify};
  height: 100%;
  &.remove-on-mobile {
    @media only screen and (max-width: ${breakpoints.xs}) {
      display: none;
    }
  }
`

const NavItem = styled.li`
  align-items: center;
  color: ${colors.gray.nineHundred};
  display: flex;
  position: relative;
  @media only screen and (max-width: ${breakpoints.xs}) {
    width: 100%;
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

const NavMenuButton = styled.button`
  display: none;
  position: relative;
  background-color: transparent;
  border: none;
  padding: 16px;
  &:hover {
    cursor: pointer;
  }
  @media (max-width: ${breakpoints.xs}) {
    display: block;
  }
`

const NavMenuIcon = styled.span`
  position: absolute;
  height: 1px;
  width: ${props => props.showMenu ? "0" : "16px"};
  background-color: ${props => props.showMenu ? "transparent" : colors.gray.nineHundred};
  top: 16px;
  left: 4px;
  transition: width 0.2s, background-color 0.2s;
  pointer-events: none;
  &::before {
    transition-duration: 0.2s;
    position: absolute;
    width: 20px;
    height: 1px;
    left: 0;
    background-color: ${colors.gray.nineHundred};
    content: "";
    top: -8px;
    transform: ${props => props.showMenu ? "rotateZ(45deg) translate(5px, 6px)" : "rotateZ(0deg) scaleX(1) translate(0px, 0px)"};
  }
  &::after {
    transition-duration: 0.2s;
    position: absolute;
    width: 20px;
    height: 1px;
    left: 0;
    background-color: ${colors.gray.nineHundred};
    content: "";
    top: 8px;
    transform: ${props => props.showMenu ? "rotateZ(-45deg) translate(5px, -6px)" : "rotateZ(0deg) scaleX(1) translate(0px, 0px)"};
  }
`

const NavGroup = styled.div`
  position: relative;
  &.remove-on-mobile {
    @media only screen and (max-width: ${breakpoints.xs}) {
      display: none;
    }
  }
`

const DropdownMenu = styled.ul`
  background-color: ${colors.white};
  box-shadow: ${colors.shadow.layeredSmall};
  left: 50%;
  list-style: none;
  position: absolute;
  top: calc(100% + 19px);
  transform: translateX(-50%);
  padding: 16px 4px;
  border: ${colors.borders.black};
  width: ${widths.dropdown};
  z-index: 24;
  a {
    width: 100%;
  }
`

const NavHeading = styled.h5`
  color: ${colors.gray.nineHundred};
  font-size: 0.625rem;
  font-family: ${fonts.secondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1;
  padding: 0 16px;
  font-weight: 700;
  margin-bottom: 8px;
  &:not(:first-child) {
    margin-top: 16px;
  }
`

const NavMenu = styled.ul`
  align-items: flex-end;
  background-color: ${colors.white};
  border: ${colors.borders.black};
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100vh - 120px);
  justify-content: flex-start;
  max-width: ${widths.sidebar};
  opacity: 0;
  overflow-y: auto;
  position: absolute;
  padding: 16px 4px;
  right: -16px;
  top: 74px;
  transform: translateX(100%);
  transition: transform 0.2s, opacity 0.4s, visibility 1s;
  visibility: hidden;
  width: 85vw;
  z-index: 23;
  will-change: transform;
  a {
    font-size: 1.25rem;
    padding: 8px 16px;
    text-align: right;
    width: 100%;
  }
  &.is-active {
    transform: translateX(0);
    @media only screen and (max-width: ${breakpoints.xs}) {
      opacity: 1;
      visibility: visible;
    }
  }
`

const Nav = ({ auth, hideNavbar }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navMenuRef = useRef(null)
  const userMenuRef = useRef(null)
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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const { target } = event

      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false)
      }

      if (navMenuRef.current && !navMenuRef.current.contains(target)) {
        if (target.getAttribute("id") === "nav-menu-button") {
          return
        }
        setShowMenu(false)
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [userMenuRef, navMenuRef])

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
            <Link 
              to="/"
              aria-label="Go to home page"
            >
              <NavLogo>
                <Logo 
                  width="100%" 
                  height="100%" 
                  color={colors.gray.nineHundred} 
                />
              </NavLogo>
            </Link>
          </NavSection>
          <NavSection
            justify="center"
            className="remove-on-mobile"
          >
            <NavItem>
              <NavLink
                to="/products/notebooks/pro-wired-notebook-a5-custom/white"
                color={colors.gray.nineHundred}
              >
                Shop
              </NavLink>
            </NavItem>
          </NavSection>
          {!loading && (
            <NavSection
              justify="flex-end"
            >
              <NavGroup
                className="remove-on-mobile"
              >
                <NavButton
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <Icon>
                    <User size={20} weight="bold" />
                  </Icon>
                </NavButton>
                {showUserMenu && (
                  <DropdownMenu
                    ref={userMenuRef}
                  >
                    <NavHeading>
                      Account
                    </NavHeading>
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
                    <NavHeading>
                      Support
                    </NavHeading>
                    <NavItem
                      className="last-item"
                    >
                      <NavLink
                        to="/faq"
                        color={colors.gray.nineHundred}
                      >
                        FAQ
                      </NavLink>
                    </NavItem>
                    <NavItem
                      className="last-item"
                    >
                      <NavLink
                        to="/return-policy"
                        color={colors.gray.nineHundred}
                      >
                        Return policy
                      </NavLink>
                    </NavItem>
                  </DropdownMenu>
                )}
              </NavGroup>
              <NavGroup>
                <NavButton
                  as={Link}
                  to="/cart"
                  aria-label="Go to cart"
                >
                  <Icon>
                    <ShoppingCartSimple size={20} weight="bold" />
                  </Icon>
                  {cartCount > 0 && (
                    <CartBadge
                      borderradius="50%"
                      top={cartCount > 9 ? "-2px" : "0px"}
                      right={cartCount > 9 ? "-2px" : "0px"}
                      padding={cartCount > 9 ? "4px 3px" : "2px 4px"}
                    >
                      {cartCount}
                    </CartBadge>
                  )}
                </NavButton>
              </NavGroup>
              <NavMenuButton
                id="nav-menu-button"
                aria-label="Toggle nav menu"
                onClick={() => setShowMenu(!showMenu)}
                showMenu={showMenu}
              >
                <NavMenuIcon 
                  showMenu={showMenu} 
                  onClick={e => e.stopPropagation()}
                />
              </NavMenuButton>
              <NavMenu
                className={showMenu ? "is-active" : ""}
                ref={navMenuRef}
              >
                <NavHeading>Shop</NavHeading>
                <NavItem>
                  <NavLink
                    to="/products/notebooks/pro-wired-notebook-a5-custom/white"
                  >
                    Notebooks
                  </NavLink>
                </NavItem>
                <NavHeading>Support</NavHeading>
                <NavItem>
                  <NavLink
                    to="/faq"
                  >
                    FAQ
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="/return-policy"
                  >
                    Return policy
                  </NavLink>
                </NavItem>
                <NavHeading>Account</NavHeading>
                {user ? (
                  <>
                    {!hideDashboard && (
                      <NavItem>
                        <NavLink
                          to="/account/dashboard"
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
                      >
                        Sign in
                      </NavLink>
                    </NavItem>
                    <NavItem
                      className="last-item"
                    >
                      <NavLink
                        to="/signup"
                      >
                        Sign up
                      </NavLink>
                    </NavItem>
                  </>
                )}
              </NavMenu>
            </NavSection>
          )}
        </Navbar>
      </Container>
    </StyledNav>
  )
}

export default Nav
