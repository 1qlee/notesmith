import React from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"
import { ArrowRight } from "@phosphor-icons/react"
import { Link } from "gatsby"

import Content from "../ui/Content"
import Button from "../ui/Button"
import Icon from "../ui/Icon"
import CircledText from "../misc/CircledText"

const StyledContent = styled(Content)`
  margin: 0 auto 0;
  @media only screen and (max-width: 650px) {
    margin: 64px auto 0;
  }
`

const HeroContent = () => {
  return (
    <StyledContent
      paragraphfontsize="1.25rem"
      smallfontsize="0.8rem"
      h1margin="0 0 32px"
      textalign="center"
      maxwidth={widths.content.index}
    >
      <h1><CircledText text="Custom" />&nbsp;notebooks,<br />page by page</h1>
      <p>Fully customize the layout of every page - from dot thickness to line spacing - and create your own unique, custom-made notebook.</p>
      <Button
        as={Link}
        to="/products/notebooks/pro-wired-notebook-a5-custom/white/"
        padding="16px 32px"
        margin="16px 0"
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
    </StyledContent>
  )
}

export default HeroContent