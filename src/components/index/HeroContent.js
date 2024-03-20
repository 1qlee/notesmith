import React from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"
import { ArrowRight } from "@phosphor-icons/react"
import { Link } from "gatsby"

import Content from "../ui/Content"
import Button from "../ui/Button"
import Icon from "../ui/Icon"
import RandomLine from "../misc/Lines"

const StyledContent = styled(Content)`
  @media only screen and (max-width: 962px) {
    h1 {
      font-size: 5rem;
    }
  }
  @media only screen and (max-width: 620px) {
    h1 {
      font-size: 4rem;
    }
  }
  @media only screen and (max-width: 490px) {
    h3 {
      font-size: 1.5rem;
    }
  }
`

const HeroContent = () => {
  return (
    <>
      <StyledContent
        h1margin="0 0 32px"
        h1fontsize="7rem"
        margin="0 0 32px"
        maxwidth={widths.content.large}
      >
        <h1>Customize your writing experience.</h1>
      </StyledContent>
      <StyledContent
        paragraphfontsize="1.25rem"
        smallfontsize="0.8rem"
        maxwidth={widths.content.normal}
      >
        <h3>Introducing our first notebook:</h3>
        <p>The Pro Wired A5 Custom Notebook is made with premium quality materials, fountain pen friendly paper, and your very own custom layouts.</p>
      </StyledContent>
      <Button
        as={Link}
        to="/products/notebooks/pro-wired-notebook-a5-custom/white/"
        padding="16px 32px"
        margin="32px 0"
        fontsize="1.25rem"
      >
        <span>Shop notebooks</span>
        <Icon
          margin="0 0 0 4px"
        >
          <ArrowRight
            color={colors.gray.oneHundred}
            weight="bold"
          />
        </Icon>
      </Button>
    </>
  )
}

export default HeroContent