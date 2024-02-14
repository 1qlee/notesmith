import React, { useState, useEffect, useRef } from "react"
import { pageMargins, colors } from "../../../styles/variables"
import { convertToPx, convertFloatFixed } from "../../../utils/helper-functions"

import Holes from "../pageComponents/Holes"
import Ruled from "../templates/Ruled"
import Dot from "../templates/Dot"
import Graph from "../templates/Graph"
import Hexagon from "../templates/Hexagon"
import Isometric from "../templates/Isometric"
import Seyes from "../templates/Seyes"
import Music from "../templates/Music"
import Handwriting from "../templates/Handwriting"
import CrossGrid from "../templates/CrossGrid"
import Calligraphy from "../templates/Calligraphy"

function ProductTemplate({
  bookData,
  currentPageSide,
  pageData,
  setPageData,
  setSelectedPageSvg,
  setMax,
  setSvgLoaded,
  setDimensions,
}) {
  const dependencies = [
    pageData.template,
    pageData.marginTop,
    pageData.marginRight,
    pageData.marginBottom,
    pageData.marginLeft,
    pageData.rows,
    pageData.columns,
    pageData.rowSpacing,
    pageData.columnSpacing,
    pageData.slantSpacing,
    pageData.staffSpacing,
    pageData.spacing,
    pageData.strokeWidth,
    pageData.angle,
    pageData.show,
    pageData.borderData,
  ]
  const minimumMargin = pageMargins.minimum
  const holesMargin = pageMargins.holes
  const templateMargins = {
    top: convertToPx(pageData.marginTop),
    right: convertToPx(pageData.marginRight),
    bottom: convertToPx(pageData.marginBottom),
    left: convertToPx(pageData.marginLeft),
  }
  const templateData = {
    position: {
      x: currentPageSide === "left" ? minimumMargin + templateMargins.left : convertFloatFixed(holesMargin + templateMargins.left, 3),
      y: convertFloatFixed(minimumMargin + templateMargins.top, 3),
    },
    size: {
      height: convertFloatFixed(pageData.maxContentHeight - (templateMargins.top + templateMargins.bottom), 3),
      width: convertFloatFixed(pageData.maxContentWidth - (templateMargins.left + templateMargins.right), 3),
    }
  }
  const templateRef = useRef(null)

  useEffect(() => {
    if (templateRef && templateRef.current) {
      setSelectedPageSvg(templateRef.current)
      setDimensions({
        svgHeight: templateData.size.height,
        svgWidth: templateData.size.width,
        x: templateData.position.x,
        y: templateData.position.y,
      })
      setPageData({...pageData}) // needed to force a proper re-render for some reason - nifty workaround!
    }
  }, [...dependencies, templateRef])

  if (pageData.show) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={bookData.widthPixel}
        height={bookData.heightPixel}
        viewBox={`0 0 ${bookData.widthPixel} ${bookData.heightPixel}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={bookData.widthPixel}
          height={bookData.heightPixel}
          x="0"
          y="0"
        >
          <rect
            width={bookData.widthPixel}
            height={bookData.heightPixel}
            fill={colors.white}
            stroke={colors.gray.threeHundred}
            strokeWidth="2px"
          ></rect>
          <Holes
            currentPageSide={currentPageSide}
            pageHeight={bookData.heightPixel}
            pageWidth={bookData.widthPixel}
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={templateRef}
          id={currentPageSide === "left" ? "left-page" : "right-page"}
          x={templateData.position.x}
          y={templateData.position.y}
          width={templateData.size.width}
          height={templateData.size.height}
          viewBox={`0 0 ${templateData.size.width} ${templateData.size.height}`}
          fill="#fff"
        >
          {pageData.template === "blank" && (
            null
          )}
          {pageData.template === "ruled" && (
            <Ruled
              maxSvgSize={templateData.size}
              pageData={pageData}
              setPageData={setPageData}
              setMax={setMax}
              setSvgLoaded={setSvgLoaded}
            />
          )}
          {pageData.template === "dot" && (
            <Dot
              maxSvgSize={templateData.size}
              pageData={pageData}
              setPageData={setPageData}
              setMax={setMax}
              setSvgLoaded={setSvgLoaded}
            />
          )}
          {pageData.template === "graph" && (
            <Graph
              maxSvgSize={templateData.size}
              pageData={pageData}
              setPageData={setPageData}
              setMax={setMax}
              setSvgLoaded={setSvgLoaded}
            />
          )}
          {pageData.template === "hexagon" && (
            <Hexagon
              maxSvgSize={templateData.size}
              pageData={pageData}
              setPageData={setPageData}
              setMax={setMax}
              setSvgLoaded={setSvgLoaded}
            />
          )}
          {pageData.template === "isometric" && (
            <Isometric
              maxSvgSize={templateData.size}
              pageData={pageData}
              setPageData={setPageData}
              setMax={setMax}
              setSvgLoaded={setSvgLoaded}
            />
          )}
          {pageData.template === "seyes" && (
            <Seyes
              maxSvgSize={templateData.size}
              pageData={pageData}
              setPageData={setPageData}
              setMax={setMax}
              setSvgLoaded={setSvgLoaded}
            />
          )}
          {pageData.template === "music" && (
            <Music
              maxSvgSize={templateData.size}
              pageData={pageData}
              setPageData={setPageData}
              setMax={setMax}
              setSvgLoaded={setSvgLoaded}
            />
          )}
          {pageData.template === "handwriting" && (
            <Handwriting
              maxSvgSize={templateData.size}
              pageData={pageData}
              setPageData={setPageData}
              setMax={setMax}
              setSvgLoaded={setSvgLoaded}
            />
          )}
          {pageData.template === "cross" && (
            <CrossGrid
              maxSvgSize={templateData.size}
              pageData={pageData}
              setPageData={setPageData}
              setMax={setMax}
              setSvgLoaded={setSvgLoaded}
            />
          )}
          {pageData.template === "calligraphy" && (
            <Calligraphy
              maxSvgSize={templateData.size}
              pageData={pageData}
              setPageData={setPageData}
              setMax={setMax}
              setSvgLoaded={setSvgLoaded}
            />
          )}
        </svg>
      </svg>
    )
  }
}

export default ProductTemplate