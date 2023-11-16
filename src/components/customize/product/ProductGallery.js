import React from "react"
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { spacing } from "../../../styles/variables"

import { Container, Col, Row } from "react-grid-system"
import { Section, SectionContent, SectionHeading } from "../../layout/Section"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import Content from "../../ui/Content"
import Box from "../../ui/Box"

const ProductGallery = ({ 
  images,
  heading,
  bookData,
 }) => {
  const sortedImages = images.nodes.sort((a, b) => a.name.localeCompare(b.name))
  const { galleryTexts } = bookData

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
            <Carousel
              centerMode={true}
              autoPlay={false}
              showArrows={false}
              showStatus={false}
              showIndicators={false}
              showThumbs={false}
              infiniteLoop={false}
              swipeable={true}
              swipeScrollTolerance={50}
              emulateTouch={true}
            >
              {sortedImages.map((image, index) => (
                <Box
                  margin="0 32px 0 0"
                  key={image.name}
                >
                  <GatsbyImage
                    image={getImage(image)}
                    alt={galleryTexts[index].alt}
                  />
                  <Content
                    paragraphtextalign="left"
                    margin="16px 0"
                  >
                    <p>{galleryTexts[index].text}</p>
                  </Content>
                </Box>
              ))}
            </Carousel>
        </Container>
      </SectionContent>
    </Section>
  )
}

export default ProductGallery