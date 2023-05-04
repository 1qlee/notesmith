import React from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"

import Tape from "../misc/Tape"
import LinesBkgd from "../../images/index/lines-bkgd.png"
import Review1 from "../../assets/peeps/review-1.svg"
import Review2 from "../../assets/peeps/review-2.svg"
import Review4 from "../../assets/peeps/review-4.svg"
import Review5 from "../../assets/peeps/review-5.svg"

import { Flexbox } from "../layout/Flexbox"

const StyledReviews = styled.div`
  background-image: url(${LinesBkgd});
  background-size: cover;
  background-repeat: no-repeat;
`

const ReviewContent = styled.div`
  padding: 16px 16px 0 16px;
  p {
    line-height: 1.5;
  }
`

const ReviewProfile = styled.div`
  margin-right: 8px;
  h3 {
    font-family: ${fonts.secondary};
    margin: 0 0 4px 0;
    font-size: 0.875rem;
  }
  p {
    font-family: ${fonts.secondary};
    font-size: 0.75rem;
  }
`

const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  max-width: 300px;
  margin: 1rem;
  position: relative;
  background-color: ${colors.white};
  box-shadow: 0 4px 12px ${colors.shadow.float};
  min-height: 106px;
  background: linear-gradient(
    ${colors.paper.cream},
    50%,
    ${colors.gray.twoHundred},
    51%,
    ${colors.paper.cream}
  ),
  linear-gradient(
    to right,
    ${colors.paper.cream},
    50%,
    ${colors.gray.twoHundred},
    51%,
    ${colors.paper.cream}
  );
`

const ReviewsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

function Reviews() {
  return (
    <StyledReviews>
      <ReviewsWrapper>
        <ReviewBox>
          <Tape num={Math.floor((Math.random() * 2 - 1) * 3)} />
          <ReviewContent>
            <p>"Literally the best writing experience I have ever experienced."</p>
          </ReviewContent>
          <Flexbox
            justifycontent="flex-end"
            alignitems="center"
            padding="0 16px 16px 16px"
          >
            <ReviewProfile>
              <h3>Tony</h3>
              <p>Cowboy</p>
            </ReviewProfile>
            <Review1 height="64" width="64" />
          </Flexbox>
        </ReviewBox>
        <ReviewBox>
          <Tape num={Math.floor((Math.random() * 2 - 1) * 3)} />
          <ReviewContent>
            <p>"Everything about this notebook; the quality, craftsmanship, and customer service was totally great."</p>
          </ReviewContent>
          <Flexbox
            justifycontent="flex-end"
            alignitems="center"
            padding="0 16px 16px 16px"
          >
            <ReviewProfile>
              <h3>Joanne</h3>
              <p>Enthusiast</p>
            </ReviewProfile>
            <Review2 height="64" width="64" />
          </Flexbox>
        </ReviewBox>
      </ReviewsWrapper>
      <ReviewsWrapper>
        <ReviewBox>
          <Tape num={Math.floor((Math.random() * 2 - 1) * 3)} />
          <ReviewContent>
            <p>"The paper is smooth and very pleasant to write on! I am super impressed!"</p>
          </ReviewContent>
          <Flexbox
            justifycontent="flex-end"
            alignitems="center"
            padding="0 16px 16px 16px"
          >
            <ReviewProfile>
              <h3>Gerald</h3>
              <p>Excited guy</p>
            </ReviewProfile>
            <Review4 height="64" width="64" />
          </Flexbox>
        </ReviewBox>
        <ReviewBox>
          <Tape num={Math.floor((Math.random() * 2 - 1) * 3)} />
          <ReviewContent>
            <p>"I’m really very satisfied with the paper. It helps my writing look far more smooth and precise."</p>
          </ReviewContent>
          <Flexbox
            justifycontent="flex-end"
            alignitems="center"
            padding="0 16px 16px 16px"
          >
            <ReviewProfile>
              <h3>Chad</h3>
              <p>Chad</p>
            </ReviewProfile>
            <Review5 height="64" width="64" />
          </Flexbox>
        </ReviewBox>
      </ReviewsWrapper>
    </StyledReviews>
  )
}

export default Reviews