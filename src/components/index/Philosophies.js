import React from "react"
import styled from "styled-components"
import { spacing, widths, colors, fonts } from "../../styles/variables"

import { Grid } from "styled-css-grid"
import Highlight from "../misc/Highlight"
import Content from "../ui/Content"
import Tag from "../ui/Tag"

const QuoteBox = styled.div`
  background-color: transparent;
  border-radius: 8px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  padding: 16px;
  z-index: 99;
`

const QuoteHeading = styled.div`
  font-family: ${fonts.secondary};
  font-size: 0.875rem;
  font-weight: 700;
  border-bottom: 2px solid ${colors.gray.nineHundred};
  padding-bottom: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
`

const QuoteBlurb = styled.p`
  line-height: 1.5;
  font-size: 1.25rem;
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
        <h2>At Notesmith, we practice the following <i>notebook philosophies</i></h2>
      </Content>
      <Grid
        columns="repeat(3, 1fr)"
        columnGap={spacing.normal}
        gap={0}
        className="stack-columns-600"
      >
        <QuoteBox>
          <QuoteHeading>
            <Tag 
              padding="4px 8px"
              margin="0 8px 0 0"
            >
              01
            </Tag>
            <Highlight>Your notebook is your oyster</Highlight>
          </QuoteHeading>
          <QuoteBlurb>
            Notebooks don't <i>have</i> to be tools for productivity, creativity, or any other kind of -tivity. They can be secret diaries, frivolous doodle holders, or even makeshift coasters!
          </QuoteBlurb>
        </QuoteBox>
        <QuoteBox>
          <QuoteHeading>
            <Tag
              padding="4px 8px"
              margin="0 8px 0 0"
            >
              02
            </Tag>
            <Highlight>Your notebook doesn't have to be perfect</Highlight>
          </QuoteHeading>
          <QuoteBlurb>
            Making mistakes is a natural part of any endeavor. If you make a mistake in your notebook, don't be afraid to simply cross it out or make a note to yourself to correct it later.
          </QuoteBlurb>
        </QuoteBox>
        <QuoteBox>
          <QuoteHeading>
            <Tag
              padding="4px 8px"
              margin="0 8px 0 0"
            >
              03
            </Tag>
            <Highlight>You can't actually have "too many notebooks"</Highlight>
          </QuoteHeading>
          <QuoteBlurb>
            <s>This is actually a marketing ploy from Big Digital to force us away from-</s> Moderation and balance are keys to maintaining a healthy relationship with the things we love.
          </QuoteBlurb>
        </QuoteBox>
      </Grid>
    </Grid>
  )
}

export default Philosophies