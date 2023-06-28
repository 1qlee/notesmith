import React from "react"
import styled from "styled-components"
import { widths, colors } from "../../styles/variables"
import LinesBkgd from "../../images/index/lines-bkgd.png"

import { Container, Row, Col } from 'react-grid-system'
import Content from "../ui/Content"

const StyledPhilosophies = styled.div`
  background-image: url(${LinesBkgd});
  background-size: auto;
  background-repeat: repeat;
`

function Philosophies() {
  return (
    <StyledPhilosophies>
      <Container xl lg md sm xs>
        <Row justify="center">
          <Content
            h2fontweight="400"
            h3color={colors.gray.sixHundred}
            h3fontweight="400"
            paragraphfontsize="1.25rem"
            maxwidth={widths.content.normal}
            padding="16px"
            textalign="center"
            margin="0 0 16px"
          >
            <h2>There is no such thing as the perfect notebook.</h2>
            <h3><i><b>Until you create it</b></i>.</h3>
            <p>We know that it is impossible to create a notebook that is perfect for everyone. An essential feature in a notebook to someone might render the same notebook unusable for another. That's why we're giving you with the option to customize every page of your notebook from front to back.</p>
          </Content>
        </Row>
      </Container>
    </StyledPhilosophies>
  )
}

export default Philosophies