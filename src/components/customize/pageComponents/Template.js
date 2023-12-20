import React, { useEffect, useRef } from "react"
import { useEditorDispatch } from "../context/editorContext"

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
  maxSvgSize,
  pageData,
  pagePosition,
  setMax,
  setPageData,
  setSelectedPageSvg,
  setSvgData,
  setSvgLoaded,
}) => {
  const dispatch = useEditorDispatch()
  const ref = useRef(null)

  useEffect(() => {
    setSvgLoaded(null)

    if (ref && ref.current) {
      const template = ref.current
      setSelectedPageSvg(template)

      dispatch({
        type: "initialize",
        canvas: template,
      })
      
      setTimeout(() => {
        const { height, width } = template.getBBox()

        setSvgData({
          height: height,
          width: width,
        })
      }, 1)
    }
  }, [ref])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      id={currentPageSide === "left" ? "left-page" : "right-page"}
      x={pagePosition.x}
      y={pagePosition.y}
      width={pageData.maxContentWidth}
      height={pageData.maxContentHeight}
      viewBox={`0 0 ${pageData.maxContentWidth} ${pageData.maxContentHeight}`}
      fill="#fff"
    >
      {pageData.template === "blank" && (
        null
      )}
      {pageData.template === "ruled" && (
        <Ruled
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "dot" && (
        <Dot
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "graph" && (
        <Graph
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "hexagon" && (
        <Hexagon
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "isometric" && (
        <Isometric
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "seyes" && (
        <Seyes
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "music" && (
        <Music
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "handwriting" && (
        <Handwriting
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "cross" && (
        <CrossGrid
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
      {pageData.template === "calligraphy" && (
        <Calligraphy
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
          setMax={setMax}
        />
      )}
    </svg>
  )
}

export default Template
