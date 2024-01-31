import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import Content from "./Content"
import { colors } from "../../styles/variables"
import TextLink from "./TextLink"

const StyledBanner = styled.div`
  background-color: ${colors.gray.nineHundred};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  width: 100%;
  p, a {
    font-size: 0.875rem;
  }
`

const Banner = ({ text, link }) => {
  return (
    <StyledBanner>
      <Content
        paragraphcolor={colors.gray.oneHundred}
      >
        <p>{text}</p>
      </Content>
      <Content
        margin="0 8px"
      >
        <TextLink
          as={Link}
          to={link.to}
          color={colors.gray.oneHundred}
          hovercolor={colors.gray.nineHundred}
          underlinecolor={colors.gray.oneHundred}
          fontweight="400"
          fontsize="0.875rem"
        >
          {link.text}
        </TextLink>
      </Content>
    </StyledBanner>
  )
}

export default Banner