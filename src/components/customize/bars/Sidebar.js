import React from 'react'
import styled from 'styled-components'
import { Flexbox } from '../../layout/Flexbox'

const StyledSidebar = styled(Flexbox)`
  display: ${props => props.toggleSidebar ? 'flex' : 'none'};
`

const Sidebar = (props) => {
  return (
    <StyledSidebar {...props}>
      {props.children}
    </StyledSidebar>
  )
}


export default Sidebar
