import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import Content from "../ui/Content"

import { Flexbox } from "../layout/Flexbox"
import { Container, Row, Col } from "react-grid-system"

const ReviewBox = styled.div`
  position: relative;
  background-color: transparent;
  border: ${colors.borders.black};
  border-radius: 8px;
  margin-bottom: 32px;
`

const NoteHoles = styled(Flexbox)`
  border-bottom: 1px dashed ${colors.gray.nineHundred};
`

const NoteHole = styled.div`
  height: 12px;
  width: 12px;
  border: ${colors.borders.black};
  background-color: transparent;
  box-shadow: inset 1px 1px 2px ${colors.gray.fourHundred};
  border-radius: 2px;
  &:not(:last-child) {
    margin-right: 4px;
  }
`

function Holes() {
  return (
    <NoteHoles
      padding="16px 10px"
      justify="space-around"
      align="center"
      height="100%"
    >
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
            <Content
              padding="16px"
              paragraphfontsize="1.25rem"
            >
              <p>"Literally the best writing experience I have ever experienced."</p>
            </Content>
            <Content
              padding="0 16px 16px"
              paragraphcolor={colors.gray.sixHundred}
            >
              <Flexbox
                justify="flex-end"
              >
                <p>- Ruled Ryder</p>
              </Flexbox>
            </Content>
          </ReviewBox>
        </Col>
        <Col sm={12} xl={6}>
          <ReviewBox>
            <Holes />
            <Content
              padding="16px"
              paragraphfontsize="1.25rem"
            >
              <p>"Everything about this notebook; the quality, craftsmanship, and customer service was totally great."</p>
            </Content>
            <Content
              padding="0 16px 16px"
              paragraphcolor={colors.gray.sixHundred}
            >
              <Flexbox
                justify="flex-end"
                paragraphcolor={colors.gray.sixHundred}
              >
                <p><i>- Penny Paperweight</i></p>
              </Flexbox>
            </Content>
          </ReviewBox>
        </Col>
      </Row>
      <Row>
        <Col sm={12} xl={6}>
          <ReviewBox>
            <Holes />
            <Content
              padding="16px"
              paragraphfontsize="1.25rem"
            >
              <p>"The paper is smooth and very pleasant to write on! I am super impressed!"</p>
            </Content>
            <Content
              padding="0 16px 16px"
              paragraphcolor={colors.gray.sixHundred}
            >
              <Flexbox
                justify="flex-end"
              >
                <p><i>- Pat Papyrophiliac</i></p>
              </Flexbox>
            </Content>
          </ReviewBox>
        </Col>
        <Col sm={12} xl={6}>
          <ReviewBox>
            <Holes />
            <Content
              padding="16px"
              paragraphfontsize="1.25rem"
            >
              <p>"I’m really very satisfied with the paper. It helps my writing look far more smooth and precise."</p>
            </Content>
            <Content
              padding="0 16px 16px"
              paragraphcolor={colors.gray.sixHundred}
            >
              <Flexbox
                justify="flex-end"
              >
                <p><i>- Callie Grapher</i></p>
              </Flexbox>
            </Content>
          </ReviewBox>
        </Col>
      </Row>
    </Container>
  )
}

export default Reviews