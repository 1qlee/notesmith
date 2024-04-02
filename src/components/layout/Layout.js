import React, { useState } from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../../styles/variables"
import { useShoppingCart } from '../cart/context/cartContext'
import "./master.min.css"

import Nav from "./Nav"
import Loader from "../misc/Loader"
import Footer from "../ui/Footer"
import Seo from "./Seo"
import Toast from "../ui/Toast"

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const StyledLayout = styled.div`
  background-color: ${props => props.backgroundcolor || colors.white};
  overflow-x: hidden;
  position: relative;
  min-height: 600px;
  width: 100%;
  &.is-full-height {
    min-height: 100vh;
  }
`

const GrayArea = styled.div`
  animation: ${fadeIn} 0.3s ease-in-out;
  background-color: ${colors.gray.transparent};
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 99;
`

const Layout = ({
  backgroundcolor,
  children,
  className,
  loaderClassName,
  loaderMsg,
  loading,
  location,
  noScroll,
  seoDetails,
}) => {
  const { handleCloseCart, shouldDisplayCart } = useShoppingCart()
  const [showGrayArea, setShowGrayArea] = useState(false)
  const [hideScroll, setHideScroll] = useState(false)

  return (
    <StyledLayout
      className={className}
      backgroundcolor={backgroundcolor}
    >
      {(showGrayArea || shouldDisplayCart) && 
        <GrayArea 
          onClick={() => {
            setShowGrayArea(false)
            setHideScroll(false)
            handleCloseCart()
          }}
        />
      }
      <Nav 
        setShowGrayArea={setShowGrayArea}
        setHideScroll={setHideScroll}
        location={location}
      />
      <Seo
        details={seoDetails}
        hideScroll={hideScroll || shouldDisplayCart}
      />
      {children}
      {loading && (
        <Loader
          msg={loaderMsg}
          className={loaderClassName}
        />
      )}
      <Footer />
      <Toast />
    </StyledLayout>
  )
}

export default Layout
