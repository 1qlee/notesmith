import React from "react"
import styled from "styled-components"
import { colors, fonts, spacing } from "../../styles/variables"
import { Grid } from "styled-css-grid"

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
  border: 1px solid ${colors.gray.nineHundred};
  box-shadow: ${colors.shadow.solid};
  border-radius: 0.5rem;
  padding: 1rem;
  min-height: 106px;
  display: flex;
  align-items: center;
  background-color: ${colors.white};
  p {
    font-size: 1rem;
    line-height: 1.5;
  }
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
          <ReviewContent>
            <p>Literally the best writing experience I have ever experienced.</p>
          </ReviewContent>
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
        </ReviewBox>
        <ReviewBox>
          <ReviewContent>
            <p>Everything about this notebook; the quality, craftsmanship, and customer service was totally great.</p>
          </ReviewContent>
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
        </ReviewBox>
      </ReviewsWrapper>
      <ReviewsWrapper>
        <ReviewBox>
          <ReviewContent>
            <p>The paper is smooth and very pleasant to write on! I am super impressed!</p>
          </ReviewContent>
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
        </ReviewBox>
        <ReviewBox>
          <ReviewContent>
            <p>I’m really very satisfied with the paper. It helps my writing look far more smooth and precise.</p>
          </ReviewContent>
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
        </ReviewBox>
      </ReviewsWrapper>
    </StyledReviews>
  )
}

export default Reviews