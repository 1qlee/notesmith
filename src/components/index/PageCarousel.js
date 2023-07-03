import React, { useEffect, useState } from "react"
import styled from "styled-components"

import Sweater from "../../assets/peeps/sweater-paper.svg"
import Cyclops from "../../assets/peeps/cyclops-paper.svg"
import Hoodie from "../../assets/peeps/hoodie-paper.svg"
import Polo from "../../assets/peeps/polo-paper.svg"
import Striped from "../../assets/peeps/striped-paper.svg"
import Page1 from "../../assets/index/index-page-1.svg"
import Page1Alt from "../../assets/index/index-page-1-alt.svg"
import Page2 from "../../assets/index/index-page-2.svg"
import Page2Alt from "../../assets/index/index-page-2-alt.svg"
import Page3 from "../../assets/index/index-page-3.svg"
import Page3Alt from "../../assets/index/index-page-3-alt.svg"
import Page4 from "../../assets/index/index-page-4.svg"
import Page4Alt from "../../assets/index/index-page-4-alt.svg"
import Page5 from "../../assets/index/index-page-5.svg"
import Page5Alt from "../../assets/index/index-page-5-alt.svg"
import LinesBkgd from "../../images/index/lines-bkgd.png"

const StyledPageCarousel = styled.div`
  background-image: url(${LinesBkgd});
  display: flex;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
`

const CarouselItems = styled.div`
  position: relative;
  &:hover {
    cursor: pointer;
  }
`

const Profile = styled.div`
  position: absolute;
  bottom: 0;
  left: -150px;
  z-index: 2;
  @media only screen and (max-width: 1000px) {
    left: 50%;
  }
  @media only screen and (max-width: 600px) {
    left: 8rem;
    bottom: -2rem;
    svg {
      width: 150px;
      height: 150px;
    }
  }
`

function PageCarousel() {
  const [currentPage, setCurrentPage] = useState(0)
  const [pause, setPause] = useState(false)

  useEffect(() => {
    function startCarousel() {
      if (currentPage === 4) {
        return setCurrentPage(0)
      }
      return setCurrentPage(currentPage + 1)
    }

    const interval = setInterval(() => {
      if (pause) {
        return clearInterval(interval)
      }
      else {
        startCarousel()
      }
    }, 3000)

    return () => clearInterval(interval)
  })

  return (
    <StyledPageCarousel>
      <CarouselItems
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
      >
        {currentPage === 0 && (
          <>
            <Profile>
              <Polo />
            </Profile>
            {pause ? (
              <Page1Alt width="450" height="600" />
            ) : (
              <Page1 width="450" height="600" />
            )}
          </>
        )}
        {currentPage === 1 && (
          <>
            <Profile>
              <Striped />
            </Profile>
            {pause ? (
              <Page2Alt width="450" height="600" />
            ) : (
              <Page2 width="450" height="600" />
            )}
          </>
        )}
        {currentPage === 2 && (
          <>
            <Profile>
              <Hoodie />
            </Profile>
            {pause ? (
              <Page3Alt width="450" height="600" />
            ) : (
              <Page3 width="450" height="600" />
            )}
          </>
        )}
        {currentPage === 3 && (
          <>
            <Profile>
              <Sweater />
            </Profile>
            {pause ? (
              <Page4Alt width="450" height="600" />
            ) : (
              <Page4 width="450" height="600" />
            )}
          </>
        )}
        {currentPage === 4 && (
          <>
            <Profile>
              <Cyclops />
            </Profile>
            {pause ? (
              <Page5Alt width="450" height="600" />
            ) : (
              <Page5 width="450" height="600" />
            )}
          </>
        )}
      </CarouselItems>
    </StyledPageCarousel>
  )
}

export default PageCarousel