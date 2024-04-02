import React, { useState } from "react"
import Measure from "react-measure"
import styled, { keyframes } from "styled-components"
import { StaticImage } from "gatsby-plugin-image"
import { breakpoints, colors } from "../../styles/variables"

import ColorPicker from "../shop/ColorPicker"
import DemoTemplate from "./DemoTemplate"

const gradient = `linear-gradient(90deg,
  ${colors.gray.oneHundred} 0%,
  ${colors.gray.threeHundred} 20%,
  ${colors.gray.oneHundred} 40%,
  ${colors.gray.threeHundred} 60%,
  ${colors.gray.oneHundred} 80%,
  ${colors.gray.threeHundred} 100%
)`

const StyledDemoTemplate = styled.div`
  position: absolute;
  top: 12px;
  width: calc(100% - 68px);
  left: 56px;
  z-index: 5;
  height: calc(100% - 24px);
  @media only screen and (max-width: 1548px) {    
    left: 44px;
    width: calc(100% - 56px);
  }
`

const initAnimation = keyframes`
  to {
    transform: rotate3d(0,1,0,0);
  }
`

const SpinePages = styled.div`
  content: '';
  height: 100%;
  left: ${props => props.left};
  top: 0;
  position: absolute;
  transform: ${props => props.transform};
  width: 36px;
  z-index: ${props => props.zIndex};
  background: ${gradient};
  @media only screen and (max-width: 1548px) {
    left: ${props => props.leftMobile};
    transform: ${props => props.transformMobile};
  }
`

const FakeCover = styled.div`
  background-color: ${colors.gray.oneHundred};
  box-shadow: ${props => props.boxshadow};
  content: "";
  height: 100%;
  left: ${props => props.left};
  position: absolute;
  top: 0;
  transform: translateZ(${props => props.transform});
  transition: box-shadow 0.4s;
  width: calc(100% - ${props => props.width});
  z-index: 1;
`

const Cover = styled.div`
  position: absolute;
  background-color: white;
  top: ${props => props.top};
  left: 0;
  z-index: ${props => props.zIndex};
  transform: ${props => props.transform};
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
  transform: rotate3d(0,0,0,0);
  width: 100%;
  will-change: transform;
  &:not(.is-active) {
    transform: ${props => props.hovered ? "rotate3d(0,1,0,-30deg)" : null};
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
  setSvgLoaded,
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
          <Cover
            top="0"
            zIndex="3"
            transform="translateZ(20px)"
          >
            {pageData.template ? (
              <>
                <Measure
                  bounds
                  onResize={contentRect => {
                    setPageData({
                      ...pageData,
                      rows: 200,
                      columns: 200,
                    })
                    setPageDimensions({
                      height: contentRect.bounds.height,
                      width: contentRect.bounds.width,
                    })
                  }}
                >
                  {({ measureRef }) => (
                    <StyledDemoTemplate
                      ref={measureRef}
                    >
                      <DemoTemplate
                        hovered={hovered}
                        pageDimensions={pageDimensions}
                        pageData={pageData}
                        setPageData={setPageData}
                        setSvgLoaded={setSvgLoaded}
                      />
                    </StyledDemoTemplate>
                  )}
                </Measure>
                <StaticImage
                  className="image"
                  src="../../images/index/blank-page.jpg"
                  alt="Notebook opened to blank page"
                  quality={80}
                  loading="lazy"
                />
              </>
            ) : (
              <>
                {coverColor === "white" && (
                  <StaticImage
                    className="image"
                    src="../../images/index/front-cover-white.jpg"
                    alt="White colored cover custom wired notebook, front"
                    quality={80}
                    loading="lazy"
                  />
                )}
                {coverColor === "black" && (
                  <StaticImage
                    className="image"
                    src="../../images/index/front-cover-black.jpg"
                    alt="Black colored cover custom wired notebook, front"
                    quality={80}
                    loading="lazy"
                  />
                )}
              </>
            )}
          </Cover>
          <FakeCover 
            className="front-cover"
            left="30px"
            transform="translateZ(19px)"
            width="30px"
          />
          <SpinePages 
            left="12px"
            transform="rotate3d(0,1,0,90deg)"
            zIndex="1"
            leftMobile="0"
          />
          <SpinePages 
            left="31px"
            transform="translateX(377px) rotate3d(0,1,0,90deg)"
            transformMobile="translateX(276px) rotate3d(0,1,0,90deg)"
          />
          <FakeCover 
            className="back-cover" 
            left="32px"
            transform="translateZ(-24px)"
            width="32px"
            boxshadow={colors.shadow.layered}
          />
          <Cover
            top="2px"
            zIndex="2"
            transform="translateZ(-28px) rotateY(180deg)"
          >
            {coverColor === "white" && (
              <StaticImage
                className="image"
                src="../../images/index/back-cover-white.jpg"
                alt="White colored cover custom wired notebook, back"
                quality={80}
                loading="lazy"
              />
            )}
            {coverColor === "black" && (
              <StaticImage
                className="image"
                src="../../images/index/back-cover-black.jpg"
                alt="Black colored cover custom wired notebook, back"
                quality={80}
                loading="lazy"
              />
            )}
          </Cover>
        </StyledBook3d>
      </Book3dWrapper>
      <ColorPicker 
        data={covers}
        selectedColor={coverColor}
        cbFunction={color => setCoverColor(color)}
        center
      />
    </>
  )
}

export default Book3d