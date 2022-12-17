import React from "react"
import styled from "styled-components"
import { Quotes } from "phosphor-react"
import { spacing, widths, colors, fonts } from "../../styles/variables"

import { Grid } from "styled-css-grid"
import Highlight from "../misc/Highlight"
import Content from "../ui/Content"
import Icon from "../ui/Icon"

const QuoteBox = styled.div`
  background-color: transparent;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid ${colors.gray.nineHundred};
  z-index: 99;
`

const QuoteHeading = styled.h3`
  font-family: ${fonts.secondary};
  font-size: 0.875rem;
  border-bottom: 2px solid ${colors.gray.nineHundred};
  padding-bottom: 8px;
  margin-bottom: 16px;
`

const QuoteBlurb = styled.p`
  line-height: 1.5;
  font-size: 1.125rem;
`

function Philosophies({ patternStyle }) {
  return (
    <Grid
      columns="1fr"
      columnGap={spacing.large}
    >
      <Content
        style={patternStyle}
        h2fontweight="400"
        maxwidth={widths.content.normal}
        textalign="center"
        margin="0 auto 32px"
      > 
        <h2>At Notesmith, we believe in the following <Highlight><i>notebook philosophies</i></Highlight></h2>
      </Content>
      <Grid
        columns="repeat(3, 1fr)"
        columnGap={spacing.normal}
        gap={0}
        className="stack-columns-600"
      >
        <QuoteBox>
          <QuoteHeading>01. Your notebook is your oyster</QuoteHeading>
          <QuoteBlurb>
            Only you can decide what purpose your notebook will serve. Notebooks don't <i>have</i> to be tools for productivity, creativity, or any other kind of -tivity. They can be secret diaries, frivolous doodle holders, or even makeshift coasters.
          </QuoteBlurb>
        </QuoteBox>
        <QuoteBox>
          <QuoteHeading>02. There is no such thing as "too many notebooks"</QuoteHeading>
          <QuoteBlurb>
            Therefore, it's okay to add another notebook to the stack. We won't judge.
          </QuoteBlurb>
        </QuoteBox>
        <QuoteBox>
          <QuoteHeading>03. Your notebook doesn't have to be perfect</QuoteHeading>
          <QuoteBlurb>
            Your words, drawings, or handwriting don't have to be perfect. It's okay to make mistakes, too. We're only human.
          </QuoteBlurb>
        </QuoteBox>
      </Grid>
    </Grid>
  )
}

export default Philosophies