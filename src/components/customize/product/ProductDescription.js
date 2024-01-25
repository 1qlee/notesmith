import React from "react"
import { spacing, fonts } from "../../../styles/variables"

import { Container, Row, Col } from "react-grid-system"
import { Section, SectionContent } from "../../layout/Section"
import Content from "../../ui/Content"
import ProductInfoBox from "./ProductInfoBox"
import ProductImagesGrid from "./ProductImagesGrid"

const ProductDescription = ({
  bookData,
  headingText,
  images,
}) => {
  return (
    <Section>
      <SectionContent
        padding={`${spacing.section} 0`}
        className="has-border-top"
      >
        <Container xs sm md lg xl>
          {headingText && (
            <Row>
              <Col>
                <Content
                  margin="0 0 32px"
                >
                  <h3>{headingText}</h3>
                </Content>
              </Col>
            </Row>
          )}
          <Row>
            <Col sm={6}>
              <ProductImagesGrid 
                images={images}
              />
            </Col>
            <Col sm={6}>
              <Content
                headingfontfamily={fonts.secondary}
                paragraphfontsize="1.25rem"
                margin="16px 0 32px"
              >
                <p>{bookData.longDescription}</p>
              </Content>
              {bookData.infoBoxes.map((box, index) => (
                <ProductInfoBox
                  heading={box.heading}
                  text={box.text}
                  key={index}
                  index={index}
                />
              ))}
            </Col>
          </Row>
        </Container>
      </SectionContent>
    </Section>
  )
}

export default ProductDescription