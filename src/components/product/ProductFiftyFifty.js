import React from "react"
import { spacing, widths } from "../../styles/variables"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import { ScreenClassRender } from "react-grid-system"

import { Container, Row, Col } from "react-grid-system"
import { Section, SectionContent } from "../layout/Section"
import Box from "../ui/Box"
import Content from "../ui/Content"

const ProductFiftyFifty = ({ image, direction, bookData }) => {
  // fiftyfifty index from products.json
  const index = image.name.split("-")[1]
  const hasImageLeft = direction === "left"
  const imageData = bookData.fiftyFiftyTexts[index]

  return (
    <ScreenClassRender
      render={screenClass => {
        const isMobile = ["xs", "sm"].includes(screenClass)

        return (
          <Section>
            <SectionContent
              padding={`${spacing.large} 0`}
            >
              <Container xs sm>
                <Row align="center" direction={hasImageLeft ? null : "row-reverse"}>
                  <Col sm={6}>
                    <Box
                      width="100%"
                      margin={isMobile && "0 0 32px"}
                    >
                      <GatsbyImage image={getImage(image)} alt="Product splash image" />
                      <Content
                        paragraphmargin="8px auto"
                        paragraphfontsize="0.75rem"
                        textalign="center"
                      >
                        <p>{imageData.alt}</p>
                      </Content>
                    </Box>
                  </Col>
                  <Col sm={6}>
                    <Content
                      paragraphfontsize="1.25rem"
                      h3margin="0 0 32px"
                      maxwidth={widths.content.small}
                      margin="0 auto"
                    >
                      <h3>{imageData.heading}</h3>
                      <p>{imageData.text}</p>
                    </Content>
                  </Col>
                </Row>
              </Container>
            </SectionContent>
          </Section>
        )
      }}
    />
  )
}

export default ProductFiftyFifty
