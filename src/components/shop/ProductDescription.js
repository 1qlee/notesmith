import React from "react"
import styled from "styled-components"
import { spacing, colors, fonts, breakpoints } from "../../styles/variables"

import { Container, Row, Col } from "react-grid-system"
import { Section, SectionContent, SectionHeading } from "../layout/Section"
import Content from "../ui/Content"

const InfoListItem = styled.li`
  border-bottom: 1px solid ${colors.gray.nineHundred};
  padding-bottom: 8px;
  margin: 0 0 16px;
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
                <SectionHeading
                  margin="0 0 32px"
                >
                  <h2>{headingText}</h2>
                </SectionHeading>
              </Col>
            </Row>
          )}
          <Row>
            <Col sm={6}>
              <Content
                headingfontfamily={fonts.secondary}
                h3fontsize="1rem"
                paragraphfontsize="1.25rem"
              >
                <p>{bookData.longDescription}</p>
              </Content>
            </Col>
            <Col sm={6}>
              <ul>
                {bookData.infoList.map((item, index) => (
                  <InfoListItem key={index}>{item}</InfoListItem>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>
      </SectionContent>
    </Section>
  )
}

export default ProductDescription