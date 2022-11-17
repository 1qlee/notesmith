import React from "react"
import styled from "styled-components"
import { Quotes } from "phosphor-react"
import { spacing, widths, colors, fonts } from "../../styles/variables"

import { Grid, Cell } from "styled-css-grid"
import Highlight from "../misc/Highlight"
import Content from "../ui/Content"
import Icon from "../ui/Icon"
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
  small {
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    transform: scale(0.9);
  }
  &::before {
    content: "";
    position: absolute;
    transition: transform 0.2s, opacity 0.2s;
    background-color: ${colors.paper.cream};
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0;
    left: 0;
    top: 0;
  }
  &:hover {
    small {
      opacity: 1;
      transform: scale(1);
    }
    &::before {
      opacity: 1;
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
        <h2>At Notesmith, we believe in the following <span style={{position: 'relative'}}><i>notebook philosophies</i><RandomLine /></span></h2>
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
              <Quotes size="2rem" weight="fill" color={colors.gray.nineHundred} />
            </Icon>
            <Content
              paragraphfontsize="1.25rem"
              smallfontfamily={fonts.secondary}
              smallcolor={colors.gray.nineHundred}
              smallfontsize="0.75rem"
            >
              <p>Notebooks don't have to be tools for productivity, creativity, or any kind of -tivity. They can be whatever you want them to be.</p>
              <small><Highlight>The notebook is your oyster.</Highlight></small>
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
              <Quotes size="2rem" weight="fill" color={colors.gray.nineHundred} />
            </Icon>
            <Content
              paragraphfontsize="1.25rem"
              smallfontfamily={fonts.secondary}
              smallcolor={colors.gray.sixHundred}
              smallfontsize="0.75rem"
            >
              <p>You can never have too many notebooks. Therefore, it's okay to add another notebook to the stack. We won't judge.</p>
              <small>You'll find a use for them someday.</small>
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
              <Quotes size="2rem" weight="fill" color={colors.gray.nineHundred} />
            </Icon>
            <Content
              paragraphfontsize="1.25rem"
              smallfontfamily={fonts.secondary}
              smallcolor={colors.gray.sixHundred}
              smallfontsize="0.75rem"
            >
              <p>Your words, drawings, or handwriting don't have to be perfect. It's okay to make mistakes. We're only human.</p>
              <small>That's what all those other pages are for.</small>
            </Content>
          </QuoteBox>
        </Cell>
      </Grid>
    </Grid>
  )
}

export default Philosophies