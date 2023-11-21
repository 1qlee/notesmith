import React, { useEffect, useState, lazy, Suspense } from "react"
import styled from "styled-components"
import { breakpoints, widths } from "../../styles/variables"
import { StaticImage } from "gatsby-plugin-image"

const StyledPageDemo = styled.div`
  position: relative;
  margin-top: 32px;
  svg {
    height: 100%;
    width: 100%;
  }
`

const DemoImageWrapper = styled.div`
  position: relative;
  margin: 0 auto;
`

const DemoImage = styled.div`
  position: absolute;
  top: 0;
  left: -32px;
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


const PageDemos = lazy(() => import("./PageDemos"))

function PageDemoCarousel() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pause, setPause] = useState(false)

  useEffect(() => {
    let timer
    
    if (!pause) {
      timer = setInterval(() => {
        setCurrentPage((prevPage) => {
          if (prevPage === 5) {
            return 1
          } else {
            return prevPage + 1
          }
        })
      }, 1000)
    }

    return () => clearInterval(timer);
  }, [pause])

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
          <Suspense
            fallback={<span></span>}
          >
            <PageDemos
              currentPage={currentPage}
            />
          </Suspense>
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