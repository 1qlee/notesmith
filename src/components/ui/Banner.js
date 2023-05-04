import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import Content from "./Content"
import { colors, fonts } from "../../styles/variables"

const StyledBanner = styled.div`
  background-color: ${colors.gray.nineHundred};
  color: ${colors.gray.oneHundred};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  width: 100%;
  p {
    font-family: ${fonts.secondary};
    font-size: 0.875rem;
  }
`

const Banner = ({ text, link }) => {
  return (
    <StyledBanner>
      <p>{text}</p>
      <Content
        linkcolor={colors.gray.oneHundred}
        linkhovercolor={colors.gray.threeHundred}
        linktextdecoration="underline"
        linkfontfamily={fonts.secondary}
        linkfontsize="0.875rem"
        margin="0 4px"
        >
        <Link
          to={link.to}
        >
          {link.text}
        </Link>
      </Content>
    </StyledBanner>
  )
}

export default Banner