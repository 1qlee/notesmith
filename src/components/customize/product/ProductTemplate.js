import React, { useState, useEffect, useCallback } from "react"
import { pageMargins, convertToPx, colors } from "../../../styles/variables"
import { ScreenClassRender } from "react-grid-system"

import Holes from "../pageComponents/Holes"
import Ruled from "../templates/Ruled"
import Dot from "../templates/Dot"
import Graph from "../templates/Graph"
import Blank from "../templates/Blank"
import Hexagon from "../templates/Hexagon"
import Isometric from "../templates/Isometric"
import Seyes from "../templates/Seyes"
import Music from "../templates/Music"
import Handwriting from "../templates/Handwriting"
import CrossGrid from "../templates/CrossGrid"
import Calligraphy from "../templates/Calligraphy"

function ProductTemplate({
  currentPageSide,
  pageData,
  maxSvgSize,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
}) {
  const { svgWidth, svgHeight, marginTop, marginRight, marginBottom, marginLeft } = pageData
  const minimumMargin = pageMargins.minimum
  const [node, setNode] = useState()
  const [pagePosition, setPagePosition] = useState({})

  const templateRef = useCallback(node => {
    if (node !== null) {
      setNode(node)
      setSelectedPageSvg(node)
    }
  }, [])

  useEffect(() => {
    if (node) {
      setSelectedPageSvg(node)

      setTimeout(() => {
        const dimensions = node.getBBox()
        setSvgSize({
          height: dimensions.height,
          width: dimensions.width,
        })
      }, 10)
    }

    const margin = {
      top: convertToPx(marginTop),
      right: convertToPx(marginRight),
      bottom: convertToPx(marginBottom),
      left: convertToPx(marginLeft),
    }

    setPagePosition({
      rightX: convertToPx(10.16) + margin.left,
      leftX: minimumMargin + margin.left,
      bothY: minimumMargin + margin.top,
    })
  }, [currentPageSide, pageData, node, maxSvgSize])

  function calculateSvgHeight(screenClass) {
    switch(screenClass) {
      case "xl":
        // 805 is not the mathematically correct value
        return svgWidth < 805 ? svgHeight : svgHeight * (805 / svgWidth)
      case "lg":
        return 600
      case "md":
      case "sm":
      case "xs":
        return 736
      default:
        return svgHeight
    }
  }

  function calculateSvgWidth(screenClass) {
    switch (screenClass) {
      case "xl":
        // 805 is not the mathematically correct value
        return svgWidth < 805 ? svgWidth : 805
      case "lg":
        return svgWidth * (600 / svgHeight)
      case "md":
      case "sm":
      case "xs":
        return svgWidth * (736 / svgHeight)
      default:
        return svgWidth
    }
  }

  if (pageData.show) {
    return (
      <ScreenClassRender
        render={screenClass => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={calculateSvgHeight(screenClass)}
            width={calculateSvgWidth(screenClass)}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgWidth}
              height={svgHeight}
              x="0"
              y="0"
            >
              <rect
                width={svgWidth}
                height={svgHeight}
                fill={colors.white}
                stroke={colors.gray.threeHundred}
                strokeWidth="2px"
              ></rect>
              <Holes
                currentPageSide={currentPageSide}
                pageHeight={svgHeight}
                pageWidth={svgWidth}
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              ref={templateRef}
              id={currentPageSide === "left" ? "left-page" : "right-page"}
              x={currentPageSide === "left" ? pagePosition.leftX : pagePosition.rightX}
              y={pagePosition.bothY}
              width={pageData.maxContentWidth}
              height={pageData.maxContentHeight}
              fill="#fff"
            >
              {pageData.template === "blank" && (
                <Blank
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                />
              )}
              {pageData.template === "ruled" && (
                <Ruled
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              )}
              {pageData.template === "dot" && (
                <Dot
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              )}
              {pageData.template === "graph" && (
                <Graph
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              )}
              {pageData.template === "hexagon" && (
                <Hexagon
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              )}
              {pageData.template === "isometric" && (
                <Isometric
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              )}
              {pageData.template === "seyes" && (
                <Seyes
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              )}
              {pageData.template === "music" && (
                <Music
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              )}
              {pageData.template === "handwriting" && (
                <Handwriting
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              )}
              {pageData.template === "cross" && (
                <CrossGrid
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              )}
              {pageData.template === "calligraphy" && (
                <Calligraphy
                  maxSvgSize={maxSvgSize}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              )}
            </svg>
          </svg>
        )}
      />
    )
  }
}

export default ProductTemplate