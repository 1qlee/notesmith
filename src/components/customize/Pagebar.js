import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Line from "../../assets/customize/line.svg"

import Icon from "../Icon"
import Button from "../Button"
import { Flexbox } from "../layout/Flexbox"

const StyledPagebar = styled.div`
  height: 96px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  &::-webkit-scrollbar {
    height: 5px;
    width: 1rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.sixHundred};
  }
`

const StyledPage = styled.div`
  text-align: center;
  margin: 0.25rem;
  svg {
    height: 48px;
    width: 32px;
    pointer-events: none;
  }
  &.is-active {
    svg {
      box-shadow: 2px 2px 0 ${colors.blue.sixHundred}, -2px -2px 0 ${colors.blue.sixHundred};
    }
  }
`

function Page({
  page,
  activePage,
  setActivePage,
  pageNumber,
  pageSize
}) {
  const pageSvgRef = useRef()

  useEffect(() => {
    pageSvgRef.current.innerHTML = page
  })

  const selectPage = e => {
    console.log(e.currentTarget)
    setActivePage(e.currentTarget.dataset.pagenumber)
  }

  return (
     <StyledPage
       onClick={e => selectPage(e)}
       className={activePage == pageNumber ? "is-active" : null}
       data-pagenumber={pageNumber}
     >
       <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${pageSize.width} ${pageSize.height}`}
          ref={pageSvgRef}
        >
        </svg>
        <p>{pageNumber}</p>
     </StyledPage>
  )
}

function Pagebar({
  activePage,
  setActivePage,
  pageSize,
  setPageSize
}) {
  const canvasPages = JSON.parse(localStorage.getItem("canvas-pages"))

  return (
    <StyledPagebar>
      <Flexbox
        flex="flex"
        alignitems="center"
        height="100%"
      >
        {canvasPages.map((page, index) => (
          <Page
            page={page}
            pageNumber={index + 1}
            activePage={activePage}
            setActivePage={setActivePage}
            pageSize={pageSize}
          />
        ))}
      </Flexbox>
    </StyledPagebar>
  )
}

export default Pagebar
