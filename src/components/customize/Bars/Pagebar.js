import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import SVG from "react-inlinesvg"
import Loading from "../../../assets/loading.svg"

import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../Icon"

const StyledPage = styled.div`
  text-align: center;
  padding: 0.5rem;
  p {
    color: ${colors.gray.sixHundred};
    font-family: "Inter", Helvetica, Tahoma, sans-serif;
    font-size: 0.675rem;
    margin: 0.5rem 0 0 0;
    transition: color 0.2s;
    user-select: none;
  }
  svg {
    box-shadow: 2px 2px 6px rgba(0,0,0,0.07);
    border: 1px solid ${colors.gray.threeHundred};
    border-radius: 0.25rem;
    height: 80px;
    pointer-events: none;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    width: 60px;
  }
  &.is-active {
    p {
      color: ${colors.primary.sixHundred};
      font-weight: 700;
    }
    svg {
      box-shadow: 0 0 0 ${colors.gray.oneHundred};
      border-color: ${colors.gray.nineHundred};
      transform: translate(1px, 1px);
    }
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      svg {
        box-shadow: 1px 1px 1px ${colors.gray.oneHundred};
        border-color: ${colors.gray.sixHundred};
      }
    }
  }
`

function Page({
  page,
  pageData,
  selectedPage,
  setSelectedPage,
  pageNumber,
}) {
  // change the selected page number
  const handleSelectPage = value => {
    const pageNumber = parseInt(value)
    setSelectedPage(pageNumber)
  }

  return (
     <StyledPage
       onClick={e => handleSelectPage(pageNumber)}
       className={selectedPage === pageNumber ? "is-active" : null}
     >
       <SVG
         xmlns="http://www.w3.org/2000/svg"
         viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
         src={page}
         loader={<span>Loading</span>}
         x="0"
         y="0"
       />
      <p>{pageNumber}</p>
     </StyledPage>
  )
}

function Pagebar({
  canvasPages,
  pageData,
  selectedPage,
  setPageData,
  setSelectedPage,
}) {

  return (
    <Flexbox
      flex="flex"
      flexwrap="wrap"
      justifycontent="center"
      height="100%"
      padding="1rem"
    >
      {canvasPages.map(page => (
        <Page
          key={page.id}
          page={page.svg}
          pageNumber={page.pageNumber}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageData={pageData}
        />
      ))}
    </Flexbox>
  )
}

export default Pagebar
