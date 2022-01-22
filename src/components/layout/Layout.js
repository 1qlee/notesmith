import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import "./master.css"
import { colors } from "../../styles/variables"

const StyledLayout = styled.div`
  background-color: ${props => props.backgroundcolor || colors.paper.offWhite};
  height: 100%;
  overflow-x: hidden;
  position: relative;
  width: 100%;
  &.is-full-height {
    height: 100vh;
  }
`

const Layout = ({ children, className, backgroundcolor }) => {

  return (
    <StyledLayout className={className} backgroundcolor={backgroundcolor}>
      {children}
    </StyledLayout>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

export default Layout
