import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import useIsClient from "../../hooks/useIsClient"
import 'react-toastify/dist/ReactToastify.css'
import "./master.css"

import Nav from "./Nav"
import Loader from "../misc/Loader"
import Footer from "../ui/Footer"
import Toastify from "../ui/Toastify"
import Seo from "./Seo"

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
  const { isClient, key } = useIsClient()
  if (!isClient) return null;

  return (
    <StyledLayout 
      key={key} 
      className={className} 
      backgroundcolor={backgroundcolor}
    >
      <Seo 
        details={seoDetails}
        hideScroll={hideScroll}
      />
      <Nav />
      {children}
      {loading && (
        <Loader 
          msg={loaderMsg}
          className={loaderClassName}
        />
      )}
      <Footer />
      <Toastify />
    </StyledLayout>
  )
}

export default Layout
