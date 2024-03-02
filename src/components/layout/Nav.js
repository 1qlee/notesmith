import React, { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import { colors, fonts, widths, breakpoints } from "../../styles/variables"
import { Link } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { useShoppingCart } from "../cart/context/cartContext"
import { ShoppingCartSimple, User, X } from "@phosphor-icons/react"

import { Container } from "react-grid-system"
import Banner from "../ui/Banner"
import Logo from "../misc/Logo"
import Tag from "../ui/Tag"
import Icon from "../ui/Icon"
import Button from "../ui/Button"
import ShoppingCart from "../shop/ShoppingCart"
import { Flexbox } from "./Flexbox"

const StyledNav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: ${colors.borders.black};
  background-color: ${colors.white};
  z-index: 50;
  &.has-shadow {
    box-shadow: 0 2px 0 ${colors.shadow.float};
  }
`

const CartBadge = styled(Tag)`
  position: absolute;
  transform: translate(50%, 0%);
  top: ${props => props.top};
  right: ${props => props.right};
  font-size: 0.7rem;
  font-weight: 400;
  height: ${props => props.height};
  line-height: ${props => props.height};
  width: ${props => props.width};
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
  z-index: 50;
`

const NavLogo = styled.div`
  height: 60px;
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
  top: calc(100% + 12px);
  transform: translateX(-50%);
  padding: 16px 4px;
  border: ${colors.borders.black};
  width: ${widths.dropdown};
  z-index: 99;
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
  height: calc(100vh - 107px);
  justify-content: flex-start;
  max-width: ${widths.sidebar};
  opacity: 0;
  overflow-y: auto;
  position: absolute;
  padding: 16px 4px;
  right: -16px;
  top: 60px;
  transform: translateX(100%);
  transition: transform 0.2s, opacity 0.4s, visibility 1s;
  visibility: hidden;
  width: 85vw;
  z-index: 99;
  will-change: transform;
  a {
    font-size: 1.25rem;
    padding: 8px 16px;
    text-align: right;
    width: 100%;
  }
  &.is-active {
    transform: translateX(0);
    border-top-width: 0;
    margin-top: 1px;
    @media only screen and (max-width: ${breakpoints.xs}) {
      opacity: 1;
      visibility: visible;
    }
  }
`

const CartDrawer = styled.div`
  opacity: 0;
  right: 0;
  position: fixed;
  border-left: ${colors.borders.black};
  top: 0;
  transition: transform 0.2s, opacity 0.4s, visibility 1s;
  background-color: ${colors.white};
  width: ${widths.drawer};
  visibility: hidden;
  transform: translateX(100%);
  height: 100%;
  z-index: 102;
  display: flex;
  flex-direction: column;
  &.is-active {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
    right: 0;
  }
  @media only screen and (max-width: ${breakpoints.xs}) {
    width: 100%;
  }
`

const Nav = ({ 
  setShowGrayArea,
  hideNavbar,
  setHideScroll,
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navMenuRef = useRef(null)
  const userMenuRef = useRef(null)
  const { user, signOut, loading } = useFirebaseContext()
  const { cartCount, clearCart, handleCartClick, shouldDisplayCart, handleCloseCart } = useShoppingCart()

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
    <>
      <CartDrawer
        className={shouldDisplayCart ? "is-active" : ""}
      >
        <Flexbox
          justify="flex-end"
          align="center"
          margin="16px"
        >
          <Button
            onClick={() => {
              setShowGrayArea(false)
              setHideScroll(false)
              handleCloseCart()
            }}
            borderradius="50%"
            backgroundcolor={colors.white}
            color={colors.gray.nineHundred}
            border={colors.borders.black}
            padding="8px"
          >
            <Icon>
              <X />
            </Icon>
          </Button>
        </Flexbox>
        <ShoppingCart 
          drawer
          setShowGrayArea={setShowGrayArea}
          setHideScroll={setHideScroll}
        />
      </CartDrawer>
      <StyledNav>
        <Banner 
          text="Early Access Sale! 25% off all notebooks."
          link={{
            to: "/products/notebooks/hardcover-wired-notebook-a5-custom/white",
            text: "Shop"
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
                  to="/products/notebooks/hardcover-wired-notebook-a5-custom/white"
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
                          <NavItem>
                            <NavLink
                              to="/account/dashboard"
                              color={colors.gray.nineHundred}
                            >
                              Dashboard
                            </NavLink>
                          </NavItem>
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
                    aria-label="Open cart"
                    onClick={() => {
                      setShowGrayArea(true)
                      setHideScroll(true)
                      handleCartClick()
                    }}
                  >
                    <Icon>
                      <ShoppingCartSimple size={20} weight="bold" />
                    </Icon>
                    {cartCount > 0 && (
                      <CartBadge
                        borderradius="50%"
                        top={cartCount > 9 ? "-2px" : "0px"}
                        right={cartCount > 9 ? "-2px" : "0px"}
                        width={cartCount > 9 ? "18px" : "16px"}
                        height={cartCount > 9 ? "18px" : "16px"}
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
                      to="/products/notebooks/hardcover-wired-notebook-a5-custom/white"
                    >
                      Notebooks
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      to="/cart"
                    >
                      Cart
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
                      <NavItem>
                        <NavLink
                          to="/account/dashboard"
                        >
                          Dashboard
                        </NavLink>
                      </NavItem>
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
    </>
  )
}

export default Nav
