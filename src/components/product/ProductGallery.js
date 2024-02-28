import React from "react"
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { spacing } from "../../styles/variables"

import { Container } from "react-grid-system"
import { Section, SectionContent, SectionHeading } from "../layout/Section"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import Content from "../ui/Content"
import Box from "../ui/Box"

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
              swipeable={false}
              draggable={false}
              showDots={true}
              ssr={true} // means to render carousel on server-side.
              infinite={true}
              autoPlay={false}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={500}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-40-px"
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