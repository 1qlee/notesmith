import React from "react"
import { spacing, colors, fonts } from "../../styles/variables"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

import { Container, Row, Col } from "react-grid-system"
import { Section, SectionContent } from "../layout/Section"
import { Flexbox } from "../layout/Flexbox"
import Content from "../ui/Content"

const ProductHalfandHalf = ({ image, direction, bookData }) => {
  // halfandhalf index from products.json
  const index = image.name.split("-")[1]
  const hasImageLeft = direction === "left"

  return (
    <Section>
      <SectionContent
        padding={`${spacing.large} 0`}
        backgroundcolor={hasImageLeft ? colors.gray.oneHundred : null}
      >
        <Container xs sm>
          <Row align="center" direction={hasImageLeft ? null : "row-reverse"}>
            <Col sm={6}>
              <Flexbox
                width="100%"
              >
                <GatsbyImage image={getImage(image)} alt="Product splash image" />
              </Flexbox>
            </Col>
            <Col sm={6}>
              <Content
                paragraphfontsize="1.25rem"
              >
                <h3>{bookData.halfandhalf[index].heading}</h3>
                <p>{bookData.halfandhalf[index].text}</p>
              </Content>
            </Col>
          </Row>
        </Container>
      </SectionContent>
    </Section>
  )
}

export default ProductHalfandHalf
