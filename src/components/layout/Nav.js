import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"
import { Link } from "gatsby"
import { ShoppingBag } from "phosphor-react"
import { useFirebaseContext } from "../../utils/auth"
import { useShoppingCart } from "use-shopping-cart"

import Button from "../Button"
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
    text-decoration: underline;
    cursor: pointer;
  }
`

const HorizontalNav = styled.div`
  background-color: ${colors.paper.offWhite};
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
  &:hover {
    svg {
      stroke: ${colors.primary.sixHundred};
    }
  }
`

const CartCounterWrapper = styled.div`
  position: relative;
`

const CartCounter = styled.div`
  min-height: 1rem;
  min-width: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
  line-height: .5rem;
  font-size: 0.625rem;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  background-color: ${colors.primary.sixHundred};
  color: ${colors.primary.white};
  border-radius: 4px;
  position: absolute;
  left: calc(100% - 0.25rem);
  top: -0.9rem;
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
              <NavItem
                as={Link}
                to="/products/"
              >
                Shop
              </NavItem>
              {user ? (
                <>
                  <NavItem
                    as={Link}
                    to="/app/dashboard"
                  >
                    Dashboard
                  </NavItem>
                  <NavItem
                    onClick={() => signOut()}
                    as="a"
                  >
                    Sign out
                  </NavItem>
                </>
              ) : (
                <>
                  <NavItem
                    as={Link}
                    to="/signin"
                  >
                    Sign in
                  </NavItem>
                  <NavItem
                    as={Link}
                    to="/signup"
                    className="last-item"
                  >
                    Sign Up
                  </NavItem>
                </>
              )}
            </NavSection>
            <NavItem
              as={Link}
              to="/cart"
            >
              <CartCounterWrapper
                cartCount={cartCount}
              >
                Cart
                <CartCounter>{cartCount}</CartCounter>
              </CartCounterWrapper>
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
