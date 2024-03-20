import React, { useEffect } from "react"
import SVG from "react-inlinesvg"
import { pageMargins } from "../../../styles/variables"
import { convertFloatFixed, convertToPx, isNotEmpty } from "../../../utils/helper-functions"

import { useEditorDispatch } from "../context/editorContext"
import Template from "../pageComponents/Template"
import PageBackground from "../pageComponents/PageBackground"

const minimumMargin = pageMargins.minimum
const holesMargin = pageMargins.holes

function CanvasPage({
  canvasPageRef,
  canvasPages,
  canvasPageTemplates,
  setDimensions,
  pageData,
  pageSide,
  productData,
  selectedPage,
  setMax,
  setPageData,
  setSelectedPageSvg,
  setSvgLoaded,
  svgLoaded,
}) {
  let currentPage, currentPageTemplate, isSelected;
  let isCoverPage = false
  const dispatch = useEditorDispatch()
  const isLeftPage = selectedPage % 2 === 0
  const isRightPage = selectedPage % 2 !== 0
  let currentPageMargins = {}
  let currentPageDimensions = {}
  let pageDimensions = {}

  // get the proper corresponding `currentPage` number based on page side and selectedPage
  if (pageSide === "left" && isLeftPage) {
    currentPage = selectedPage - 1
    isSelected = true
  }
  else if (pageSide === "left" && isRightPage) {
    // this is the first cover page
    if (selectedPage === 1) {
      isCoverPage = true
    }
    else {
      currentPage = selectedPage - 2
    }
  }
  else if (pageSide === "right" && isRightPage) {
    currentPage = selectedPage - 1
    isSelected = true
  }
  else if (pageSide === "right" && isLeftPage) {
    // this is the last cover page
    if (selectedPage === productData.numOfPages) {
      isCoverPage = true
    }
    else {
      currentPage = selectedPage
    }
  }

  if (isNotEmpty(currentPage)) {
    currentPageTemplate = canvasPageTemplates[canvasPages[currentPage].pageId]

    currentPageMargins = {
      left: convertToPx(currentPageTemplate.marginLeft),
      right: convertToPx(currentPageTemplate.marginRight),
      top: convertToPx(currentPageTemplate.marginTop),
      bottom: convertToPx(currentPageTemplate.marginBottom),
    }
    currentPageDimensions = {
      height: currentPageTemplate.svgHeight,
      width: currentPageTemplate.svgWidth,
      x: pageSide === "left" ? minimumMargin : productData.widthPixel + holesMargin,
      y: minimumMargin,
    }
   
    if (isSelected) {
      pageDimensions = {
        x: convertFloatFixed(currentPageDimensions.x + convertToPx(pageData.marginLeft), 3),
        y: convertFloatFixed(currentPageDimensions.y + convertToPx(pageData.marginTop), 3),
        height: convertFloatFixed(currentPageDimensions.height - convertToPx(pageData.marginTop) - convertToPx(pageData.marginBottom), 3),
        width: convertFloatFixed(currentPageDimensions.width - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight), 3),
      }
    }
    else {
      pageDimensions = {
        x: convertFloatFixed(currentPageDimensions.x + currentPageMargins.left, 3),
        y: convertFloatFixed(currentPageDimensions.y + currentPageMargins.top, 3),
        height: convertFloatFixed(currentPageDimensions.height - currentPageMargins.top - currentPageMargins.bottom, 3),
        width: convertFloatFixed(currentPageDimensions.width - currentPageMargins.left - currentPageMargins.right, 3),
      }
    }
  }

  const handleSvgLoad = (src) => {
    if (src && isSelected) {
      setSvgLoaded(selectedPage)
    }
  }

  useEffect(() => {
    if (!isCoverPage) {
      if (!pageData.template && isSelected) {
        setPageData({
          ...pageData,
          active: isLeftPage ? false : true,
          svgHeight: currentPageDimensions.height,
          svgWidth: currentPageDimensions.width,
          x: currentPageDimensions.x,
          y: currentPageDimensions.y,
          marginTop: currentPageTemplate.marginTop,
          marginRight: currentPageTemplate.marginRight,
          marginBottom: currentPageTemplate.marginBottom,
          marginLeft: currentPageTemplate.marginLeft,
          svg: currentPageTemplate && currentPageTemplate.svg,
        })

        if (canvasPageRef && canvasPageRef.current && isSelected) {
          setSvgLoaded(selectedPage)
        }
        else {
          setSvgLoaded(false)
        }
      }
    }


    dispatch({
      type: "reset",
    })
  }, [selectedPage, canvasPageRef, canvasPageRef.current])

  if (isCoverPage) {
    return null
  }
  else {
    return (
      <>
        <PageBackground
          isSelected={isSelected}
          pageSide={pageSide}
          productData={productData}
          suppressContentEditableWarning={true}
        />
        {pageData.template && isSelected ? (
          <Template
            currentPageSide={pageSide}
            pageData={pageData}
            productData={productData}
            setDimensions={setDimensions}
            setMax={setMax}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            setSvgLoaded={setSvgLoaded}
            svgLoaded={svgLoaded}
            suppressContentEditableWarning={true}
          />
        ) : (
          <SVG
            key={selectedPage ? selectedPage : (isLeftPage ? selectedPage - 1 : selectedPage + 1)}
            innerRef={isSelected ? canvasPageRef : null}
            onLoad={(src) => handleSvgLoad(src)}
            id={pageSide === "left" ? "left-page" : "right-page"}
            src={currentPageTemplate && currentPageTemplate.svg}
            x={pageDimensions.x}
            y={pageDimensions.y}
            width={pageDimensions.width}
            height={pageDimensions.height}
            viewBox={`0 0 ${pageDimensions.width} ${pageDimensions.height}`}
            suppressContentEditableWarning={true}
          />
        )}
      </>
    )
  }
}

export default CanvasPage