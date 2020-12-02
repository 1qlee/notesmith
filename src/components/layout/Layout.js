import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import "./master.css"
import { colors } from "../../styles/variables"

const StyledLayout = styled.div`
  background-color: ${colors.white};
  position: relative;
  width: 100%;
  &.is-full-height {
    height: 100vh;
  }
`

const Layout = ({ children, className }) => {

  return (
    <StyledLayout className={className}>
      {children}
    </StyledLayout>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

export default Layout
