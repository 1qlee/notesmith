import React from "react"
import styled from "styled-components"
import { NumberOne, NumberTwo, NumberThree } from "phosphor-react"
import { spacing, widths, colors, fonts } from "../../styles/variables"

import { Grid, Cell } from "styled-css-grid"
import Content from "../Content"
import Icon from "../Icon"
import RandomLine from "../misc/Lines"

const QuoteBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background-color: ${colors.white};
  padding: 32px 16px;
  flex: 1;
  z-index: ${props => props.zindex};
  position: relative;
  transition: transform 0.2s;
  &::before {
    content: "";
    position: absolute;
    transition: transform 0.2s, opacity 0.2s;
    background-color: ${colors.gray.threeHundred};
    width: 100%;
    height: 100%;
    z-index: 6;
    opacity: 0;
    left: 0;
    top: 0;
  }
  &:hover {
    &::before {
      opacity: 1;
      z-index: 6;
      transform: scale3d(1.1,1.1,1.1);
    }
  }
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
        <h2>At Notesmith, we believe in certain <span style={{position: 'relative'}}><i>notebook philosophies</i><RandomLine /></span></h2>
      </Content>
      <Grid
        columns="repeat(3, 1fr)"
        columnGap={0}
        gap={0}
        className="stack-columns-600"
      >
        <Cell>
          <QuoteBox
            zindex="5"
          >
            <Icon
              margin="0 8px 0 0"
            >
              <NumberOne size="2rem" />
            </Icon>
            <Content
              paragraphfontsize="1.25rem"
              smallfontfamily={fonts.secondary}
              smallcolor={colors.gray.sixHundred}
              smallfontsize="0.625rem"
            >
              <p>Notebooks don't have to be tools for productivity, creativity, or any kind of "tivity."</p>
              <small>Unless that's what you're into.</small>
            </Content>
          </QuoteBox>
        </Cell>
        <Cell>
          <QuoteBox
            zindex="4"
          >
            <Icon
              margin="0 8px 0 0"
            >
              <NumberTwo size="2rem" />
            </Icon>
            <Content
              paragraphfontsize="1.25rem"
              smallfontfamily={fonts.secondary}
              smallcolor={colors.gray.sixHundred}
              smallfontsize="0.625rem"
            >
              <p>It's okay to buy a notebook just because you like how it looks or how it makes you feel.</p>
              <small>Unless you need to pay rent.</small>
            </Content>
          </QuoteBox>
        </Cell>
        <Cell>
          <QuoteBox
            zindex="3"
          >
            <Icon
              margin="0 8px 0 0"
            >
              <NumberThree size="2rem" />
            </Icon>
            <Content
              paragraphfontsize="1.25rem"
              smallfontfamily={fonts.secondary}
              smallcolor={colors.gray.sixHundred}
              smallfontsize="0.625rem"
            >
              <p>The perfect notebook probably doesn't exist. But we'll do our best to help you get close.</p>
              <small>Unless you hate wires. Sorry.</small>
            </Content>
          </QuoteBox>
        </Cell>
      </Grid>
    </Grid>
  )
}

export default Philosophies