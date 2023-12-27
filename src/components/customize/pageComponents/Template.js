import React, { useEffect, useRef } from "react"
import { useEditorDispatch } from "../context/editorContext"
import { convertFloatFixed, convertToPx } from "../../../utils/helper-functions"
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
  setMax,
  setPageData,
  setSelectedPageSvg,
  setSvgLoaded,
}) => {
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
      setSelectedPageSvg(template)
      setPageData({
        ...pageData,
        svgHeight: templateData.size.height,
        svgWidth: templateData.size.width,
        x: templateData.position.x,
        y: templateData.position.y,
      })

      dispatch({
        type: "initialize",
        canvas: template,
      })
    }
  }, [...dependencies, ref, ref.current])

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
        />
      )}
      {pageData.template === "dot" && (
        <Dot
          maxSvgSize={templateData.size}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "graph" && (
        <Graph
          maxSvgSize={templateData.size}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "hexagon" && (
        <Hexagon
          maxSvgSize={templateData.size}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "isometric" && (
        <Isometric
          maxSvgSize={templateData.size}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "seyes" && (
        <Seyes
          maxSvgSize={templateData.size}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "music" && (
        <Music
          maxSvgSize={templateData.size}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "handwriting" && (
        <Handwriting
          maxSvgSize={templateData.size}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "cross" && (
        <CrossGrid
          maxSvgSize={templateData.size}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "calligraphy" && (
        <Calligraphy
          maxSvgSize={templateData.size}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
    </svg>
  )
}

export default Template
