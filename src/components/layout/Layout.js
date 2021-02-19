import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import "./master.css"
import { colors } from "../../styles/variables"

const StyledLayout = styled.div`
  background-color: ${props => props.backgroundColor || colors.white};
  position: relative;
  width: 100%;
  &.is-full-height {
    height: 100vh;
  }
`

const Layout = ({ children, className, backgroundColor }) => {

  return (
    <StyledLayout className={className} backgroundColor={backgroundColor}>
      {children}
    </StyledLayout>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

export default Layout
