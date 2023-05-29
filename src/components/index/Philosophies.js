import React from "react"
import { widths, colors } from "../../styles/variables"

import { Container, Row, Col } from 'react-grid-system'
import Content from "../ui/Content"

function Philosophies() {
  return (
    <Container xl lg md sm xs>
      <Row justify="center">
        <Content
          h2fontweight="400"
          h3color={colors.gray.sixHundred}
          h3fontweight="400"
          maxwidth={widths.content.normal}
          padding="16px"
          textalign="center"
          margin="0 0 16px"
        >
          <h2>When it comes to notebooks, there is no such thing as "<b>perfection.</b>"</h2>
          <h3>But we can strive for "<b><i>near</i>-perfection</b>"</h3>
          <p>We know that it is impossible to create a notebook that is perfect for everyone. A feature that is essential in a notebook to someone might render the same notebook unusable for another. We try to narrow this gap as much as possible by providing you with the option to customize every page of your notebook from front to back.</p>
        </Content>
      </Row>
      <Row>

      </Row>
    </Container>
  )
}

export default Philosophies