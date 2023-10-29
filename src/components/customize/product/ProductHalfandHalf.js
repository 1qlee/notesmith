import React from "react"
import { spacing, colors } from "../../../styles/variables"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import { ScreenClassRender } from "react-grid-system"

import { Container, Row, Col } from "react-grid-system"
import { Section, SectionContent } from "../../layout/Section"
import { Flexbox } from "../../layout/Flexbox"
import Content from "../../ui/Content"

const ProductHalfandHalf = ({ image, direction, bookData }) => {
  // halfandhalf index from products.json
  const index = image.name.split("-")[1]
  const hasImageLeft = direction === "left"

  return (
    <ScreenClassRender
      render={screenClass => {
        const isMobile = ["xs", "sm"].includes(screenClass)

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
                      margin={isMobile && "0 0 32px"}
                    >
                      <GatsbyImage image={getImage(image)} alt="Product splash image" />
                    </Flexbox>
                  </Col>
                  <Col sm={6}>
                    <Content
                      paragraphfontsize="1.25rem"
                      h3margin="0 0 32px"
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
      }}
    />
  )
}

export default ProductHalfandHalf
