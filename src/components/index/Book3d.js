import React, { useState } from "react"
import Measure from "react-measure"
import styled, { keyframes } from "styled-components"
import { StaticImage } from "gatsby-plugin-image"
import { breakpoints, colors } from "../../styles/variables"

import { Flexbox } from "../layout/Flexbox"
import ColorPicker from "../shop/ColorPicker"
import DemoTemplate from "./DemoTemplate"

const gradient = `linear-gradient(90deg,
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
)`

const StyledDemoTemplate = styled.div`
  position: absolute;
  top: 12px;
  left: 56px;
  z-index: 5;
  width: calc(100% - 68px);
  height: calc(100% - 24px);
`

const initAnimation = keyframes`
  to {
    transform: rotate3d(0,1,0,0);
  }
`

const LeftSpinePages = styled.div`
  content: '';
  height: 100%;
  left: 12px;
  position: absolute;
  top: 0;
  transform: rotate3d(0,1,0,90deg);
  width: 36px;
  z-index: 1;
  background: ${gradient};
  @media only screen and (max-width: 1548px) {
    left: 0;
  }
`

const RightSpinePages = styled.div`
  content: '';
  height: 100%;
  left: 31px;
  position: absolute;
  top: 0;
  transform: translateX(377px) rotate3d(0,1,0,90deg);
  width: 36px;
  background: ${gradient};
  @media only screen and (max-width: 1548px) {
    transform: translateX(276px) rotate3d(0,1,0,90deg);
  }
`

const FrontFakeCover = styled.div`
  background-color: #e8eaee;
  content: "";
  height: 100%;
  left: 30px;
  position: absolute;
  top: 0;
  transform: translateZ(20px);
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
  transform: translateZ(-20px);
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
  transform: translateZ(20px);
  transform-style: preserve-3d;
`

const BackCover = styled.div`
  position: absolute;
  background-color: white;
  top: 2px;
  left: 0;
  content: "";
  z-index: 2;
  transform: translateZ(-20px) rotateY(180deg);
  transform-style: preserve-3d;
`

const Book3dWrapper = styled.div`
  margin: 0 auto;
  perspective: 2800px;
  height: 615px;
  width: 427px;
  &:hover {
    cursor: pointer;
  }
  @media only screen and (max-width: 1548px) {
    height: 471px;
    width: 327px;
  }
  @media only screen and (max-width: ${breakpoints.sm}) {
    margin: 32px auto 16px;
  }
`

const StyledBook3d = styled.div`
  position: relative;
  transform-style: preserve-3d;
  transition: 1s ease;
  animation: 1s ease 0s 1 ${initAnimation};
  height: 100%;
  transform: rotate3d(0,1,0,-30deg);
  width: 100%;
  &:not(.is-active) {
    transform: ${props => props.hovered ? "rotate3d(0,0,0,0)" : null};
  }
  &.is-active {
    transform: rotate3d(0,1,0,-180deg);
    .front-cover {
      box-shadow: 2px 4px 16px ${colors.shadow.float}, 2px 8px 24px ${colors.shadow.float};
    }
    .back-cover {
      box-shadow: none;
    }
  }
`

function Book3d({
  pageData,
  setPageData,
}) {
  const [hovered, setHovered] = useState(false)
  const [showBackCover, setShowBackCover] = useState(false)
  const [coverColor, setCoverColor] = useState("black")
  const [pageDimensions, setPageDimensions] = useState({
    height: 594.67,
    width: 361.25,
  })
  const covers = [
    {
      "slug": "black",
      "name": "Black",
      "hex": "#000"
    },
    {
      "slug": "white",
      "name": "White",
      "hex": "#fff"
    },
  ]

  return (
    <>
      <Book3dWrapper
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setShowBackCover(!showBackCover)}
      >
        <StyledBook3d
          hovered={hovered}
          className={showBackCover ? "is-active" : null}
        >
          <FrontCover>
            {pageData.template ? (
              <>
                <Measure
                  bounds
                  onResize={contentRect => setPageDimensions({
                    height: contentRect.bounds.height - 24,
                    width: contentRect.bounds.width + 45,
                  })}
                >
                  {({ measureRef }) => (
                    <StyledDemoTemplate
                      ref={measureRef}
                    >
                      <DemoTemplate
                        pageDimensions={pageDimensions}
                        pageData={pageData}
                        setPageData={setPageData}
                      />
                    </StyledDemoTemplate>
                  )}
                </Measure>
                <StaticImage
                  className="image"
                  src="../../images/index/blank-page.jpg"
                  alt="Notebook opened to blank page"
                  quality={100}
                />
              </>
            ) : (
              <>
                {coverColor === "white" && (
                  <StaticImage
                    className="image"
                    src="../../images/index/front-cover-white.jpg"
                    alt="White colored cover custom wired notebook, front"
                    quality={100}
                  />
                )}
                {coverColor === "black" && (
                  <StaticImage
                    className="image"
                    src="../../images/index/front-cover-black.jpg"
                    alt="Black colored cover custom wired notebook, front"
                    quality={100}
                  />
                )}
              </>
            )}
          </FrontCover>
          <FrontFakeCover className="front-cover" />
          <LeftSpinePages />
          <RightSpinePages />
          <BackFakeCover className="back-cover" />
          <BackCover>
            {coverColor === "white" && (
              <StaticImage
                className="image"
                src="../../images/index/back-cover-white.jpg"
                alt="White colored cover custom wired notebook, back"
                quality={100}
              />
            )}
            {coverColor === "black" && (
              <StaticImage
                className="image"
                src="../../images/index/back-cover-black.jpg"
                alt="Black colored cover custom wired notebook, back"
                quality={100}
              />
            )}
          </BackCover>
        </StyledBook3d>
      </Book3dWrapper>
      <Flexbox
        flex="flex"
        alignitems="center"
        justifycontent="center"
        margin="32px 0"
        flexwrap="wrap"
      >
        <ColorPicker 
          data={covers}
          selectedColor={coverColor}
          cbFunction={color => setCoverColor(color)}
        />
      </Flexbox>
    </>
  )
}

export default Book3d