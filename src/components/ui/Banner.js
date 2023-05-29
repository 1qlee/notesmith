import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import Content from "./Content"
import { colors } from "../../styles/variables"
import TextLink from "./TextLink"

const StyledBanner = styled.div`
  background-color: ${colors.gray.nineHundred};
  color: ${colors.gray.oneHundred};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  width: 100%;
  p {
    font-size: 0.875rem;
    font-weight: 800;
  }
`

const Banner = ({ text, link }) => {
  return (
    <StyledBanner>
      <p>{text}</p>
      <Content
        margin="0 8px"
      >
        <TextLink
          as={Link}
          to={link.to}
          color={colors.gray.oneHundred}
          hovercolor={colors.gray.nineHundred}
          underlinecolor={colors.gray.oneHundred}
          fontsize="0.875rem"
        >
          {link.text}
        </TextLink>
      </Content>
    </StyledBanner>
  )
}

export default Banner