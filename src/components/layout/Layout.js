import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { useAuth0 } from "@auth0/auth0-react"

import Loader from "../Loader"

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
  const { loading } = useAuth0()

  return (
    <StyledLayout className={className}>
      {children}
    </StyledLayout>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
