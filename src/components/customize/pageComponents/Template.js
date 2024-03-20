import React, { useEffect, useRef } from "react"
import { useEditorDispatch } from "../context/editorContext"
import { convertFloatFixed, convertToPx, convertToMM } from "../../../utils/helper-functions"
import { pageMargins } from "../../../styles/variables"

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

const Template = ({
  currentPageSide,
  pageData,
  productData,
  setDimensions,
  setMax,
  setPageData,
  setSelectedPageSvg,
  setSvgLoaded,
  svgLoaded,
}) => {
  const dependencies = [
    pageData.template,
    pageData.marginTop,
    pageData.marginRight,
    pageData.marginBottom,
    pageData.marginLeft,
    pageData.rows,
    pageData.columns,
    pageData.staves,
    pageData.ascSpacing,
    pageData.dscSpacing,
    pageData.xHeight,
    pageData.rowSpacing,
    pageData.columnSpacing,
    pageData.hexagonRadius,
    pageData.slantSpacing,
    pageData.staffSpacing,
    pageData.crossSize,
    pageData.spacing,
    pageData.strokeWidth,
    pageData.angle,
    pageData.borderData,
  ]
  const holesMargin = pageMargins.holes
  const templateMargins = {
    top: convertToPx(pageData.marginTop),
    right: convertToPx(pageData.marginRight),
    bottom: convertToPx(pageData.marginBottom),
    left: convertToPx(pageData.marginLeft),
  }
  let templateData = {
    position: {
      x: currentPageSide === "left" ? pageMargins.minimum + templateMargins.left : convertFloatFixed(productData.widthPixel + holesMargin + templateMargins.left, 3),
      y: convertFloatFixed(pageMargins.minimum + templateMargins.top, 3),
    },
    size: {
      height: convertFloatFixed(pageData.maxContentHeight - (templateMargins.top + templateMargins.bottom), 3),
      width: convertFloatFixed(pageData.maxContentWidth - (templateMargins.left + templateMargins.right), 3),
    }
  }
  const dispatch = useEditorDispatch()
  const ref = useRef(null)

  useEffect(() => {
    setSvgLoaded(null)

    if (ref && ref.current) {
      const template = ref.current
      const pageBbox = template.getBBox()

      setSelectedPageSvg(template)
      setDimensions({
        svgHeight: pageBbox.height,
        svgWidth: pageBbox.width,
        maximumMarginHeight: convertFloatFixed(convertToMM(templateData.size.height) - pageData.strokeWidth, 3),
        maximumMarginWidth: convertToMM(templateData.size.width),
        x: templateData.position.x,
        y: templateData.position.y,
      })

      dispatch({
        type: "initialize",
        canvas: template,
      })
    }
  }, [pageData.template, svgLoaded])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
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
  )
}

export default Template
