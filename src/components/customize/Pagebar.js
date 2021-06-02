import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Line from "../../assets/customize/line.svg"

import Icon from "../Icon"
import Button from "../Button"
import { Flexbox } from "../layout/Flexbox"

const StyledPagebar = styled.div`
  background-color: ${colors.white};
  box-shadow: 0 1px 4px ${colors.shadow.float};
  height: 112px;
  padding: 0 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  &::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.threeHundred};
  }
`

const StyledPage = styled.div`
  text-align: center;
  padding: 0.5rem;
  svg {
    height: 48px;
    width: 32px;
    pointer-events: none;
    box-shadow: 0 2px 2px ${colors.shadow.float};
    transition: box-shadow 0.2s, border-color 0.2s;
    border: 1px solid ${colors.gray.sixHundred};
  }
  &.is-active {
    svg {
      box-shadow: 2px 2px 0 ${colors.primary.sixHundred}, -2px -2px 0 ${colors.primary.sixHundred}, 2px -2px 0 ${colors.primary.sixHundred}, -2px 2px 0  ${colors.primary.sixHundred};
      border-color: transparent;
    }
  }
`

function Page({
  page,
  selectedPage,
  setSelectedPage,
  pageNumber,
  pageSize
}) {
  const pageSvgRef = useRef()

  useEffect(() => {
    pageSvgRef.current.innerHTML = page
  })

  const selectPage = e => {
    console.log(e.currentTarget)
    setSelectedPage(e.currentTarget.dataset.pagenumber)
  }

  return (
     <StyledPage
       onClick={e => selectPage(e)}
       className={selectedPage == pageNumber ? "is-active" : null}
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
  selectedPage,
  setSelectedPage,
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
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            pageSize={pageSize}
          />
        ))}
      </Flexbox>
    </StyledPagebar>
  )
}

export default Pagebar
