import React from "react"
import styled from "styled-components"
import { spacing, fonts, breakpoints } from "../../styles/variables"

import { Container, Row, Col } from "react-grid-system"
import { Section, SectionContent } from "../layout/Section"
import Content from "../ui/Content"
import ProductInfoBox from "./ProductInfoBox"

const InfoListItem = styled.li`
  padding-bottom: 8px;
  margin: 0 0 8px;
  @media only screen and (max-width: ${breakpoints.xs}) {
    margin: 16px 0 0;
    margin-left: 16px;
  }
`

const ProductDescription = ({
  bookData,
  headingText,
}) => {
  return (
    <Section>
      <SectionContent
        padding={`${spacing.large} 0`}
        className="has-border-top"
      >
        <Container xs sm>
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
            </Col>
            <Col sm={6}>
              <Content
                headingfontfamily={fonts.secondary}
                paragraphfontsize="1.25rem"
                margin="0 0 32px"
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