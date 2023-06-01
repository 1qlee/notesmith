import React from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"

import Content from "../ui/Content"
import Review1 from "../../assets/peeps/review-1.svg"
import Review2 from "../../assets/peeps/review-2.svg"
import Review4 from "../../assets/peeps/review-4.svg"
import Review5 from "../../assets/peeps/review-5.svg"

import { Flexbox } from "../layout/Flexbox"
import { Container, Row, Col } from "react-grid-system"

const ReviewProfile = styled.div`
  margin-right: 8px;
  h5 {
    margin: 8px 0;
    font-size: 1rem;
    font-weight: 800;
  }
`

const ReviewBox = styled.div`
  position: relative;
  background-color: transparent;
  border: 2px solid ${colors.gray.nineHundred};
  border-radius: 8px;
  margin-bottom: 32px;
`

const ReviewProfileImg = styled.div`
  height: 64px;
  width: 64px;
  border-radius: 24px 12px / 12px 24px;
  background-color: ${colors.gray.twoHundred};
`

const NoteHoles = styled.div`
  padding: 16px 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  border-bottom: 2px dashed ${colors.gray.nineHundred};
`

const NoteHole = styled.div`
  display: block;
  height: 12px;
  width: 12px;
  border: 2px solid ${colors.gray.nineHundred};
  background-color: transparent;
  box-shadow: inset 1px 1px 2px ${colors.gray.sixHundred};
  &:not(:last-child) {
    margin-right: 4px;
  }
`

function Holes() {
  return (
    <NoteHoles>
      <NoteHole />
      <NoteHole />
      <NoteHole />
      <NoteHole />
      <NoteHole />
      <NoteHole />
    </NoteHoles>
  )
}

function Reviews() {
  return (
    <Container>
      <Row>
        <Col sm={12} xl={6}>
          <ReviewBox>
            <Holes />
            <Flexbox
              alignitems="flex-start"
              padding="16px"
            >
              <ReviewProfile>
                <ReviewProfileImg>
                  <Review1 height="64" width="64" />
                </ReviewProfileImg>
                <h5>Tony</h5>
                <h5>Wrangler</h5>
              </ReviewProfile>
              <Content
                padding="0 16px"
                maxwidth={widths.content.index}
              >
                <p>"Literally the best writing experience I have ever experienced."</p>
              </Content>
            </Flexbox>
          </ReviewBox>
        </Col>
        <Col sm={12} xl={6}>
          <ReviewBox>
            <Holes />
            <Flexbox
              alignitems="flex-start"
              padding="16px"
            >
              <ReviewProfile>
                <ReviewProfileImg>
                  <Review2 height="64" width="64" />
                </ReviewProfileImg>
                <h5>Margie</h5>
                <h5>Anthophile</h5>
              </ReviewProfile>
              <Content
                padding="0 16px"
              >
                <p>"Everything about this notebook; the quality, craftsmanship, and customer service was totally great."</p>
              </Content>
            </Flexbox>
          </ReviewBox>
        </Col>
      </Row>
      <Row>
        <Col sm={12} xl={6}>
          <ReviewBox>
            <Holes />
            <Flexbox
              alignitems="flex-start"
              padding="16px"
            >
              <ReviewProfile>
                <ReviewProfileImg>
                  <Review4 height="64" width="64" />
                </ReviewProfileImg>
                <h5>Gerald</h5>
                <h5>Bellower</h5>
              </ReviewProfile>
              <Content
                padding="0 16px"
              >
                <p>"The paper is smooth and very pleasant to write on! I am super impressed!"</p>
              </Content>
            </Flexbox>
          </ReviewBox>
        </Col>
        <Col sm={12} xl={6}>
          <ReviewBox>
            <Holes />
            <Flexbox
              alignitems="flex-start"
              padding="16px"
            >
              <ReviewProfile>
                <ReviewProfileImg>
                  <Review5 height="64" width="64" />
                </ReviewProfileImg>
                <h5>Chad</h5>
                <h5>Afficionado</h5>
              </ReviewProfile>
              <Content
                padding="0 16px"
              >
                <p>"I’m really very satisfied with the paper. It helps my writing look far more smooth and precise."</p>
              </Content>
            </Flexbox>
          </ReviewBox>
        </Col>
      </Row>
    </Container>
  )
}

export default Reviews