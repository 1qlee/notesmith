import React from "react"
import styled, { keyframes } from "styled-components"
import { StaticImage } from "gatsby-plugin-image"
import { colors } from "../styles/variables"

const initAnimation = keyframes`
  to {
    transform: rotate3d(0,1,0,0);
  }
`

const Pages = styled.div`
  content: '';
  height: calc(100% - 8px);
  left: ${props => props.left || "36px"};
  position: absolute;
  top: 4px;
  transform: translateX(377px) rotate3d(0,1,0,90deg);
  width: 48px;
  background: linear-gradient(90deg,
    ${colors.gray.oneHundred} 0%,
    ${colors.gray.threeHundred} 5%,
    ${colors.gray.oneHundred} 10%,
    ${colors.gray.threeHundred} 15%,
    ${colors.gray.oneHundred} 20%,
    ${colors.gray.threeHundred} 25%,
    ${colors.gray.oneHundred} 30%,
    ${colors.gray.threeHundred} 35%,
    ${colors.gray.oneHundred} 40%,
    ${colors.gray.threeHundred} 45%,
    ${colors.gray.threeHundred} 50%,
    ${colors.gray.oneHundred} 55%,
    ${colors.gray.threeHundred} 60%,
    ${colors.gray.threeHundred} 65%,
    ${colors.gray.oneHundred} 70%,
    ${colors.gray.threeHundred} 75%,
    ${colors.gray.oneHundred} 80%,
    ${colors.gray.threeHundred} 85%,
    ${colors.gray.oneHundred} 90%,
    ${colors.gray.threeHundred} 95%,
    ${colors.gray.oneHundred} 100%
  );
`

const FrontFakeCover = styled.div`
  background-color: #e8eaee;
  content: "";
  height: 100%;
  left: 30px;
  position: absolute;
  top: 0;
  transform: translateZ(25px);
  transition: box-shadow 0.4s;
  width: calc(100% - 30px);
  z-index: 1;
`

const BackFakeCover = styled.div`
  background-color: #e8eaee;
  box-shadow: 2px 4px 16px ${colors.shadow.float}, 2px 8px 24px ${colors.shadow.float};
  content: "";
  height: 100%;
  left: 32px;
  position: absolute;
  top: 0;
  transform: translateZ(-25px);
  transition: box-shadow 0.4s;
  width: calc(100% - 32px);
  z-index: 1;
`

const FrontCover = styled.div`
  position: absolute;
  background-color: white;
  top: 0;
  left: 0;
  z-index: 3;
  transform: translateZ(25px);
  transform-style: preserve-3d;
`

const BackCover = styled.div`
  position: absolute;
  background-color: white;
  top: 2px;
  left: 0;
  content: "";
  z-index: 2;
  transform: translateZ(-25px) rotateY(180deg);
  transform-style: preserve-3d;
`

const Book3dWrapper = styled.div`
  margin: 0 auto;
  perspective: 2800px;
  height: 628px;
  width: 439px;
`

const StyledBook3d = styled.div`
  position: relative;
  transform-style: preserve-3d;
  transform: rotate3d(0,1,0,0);
  transition: 1s ease;
  animation: 1s ease 0s 1 ${initAnimation};
  height: 100%;
  width: 100%;
  will-change: transform;
  &:hover {
    transform: rotate3d(0,1,0,-180deg);
    .front-cover {
      box-shadow: 2px 4px 16px ${colors.shadow.float}, 2px 8px 24px ${colors.shadow.float};
    }
    .back-cover {
      box-shadow: none;
    }
  }
`

function Book3d(props) {
  return (
    <Book3dWrapper>
      <StyledBook3d>
        <FrontCover>
          <StaticImage
            className="image"
            src="../images/index/front-cover-white.jpg"
            alt="Notesmith logo image"
            placeholder="blurred"
            quality={100}
          />
        </FrontCover>
        <FrontFakeCover className="front-cover" />
        <Pages left="-366px" />
        <Pages />
        <BackFakeCover className="back-cover" />
        <BackCover>
          <StaticImage
            className="image"
            src="../images/index/back-cover-white.jpg"
            alt="Notesmith logo image"
            placeholder="blurred"
            quality={100}
          />
        </BackCover>
      </StyledBook3d>
    </Book3dWrapper>
  )
}

export default Book3d