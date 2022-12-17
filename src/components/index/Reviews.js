import React from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"

import Tape from "../misc/Tape"
import LinesBkgd from "../../images/index/lines-bkgd.png"
import Review1 from "../../assets/peeps/review-1.svg"
import Review2 from "../../assets/peeps/review-2.svg"
import Review4 from "../../assets/peeps/review-4.svg"
import Review5 from "../../assets/peeps/review-5.svg"

import Content from "../ui/Content"

const StyledReviews = styled.div`
  background-image: url(${LinesBkgd});
  background-size: cover;
  background-repeat: no-repeat;
`

const ReviewContent = styled.div`
  border-radius: 0.5rem;
  padding: 1rem;
  min-height: 106px;
  display: flex;
  align-items: center;
  p {
    font-size: 1rem;
    line-height: 1.5;
  }
  background: linear-gradient(
      transparent,
      50%,
      ${colors.gray.twoHundred},
      51%,
      transparent
    ),
    linear-gradient(
      to right,
      transparent,
      50%,
      ${colors.gray.twoHundred},
      51%,
      transparent
    );
`

const ReviewProfile = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 0;
  width: 100%;
`

const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  max-width: 300px;
  margin-right: 2rem;
  position: relative;
  background-color: ${colors.white};
  box-shadow: 0 4px 12px ${colors.shadow.float};
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
          <Tape />
          <ReviewContent>
            <p>Literally the best writing experience I have ever experienced.</p>
            <ReviewProfile>
              <Content
                headingfontfamily={fonts.secondary}
                h3margin="0 0 0.25rem"
                h3fontsize="1rem"
                paragraphmarginbottom="0"
                paragraphcolor={colors.gray.sevenHundred}
                margin="0 0.5rem 0 0"
              >
                <h3>Tony</h3>
                <p>Cowboy</p>
              </Content>
              <Review1 height="64" width="64" />
            </ReviewProfile>
          </ReviewContent>
        </ReviewBox>
        <ReviewBox>
          <Tape />
          <ReviewContent>
            <p>Everything about this notebook; the quality, craftsmanship, and customer service was totally great.</p>
            <ReviewProfile>
              <Content
                headingfontfamily={fonts.secondary}
                h3margin="0 0 0.25rem"
                h3fontsize="1rem"
                paragraphmarginbottom="0"
                paragraphcolor={colors.gray.sevenHundred}
                margin="0 0.5rem 0 0"
              >
                <h3>Joanne</h3>
                <p>Enthusiast</p>
              </Content>
              <Review2 height="64" width="64" />
            </ReviewProfile>
          </ReviewContent>
        </ReviewBox>
      </ReviewsWrapper>
      <ReviewsWrapper>
        <ReviewBox>
          <Tape />
          <ReviewContent>
            <p>The paper is smooth and very pleasant to write on! I am super impressed!</p>
            <ReviewProfile>
              <Content
                headingfontfamily={fonts.secondary}
                h3margin="0 0 0.25rem"
                h3fontsize="1rem"
                paragraphmarginbottom="0"
                paragraphcolor={colors.gray.sevenHundred}
                margin="0 0.5rem 0 0"
              >
                <h3>Gerald</h3>
                <p>Excited guy</p>
              </Content>
              <Review4 height="64" width="64" />
            </ReviewProfile>
          </ReviewContent>
        </ReviewBox>
        <ReviewBox>
          <Tape />
          <ReviewContent>
            <p>I’m really very satisfied with the paper. It helps my writing look far more smooth and precise.</p>
            <ReviewProfile>
              <Content
                headingfontfamily={fonts.secondary}
                h3margin="0 0 0.25rem"
                h3fontsize="1rem"
                paragraphmarginbottom="0"
                paragraphcolor={colors.gray.sevenHundred}
                margin="0 0.5rem 0 0"
              >
                <h3>Chad</h3>
                <p>Chad</p>
              </Content>
              <Review5 height="64" width="64" />
            </ReviewProfile>
          </ReviewContent>
        </ReviewBox>
      </ReviewsWrapper>
    </StyledReviews>
  )
}

export default Reviews