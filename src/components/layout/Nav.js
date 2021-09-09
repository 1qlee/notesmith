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

const HorizontalNav = styled.div`
  background-color: ${colors.primary.sixHundred};
  display: ${props => props.hideNavbar ? "none" : "block"};
  left: 0;
  position: fixed;
  height: 96px;
  width: 100%;
  z-index: 9;
`

const HorizontalNavInnerBox = styled.div`
  background-color: ${colors.paper.offWhite};
  border-bottom: 1px solid ${colors.gray.threeHundred};
  box-shadow: 1px 0 2px ${colors.shadow.float};
  padding-left: 96px;
  height: 80px;
  position: relative;
  top: 1rem;
  @media only screen and (max-width: ${widths.tablet}) {
    padding-left: 0;
  }
`

const HorizontalNavContainer = styled.div`
  display: flex;
  max-width: ${widths.desktop};
  margin: 0 auto;
  width: 100%;
  @media only screen and (max-width: 1585px) {
    padding: 0 1rem;
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

const NavSection = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  justify-content: ${props => props.justifycontent};
`

const NavItem = styled.div`
  color: ${colors.gray.eightHundred};
  display: flex;
  align-items: center;
  padding: 1rem;
  font-size: 0.825rem;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  &.first-item {
    padding: 1rem 1rem 1rem 0;
  }
  &.last-item {
    padding: 1rem 0 1rem 1rem;
  }
`

function Nav(props) {
  const { user, signOut, loading } = useFirebaseContext()
  const { cartCount, totalPrice } = useShoppingCart()

  return (
    <StyledNav>
      <HorizontalNav hideNavbar={props.hideNavbar}>
        <HorizontalNavInnerBox>
          <HorizontalNavContainer>
            <NavSection justifycontent="flex-start">
              <Link to="/">
                <Logo color={colors.gray.nineHundred} />
              </Link>
            </NavSection>
            {!loading && (
              <NavSection justifycontent="flex-end">
                <NavItem>
                  <Link to="/shop">Shop</Link>
                </NavItem>
                {user ? (
                  <>
                    <NavItem>
                      <Link to="/app/dashboard">Dashboard</Link>
                    </NavItem>
                    <NavItem
                      onClick={() => signOut()}
                    >
                      Sign out
                    </NavItem>
                  </>
                ) : (
                  <>
                    <NavItem>
                      <Link to="/signin">Sign In</Link>
                    </NavItem>
                    <NavItem className="last-item">
                      <Link to="/signup">
                        Sign Up
                      </Link>
                    </NavItem>
                  </>
                )}
                <NavItem className="last-item">
                  <Button
                    className="has-icon"
                    borderradius="25px"
                    backgroundcolor={colors.paper.offWhite}
                    border={`1px solid ${colors.gray.sixHundred}`}
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
                </NavItem>
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
          <VerticalNavFooter>
            <Icon>
              <a href="https://www.instagram.com/notesmithbooks/" target="_blank" rel="noopener noreferrer">
                <InstagramLogo size="1.5rem" />
              </a>
            </Icon>
          </VerticalNavFooter>
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
