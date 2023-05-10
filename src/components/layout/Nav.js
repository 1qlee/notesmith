import React from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"
import { Link } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { useShoppingCart } from "use-shopping-cart"

import { Container } from "react-grid-system"
import Banner from "../ui/Banner"
import TextLink from "../ui/TextLink"
import Logo from "../misc/Logo"

const StyledNav = styled.nav`
  width: 100%;
  border-bottom: 2px solid ${colors.gray.nineHundred};
  background-color: ${colors.white};
  &.has-shadow {
    box-shadow: 0 2px 0 ${colors.shadow.float};
  }
`

const NavSection = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  justify-content: ${props => props.justifycontent};
  height: 100%;
`

const NavItem = styled.div`
  color: ${colors.gray.nineHundred};
  font-weight: 700;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.825rem;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  &:last-child {
    padding: 1rem 0 1rem 1rem;
  }
`

const HorizontalNav = styled.div`
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

function Nav(props) {
  const { user, signOut, loading } = useFirebaseContext()
  const { cartCount } = useShoppingCart()

  return (
    <StyledNav>
      <Banner 
        text="Join our pre-order sale now at an exclusive discounted price!"
        link={{
          to: "/products/notebooks/wired-notebook-a5-custom/white",
          text: "Shop now"
        }}
      />
      <Container xl lg md sm xs>
        <HorizontalNav hideNavbar={props.hideNavbar}>
          <NavSection>
            <Link to="/">
              <NavLogo>
                <Logo width="100%" height="100%" color={colors.gray.nineHundred} />
              </NavLogo>
            </Link>
          </NavSection>
          {!loading && (
            <>
              <NavSection justifycontent="center">
                <NavItem>
                  <TextLink
                    as={Link}
                    to="/products/notebooks/wired-notebook-a5-custom/white"
                    color={colors.gray.nineHundred}
                  >
                    Shop
                  </TextLink>
                </NavItem>
                {user ? (
                  <>
                    <NavItem>
                      <TextLink
                        as={Link}
                        to="/account/dashboard"
                        color={colors.gray.nineHundred}
                      >
                        Dashboard
                      </TextLink>
                    </NavItem>
                    <NavItem>
                      <TextLink
                        onClick={() => signOut()}
                        color={colors.gray.nineHundred}
                      >
                        Sign out
                      </TextLink>
                    </NavItem>
                  </>
                ) : (
                  <>
                    <NavItem>
                      <TextLink
                        as={Link}
                        to="/signin"
                        color={colors.gray.nineHundred}
                      >
                        Sign in
                      </TextLink>
                    </NavItem>
                    <NavItem
                      className="last-item"
                    >
                      <TextLink
                        as={Link}
                        to="/signup"
                        color={colors.gray.nineHundred}
                      >
                        Sign up
                      </TextLink>
                    </NavItem>
                  </>
                )}
              </NavSection>
              <NavSection
                justifycontent="flex-end"
              >
                <NavItem>
                  <TextLink
                    as={Link}
                    to="/cart"
                    color={colors.gray.nineHundred}
                  >
                    Cart
                    {cartCount > 0 && (
                      <CartCounter>
                        ({cartCount})
                      </CartCounter>
                    )}
                  </TextLink>
                </NavItem>
              </NavSection>
            </>
          )}
        </HorizontalNav>
      </Container>
    </StyledNav>
  )
}


export default Nav
