import React, { useEffect } from "react"
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
    font-size: 0.7rem;
    font-family: "Inter", Helvetica, Tahoma, sans-serif;
    margin: 0.25rem 0 0 0;
    user-select: none;
  }
  svg {
    height: 64px;
    width: 48px;
    pointer-events: none;
    box-shadow: 0 0 0 1px ${colors.gray.threeHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  &.is-active {
    svg {
      box-shadow: 0 0 0 2px ${colors.blue.sixHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
    }
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      svg {
        box-shadow: 0 0 0 2px ${colors.blue.threeHundred}, inset 1px 1px 0px 0px ${colors.white}, inset 1px -1px 0px 0px ${colors.white}, inset -1px -1px 0px 0px ${colors.white}, inset -1px 1px 0px 0px ${colors.white};
      }
    }
  }
`

function Page({
  page,
  pageData,
  selectedPage,
  setSelectedPage,
  setPageData,
  pageNumber,
  pageSize
}) {
  // change the selected page number
  const handleSelectPage = e => {
    const pageNumber = parseInt(e.currentTarget.dataset.pagenumber)

    setSelectedPage(pageNumber)
    if (selectedPage !== pageNumber) {
      setPageData({...pageData, template: e.target.value})
    }
  }

  return (
     <StyledPage
       onClick={e => handleSelectPage(e)}
       className={selectedPage === pageNumber ? "is-active" : null}
       data-pagenumber={pageNumber}
     >
       <SVG
         xmlns="http://www.w3.org/2000/svg"
         height="64"
         width="48"
         viewBox={`0 0 ${pageSize.width} ${pageSize.height}`}
         src={page}
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
  pageSize,
  selectedPage,
  setPageData,
  setPageSize,
  setSelectedPage,
  setPagebarLoading,
  pagebarLoading,
}) {

  // after pagebar loads, set pageLoading to false
  useEffect(() => {
    setPagebarLoading(false)
  })

  return (
    <>
      {pagebarLoading ? (
        <Flexbox
          flex="flex"
          alignitems="center"
          justifycontent="center"
          height="100%"
        >
          <Icon className="is-loading" color={colors.blue.threeHundred}>
            <Loading />
          </Icon>
        </Flexbox>
      ) : (
        <Flexbox
          flex="flex"
          flexwrap="wrap"
          justifycontent="center"
          padding="1rem"
          height="100%"
        >
          {canvasPages.map((page, index) => (
            <Page
              key={index}
              page={page}
              pageNumber={index + 1}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              setPageData={setPageData}
              pageData={pageData}
              pageSize={pageSize}
            />
          ))}
        </Flexbox>
      )}
    </>
  )
}

export default Pagebar
