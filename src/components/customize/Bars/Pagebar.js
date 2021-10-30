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
    height: 64px;
    pointer-events: none;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    width: 48px;
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
  setPageData,
  pageNumber,
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
         viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
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
  selectedPage,
  setPageData,
  setSelectedPage,
  setPagebarLoading,
  pagebarLoading,
}) {

  // after pagebar loads, set pageLoading to false
  useEffect(() => {
    console.log("page bar has loaded")
    setPagebarLoading(false)
  }, [])

  return (
    <>
      {pagebarLoading ? (
        <Flexbox
          flex="flex"
          alignitems="center"
          justifycontent="center"
          height="100%"
        >
          <Icon className="is-loading" color={colors.primary.threeHundred}>
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
            />
          ))}
        </Flexbox>
      )}
    </>
  )
}

export default Pagebar
