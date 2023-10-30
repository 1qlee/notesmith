import React from "react"
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { spacing } from "../../../styles/variables"

import { Container, Col, Row } from "react-grid-system"
import { Section, SectionContent, SectionHeading } from "../../layout/Section"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

const ProductGallery = ({ 
  images,
  heading,
 }) => {
  const sortedImages = images.nodes.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Section>
      <SectionContent
        padding={`${spacing.section} 0`}
        className="has-border-top"
      >
        <Container xs sm md lg xl>
          <SectionHeading>
            {heading}
          </SectionHeading>
          <Row>
            {sortedImages.map((image, index) => (
              <Col>
                <GatsbyImage
                  image={getImage(image)}
                  alt={image.name}
                  transformOptions={{fit: "fitInside"}}
                  width={400}
                  height={500}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </SectionContent>
    </Section>
  )
}

export default ProductGallery