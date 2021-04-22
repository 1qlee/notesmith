import React, { useState, useEffect } from "react"
import { colors } from "../styles/variables"
import { StaticImage } from "gatsby-plugin-image"
import styled, { keyframes } from "styled-components"
import Page1 from "../assets/page-1.svg"
import Page2 from "../assets/page-2.svg"
import Page3 from "../assets/page-3.svg"
import Page4 from "../assets/page-4.svg"
import Page5 from "../assets/page-5.svg"
import Page6 from "../assets/page-6.svg"

const floatDown = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(5px);
  }
`

const floatUp = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-5px);
  }
`

const Page = styled.div`
  animation: ${props => props.animationName === "float-down" ? floatDown : floatUp} ${props => props.animationDuration}s ease-in-out infinite alternate;
  position: relative;
  height: 300px;
  margin: ${props => props.margin};
  width: 200px;
  will-change: transform;
  perspective: 1000px;
  .page-svg {
    background-color: ${colors.white};
    box-shadow: 0 0 8px ${colors.shadow.float};
    transition: transform 0.3s;
    will-change: transform;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
  &:hover {
    animation-play-state: paused;
    .page-svg {
      transform: rotateY(180deg);
    }
    .back {
      transform: rotateY(0deg);
    }
  }
`

const PageFront = styled.div`
  backface-visibility: hidden;
`

const PageBack = styled.div`
  backface-visibility: hidden;
  background-color: ${colors.white};
  box-shadow: 0 0 8px ${colors.shadow.float};
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 0;
  position: absolute;
  padding: 2rem 0;
  top: 0;
  transform: rotateY(180deg);
  transition: transform 0.3s;
  width: 100%;
`

const PageType = styled.span`
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.primary.sixHundred};
  color: ${props => props.color ? props.color : colors.primary.oneHundred};
  line-height: 1.25;
  margin: 1rem auto;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
`

const PageImage = styled.figure`
  align-items: center;
  display: flex;
  flex-direction: column;
  left: 50%;
  position: absolute;
  text-align: center;
  top: -45px;
  transform: translateX(-50%);
  z-index: 69;
  p {
    color: ${colors.primary.sevenHundred};
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  img {
    border-radius: 100%;
    border: 2px solid ${colors.gray.threeHundred};
  }
`

const PageThumbnail = styled.figure`
  width: 60px;
  border: 1px solid ${colors.gray.threeHundred};
  margin: 0 auto;
`

const PageList = styled.ul`
  list-style: none;
  padding-left: 1rem;
  width: 100%;
`

const PageListItem = styled.li`
  color: ${colors.primary.sevenHundred};
  margin: 0.5rem 1rem;
  position: relative;
  font-size: 1rem;
  &::before {
    background-color: ${colors.primary.sevenHundred};
    content: "";
    height: 1px;
    left: -0.75rem;
    position: absolute;
    top: 50%;
    width: 0.5rem;
  }
`

