import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Line from "../../assets/customize/line.svg"

import Icon from "../Icon"
import Button from "../Button"

const StyledPagebar = styled.div`
  background-color: ${colors.white};
  box-shadow: 0 2px 2px ${colors.shadow.float};
  display: flex;
  flex-wrap: wrap;
  height: 600px;
  overflow-x: hidden;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  padding: 1rem;
  border-radius: 0 0 12px 12px / 0 0 6px 6px;
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
  p {
    font-size: 0.8rem;
    margin: 0.25rem 0 0 0;
    user-select: none;
  }
  svg {
    height: 48px;
    width: 32px;
    pointer-events: none;
    box-shadow: 1px 1px 0 ${colors.gray.threeHundred}, -1px -1px 0 ${colors.gray.threeHundred}, 1px -1px 0 ${colors.gray.threeHundred}, -1px 1px 0  ${colors.gray.threeHundred};
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  &.is-active {
    svg {
      box-shadow: 2px 2px 0 ${colors.primary.sixHundred}, -2px -2px 0 ${colors.primary.sixHundred}, 2px -2px 0 ${colors.primary.sixHundred}, -2px 2px 0  ${colors.primary.sixHundred};
    }
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      svg {
        box-shadow: 1px 1px 0 ${colors.gray.sixHundred}, -1px -1px 0 ${colors.gray.sixHundred}, 1px -1px 0 ${colors.gray.sixHundred}, -1px 1px 0  ${colors.gray.sixHundred};
      }
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
      {canvasPages.map((page, index) => (
        <Page
          page={page}
          pageNumber={index + 1}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={pageSize}
        />
      ))}
    </StyledPagebar>
  )
}

export default Pagebar
