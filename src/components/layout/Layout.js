import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import 'react-toastify/dist/ReactToastify.css'
import "./master.css"

import Loader from "../misc/Loader"
import Footer from "../ui/Footer"

const StyledLayout = styled.div`
  background-color: ${props => props.backgroundcolor || colors.white};
  height: 100%;
  overflow-x: hidden;
  position: relative;
  width: 100%;
  &.is-full-height {
    min-height: 100vh;
  }
`

const Layout = ({ loading, children, className, backgroundcolor }) => {

  return (
    <StyledLayout className={className} backgroundcolor={backgroundcolor}>
      {children}
      {loading && (
        <Loader />
      )}
      <Footer />
    </StyledLayout>
  )
}

export default Layout
