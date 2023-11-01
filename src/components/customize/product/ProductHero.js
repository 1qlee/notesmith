import React from "react"
import { spacing, widths, colors } from "../../../styles/variables"

import { Container, Row, Col } from "react-grid-system"
import { Section, SectionContent } from "../../layout/Section"
import { Flexbox } from "../../layout/Flexbox"
import Content from "../../ui/Content"

const ProductHero = ({
  bookData,
  backgroundColor,
}) => {
  const { hero } = bookData
  const { heading, text } = hero

  return (
    <Section>
      <SectionContent
        padding={`${spacing.section} 0`}
        backgroundcolor={backgroundColor}
      >
        <Container xs sm>
          <Row>
            <Col>
              <Flexbox
                flexdirection="column"
                justifycontent="center"
                alignitems="center"
                width="100%"
              >
                <Content
                  textalign="center"
                  paragraphfontsize="1.25rem"
                  maxwidth={widths.content.normal}
                  h3margin="0 0 32px"
                  h3color={colors.gray.oneHundred}
                  paragraphcolor={colors.gray.oneHundred}
                >
                  <h3>{heading}</h3>
                  <p>{text}</p>
                </Content>
              </Flexbox>
            </Col>
          </Row>
        </Container>
      </SectionContent>
    </Section>
  )
}

export default ProductHero