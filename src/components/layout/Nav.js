import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"
import { Link } from "gatsby"
import { ShoppingBag } from "phosphor-react"
import { useFirebaseContext } from "../../utils/auth"
import { useShoppingCart } from "use-shopping-cart"

import Button from "../Button"
import TextLink from "../TextLink"
import Icon from "../Icon"
import Logo from "../Logo"

const StyledNav = styled.nav`
  background-color: ${colors.white};
  max-width: 1440px;
  margin: 0 auto;
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
  @media only screen and (max-width: ${widths.tablet}) {
    padding-left: 0;
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
  padding: 1rem 0;
  transition: background-color 0.1s;
`

const CartCounter = styled.span`
  margin-left: 0.25rem;
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
              <NavItem>
                <TextLink
                  as={Link}
                  to="/products"
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
          </>
        )}
      </HorizontalNav>
    </StyledNav>
  )
}


Nav.propTypes = {
  chapterNumber: PropTypes.string,
  title: PropTypes.string,
  hideNavbar: PropTypes.bool,
}

export default Nav
