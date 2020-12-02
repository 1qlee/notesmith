import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { widths, colors } from "../../styles/variables"

const StyledSidebar = styled.div`
  border-right: 1px solid ${colors.gray.sixHundred};
  padding: 1rem;
  width: ${widths.sidebar};
  height: 100%;
`

function Sidebar() {
  return (
    <StyledSidebar>
      <Link to="/app/books">My Books</Link>
      <Link to="/app/settings">Settings</Link>
    </StyledSidebar>
  )
}

export default Sidebar
