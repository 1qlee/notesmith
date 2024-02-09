import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import "./master.css"

import Nav from "./Nav"
import Loader from "../misc/Loader"
import Footer from "../ui/Footer"
import Seo from "./Seo"
import Toast from "../ui/Toast"

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

const Layout = ({
  loading,
  children,
  className,
  backgroundcolor,
  loaderClassName,
  loaderMsg,
  seoDetails,
  hideScroll,
}) => {
  return (
    <StyledLayout
      className={className}
      backgroundcolor={backgroundcolor}
    >
      <Nav />
      <Seo
        details={seoDetails}
        hideScroll={hideScroll}
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
