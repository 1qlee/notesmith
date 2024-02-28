import React from "react"
import { spacing } from "../../styles/variables"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

import { Container, Row, Col } from "react-grid-system"
import { Section, SectionContent } from "../layout/Section"
import { Flexbox } from "../layout/Flexbox"

const ProductSplash = ({ image, backgroundcolor }) => {
  const splashImage = image.nodes[0]
  
  return (
    <Section>
      <SectionContent
        padding={`${spacing.large} 0`}
        backgroundcolor={backgroundcolor}
      >
        <Container xs sm>
          <Row>
            <Col>
              <Flexbox
                justify="center"
                align="center"
                width="100%"
              >
                <GatsbyImage image={getImage(splashImage)} alt="Product splash image" />
              </Flexbox>
            </Col>
          </Row>
        </Container>
      </SectionContent>
    </Section>
  )
}

export default ProductSplash