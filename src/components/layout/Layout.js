import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import useIsClient from "../../hooks/checkClient"
import 'react-toastify/dist/ReactToastify.css'
import "./master.css"

import Seo from "./Seo"
import Nav from "./Nav"
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

const Layout = ({ title, loading, children, className, backgroundcolor }) => {
  const { isClient, key } = useIsClient()
  if (!isClient) return null;

  return (
    <StyledLayout 
      key={key} 
      className={className} 
      backgroundcolor={backgroundcolor}
    >
      <Seo 
        title={title}
      />
      <Nav />
      {children}
      {loading && (
        <Loader />
      )}
      <Footer />
    </StyledLayout>
  )
}

export default Layout
