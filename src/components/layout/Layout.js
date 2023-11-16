import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { isBrowser } from "../../utils/helper-functions"
import 'react-toastify/dist/ReactToastify.css'
import "./master.css"

import Nav from "./Nav"
import Loader from "../misc/Loader"
import Footer from "../ui/Footer"
import Toastify from "../ui/Toastify"

const StyledLayout = styled.div`
  background-color: ${props => props.backgroundcolor || colors.white};
  height: 100%;
  overflow-x: hidden;
  position: relative;
  min-height: 600px;
  width: 100%;
  &.is-full-height {
    min-height: 100vh;
  }
`

const Layout = ({ loading, children, className, backgroundcolor, loaderClassName, loaderMsg }) => {
  if (isBrowser) {
    return (
      <StyledLayout
        className={className}
        backgroundcolor={backgroundcolor}
      >
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
}

export default Layout