const PageGallery = () => {
  return (
    <>
      <Page
        animationDuration={2}
        animationName="float-down"
        margin="1rem 1rem 0"
      >
        <PageBack className="back">
          <PageThumbnail>
            <Page1 />
          </PageThumbnail>
          <PageType backgroundcolor={colors.blue.sixHundred}>Diary</PageType>
          <PageList>
            <PageListItem>Box for sketching</PageListItem>
            <PageListItem>Margin below box</PageListItem>
            <PageListItem>5mm dot grid</PageListItem>
            <PageListItem>Light gray dots</PageListItem>
          </PageList>
        </PageBack>
        <PageFront>
          <PageImage>
            <p>Christine</p>
            <StaticImage
              src="../images/portrait-1-sm-avatar.jpg"
              alt="Face"
              placeholder="blurred"
              layout="fixed"
              quality={100}
              width={50}
              height={50}
            />
          </PageImage>
          <Page1 className="page-svg" />
        </PageFront>
      </Page>
      <Page
        animationDuration={3}
        margin="3rem 1rem 0"
      >
        <PageBack className="back">
          <PageThumbnail>
            <Page2 />
          </PageThumbnail>
          <PageType backgroundcolor={colors.green.sixHundred}>School</PageType>
          <PageList>
            <PageListItem>Lined for writing</PageListItem>
            <PageListItem>1mm thick lines</PageListItem>
            <PageListItem>Light gray color</PageListItem>
            <PageListItem>5mm line spacing</PageListItem>
          </PageList>
        </PageBack>
        <PageFront>
          <PageImage>
            <p>Jamie</p>
            <StaticImage
              src="../images/portrait-2-sm-avatar.jpg"
              alt="Face"
              placeholder="blurred"
              layout="fixed"
              quality={100}
              width={50}
              height={50}
            />
          </PageImage>
          <Page2 className="page-svg" />
        </PageFront>
      </Page>
      <Page
        animationDuration={4}
        animationName="float-down"
        margin="2rem 1rem 0"
      >
        <PageBack className="back">
          <PageThumbnail>
            <Page3 />
          </PageThumbnail>
          <PageType backgroundcolor={colors.red.sixHundred}>Journal</PageType>
          <PageList>
            <PageListItem>Lined top half</PageListItem>
            <PageListItem>7mm line spacing</PageListItem>
            <PageListItem>Dots bottom half</PageListItem>
            <PageListItem>5mm dot spacing</PageListItem>
          </PageList>
        </PageBack>
        <PageFront>
          <PageImage>
            <p>Michelle</p>
            <StaticImage
              src="../images/portrait-3-sm-avatar.jpg"
              alt="Face"
              placeholder="blurred"
              layout="fixed"
              quality={100}
              width={50}
              height={50}
            />
          </PageImage>
          <Page3 className="page-svg" />
        </PageFront>
      </Page>
      <Page
        animationDuration={3}
        margin="4rem 1rem 0"
      >
        <PageBack className="back">
          <PageThumbnail>
            <Page4 />
          </PageThumbnail>
          <PageType backgroundcolor={colors.purple.sixHundred}>Drafting</PageType>
          <PageList>
            <PageListItem>Isometric grid</PageListItem>
            <PageListItem>1.5mm thick lines</PageListItem>
            <PageListItem>5mm sided triangles</PageListItem>
          </PageList>
        </PageBack>
        <PageFront>
          <PageImage>
            <p>Sam</p>
            <StaticImage
              src="../images/portrait-4-sm-avatar.jpg"
              alt="Face"
              placeholder="blurred"
              layout="fixed"
              quality={100}
              width={50}
              height={50}
            />
          </PageImage>
          <Page4 className="page-svg" />
        </PageFront>
      </Page>
      <Page
        animationDuration={2}
        animationName="float-down"
        margin="2rem 1rem 0"
      >
        <PageBack className="back">
          <PageThumbnail>
            <Page5 />
          </PageThumbnail>
          <PageType backgroundcolor={colors.kraft}>Workbook</PageType>
          <PageList>
            <PageListItem>Graph grid left side</PageListItem>
            <PageListItem>Lines right side</PageListItem>
            <PageListItem>5mm spacing</PageListItem>
          </PageList>
        </PageBack>
        <PageFront>
          <PageImage>
            <p>Bobby</p>
            <StaticImage
              src="../images/portrait-5-sm-avatar.jpg"
              alt="Face"
              placeholder="blurred"
              layout="fixed"
              quality={100}
              width={50}
              height={50}
            />
          </PageImage>
          <Page5 className="page-svg" />
        </PageFront>
      </Page>
      <Page
        animationDuration={3}
        margin="1rem 1rem 0"
      >
        <PageBack className="back">
          <PageThumbnail>
            <Page6 />
          </PageThumbnail>
          <PageType backgroundcolor={colors.yellow.threeHundred} color={colors.gray.nineHundred}>Checklist</PageType>
          <PageList>
            <PageListItem>Three even columns</PageListItem>
            <PageListItem>Boxes for checks</PageListItem>
            <PageListItem>Darker vertical lines</PageListItem>
          </PageList>
        </PageBack>
        <PageFront>
          <PageImage>
            <p>Jenny</p>
            <StaticImage
              src="../images/portrait-6-sm-avatar.jpg"
              alt="Face"
              placeholder="blurred"
              layout="fixed"
              quality={100}
              width={50}
              height={50}
            />
          </PageImage>
          <Page6 className="page-svg" />
        </PageFront>
      </Page>
    </>
  )
}

export default PageGallery
