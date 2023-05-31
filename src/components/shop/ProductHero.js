import React from "react"
import { spacing, widths } from "../../styles/variables"

import { Container, Row, Col } from "react-grid-system"
import { Section, SectionContent } from "../layout/Section"
import Content from "../ui/Content"
import { Flexbox } from "../layout/Flexbox"

const ProductDescription = ({
  bookData
}) => {
  const { hero } = bookData
  const { heading, text } = hero

  return (
    <Section>
      <SectionContent
        padding={`${spacing.large} 0`}
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

export default ProductDescription