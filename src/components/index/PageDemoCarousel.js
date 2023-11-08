import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { breakpoints, widths } from "../../styles/variables"
import { StaticImage } from "gatsby-plugin-image"

import PageDemo1 from "../../assets/index/page-demo-1.svg"
import PageDemo2 from "../../assets/index/page-demo-2.svg"
import PageDemo3 from "../../assets/index/page-demo-3.svg"
import PageDemo4 from "../../assets/index/page-demo-4.svg"
import PageDemo5 from "../../assets/index/page-demo-5.svg"

const StyledPageDemo = styled.div`
  position: relative;
  margin-top: 32px;
`

const DemoImageWrapper = styled.div`
  position: relative;
  margin: 0 auto;
`

const DemoImage = styled.div`
  position: absolute;
  top: 0;
  left: -16px;
  height: 100%;
  width: 100%;
`

const DemoImageCaption = styled.article`
  top: 0;
  padding: 16px;
  background-image: linear-gradient(180deg, rgba(255,255,255) 25%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.5) 100%);
  position: absolute;
  left: 0;
  width: ${widths.caption};
  @media only screen and (max-width: ${breakpoints.sm}) {
    top: auto;
    bottom: -96px;
  }
  p {
    line-height: 1.75;
    font-size: 0.875rem;
  }
`

function PageDemoCarousel() {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [pause, setPause] = useState(false)

  useEffect(() => {
    function advanceCarousel() {
      if (currentPage === 5) {
        return setCurrentPage(1)
      }
      return setCurrentPage(currentPage + 1)
    }

    const timer = setInterval(() => {
      if (pause) {
        return clearInterval(timer)
      }
      else {
        setCurrentProgress((prev) => prev + 1)
      }
    }, 10)

    if (currentProgress === 101) {
      clearInterval(timer)
      setCurrentProgress(0)
      advanceCarousel()
    }

    return () => clearInterval(timer)
  }, [currentProgress, currentPage, pause])

  return (
    <StyledPageDemo>
      <DemoImageWrapper
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
      >
        <StaticImage
          src="../../images/index/splash-image-blank.png"
          alt="Ink on paper"
          loading="eager"
          placeholder="none"
          quality={100}
        />
        <DemoImage>
          {currentPage === 1 && (
            <PageDemo1
              width="100%"
              height="100%"
            />
          )}
          {currentPage === 2 && (
            <PageDemo2
              width="100%"
              height="100%"
            />
          )}
          {currentPage === 3 && (
            <PageDemo3
              width="100%"
              height="100%"
            />
          )}
          {currentPage === 4 && (
            <PageDemo4
              width="100%"
              height="100%"
            />
          )}
          {currentPage === 5 && (
            <PageDemo5
              width="100%"
              height="100%"
            />
          )}
        </DemoImage>
        <DemoImageCaption>
          {/* <Progress
            height="2px"
            width="100%"
            completion={currentProgress}
            barcolor={colors.gray.nineHundred}
            wrappercolor={colors.gray.threeHundred}
          /> */}
          {currentPage === 1 && (
            <p>8mm spaced lines with a vertical divider in the center and a large top margin.</p>
          )}
          {currentPage === 2 && (
            <p>0.25mm wide light gray dot grid, spaced 5mm apart and centrally positioned with margins on all four sides.</p>
          )}
          {currentPage === 3 && (
            <p>Calligraphy practice rows spaced 10mm apart with adjustable spacing on slants, descenders, and ascenders.</p>
          )}
          {currentPage === 4 && (
            <p>Seyes ruled grid with adjustable margins, spacing, and number of rows and columns. </p>
          )}
          {currentPage === 5 && (
            <p>Lined grid or graph paper with lines evenly spaced 10mm apart and no borders.</p>
          )}
        </DemoImageCaption>
      </DemoImageWrapper>
    </StyledPageDemo>
  )
}

export default PageDemoCarousel