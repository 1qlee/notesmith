import React, { useState } from "react"

import Ruled from "../customize/templates/Ruled"
import Dot from "../customize/templates/Dot"
import Graph from "../customize/templates/Graph"
import Hexagon from "../customize/templates/Hexagon"
import Isometric from "../customize/templates/Isometric"
import Seyes from "../customize/templates/Seyes"
import Music from "../customize/templates/Music"
import Handwriting from "../customize/templates/Handwriting"
import CrossGrid from "../customize/templates/CrossGrid"
import Calligraphy from "../customize/templates/Calligraphy"

function DemoTemplate({
  pageDimensions,
  pageData,
  setPageData,
  setSvgLoaded,
}) {
  const [max, setMax] = useState({
    rows: 200,
    columns: 200,
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="100%"
      width="100%"
      fill="#fff"
      x="0"
      y="0"
    >
      {pageData.template === "blank" && (
        null
      )}
      {pageData.template === "ruled" && (
        <Ruled
          maxSvgSize={pageDimensions}
          setMax={setMax}
          pageData={pageData}
          setPageData={setPageData}
          setSvgLoaded={setSvgLoaded}
        />
      )}
      {pageData.template === "dot" && (
        <Dot
          maxSvgSize={pageDimensions}
          setMax={setMax}
          pageData={pageData}
          setPageData={setPageData}
          setSvgLoaded={setSvgLoaded}
        />
      )}
      {pageData.template === "graph" && (
        <Graph
          maxSvgSize={pageDimensions}
          setMax={setMax}
          pageData={pageData}
          setPageData={setPageData}
          setSvgLoaded={setSvgLoaded}
        />
      )}
      {pageData.template === "hexagon" && (
        <Hexagon
          maxSvgSize={pageDimensions}
          setMax={setMax}
          pageData={pageData}
          setPageData={setPageData}
          setSvgLoaded={setSvgLoaded}
        />
      )}
      {pageData.template === "isometric" && (
        <Isometric
          maxSvgSize={pageDimensions}
          setMax={setMax}
          pageData={pageData}
          setPageData={setPageData}
          setSvgLoaded={setSvgLoaded}
        />
      )}
      {pageData.template === "seyes" && (
        <Seyes
          maxSvgSize={pageDimensions}
          setMax={setMax}
          pageData={pageData}
          setPageData={setPageData}
          setSvgLoaded={setSvgLoaded}
        />
      )}
      {pageData.template === "music" && (
        <Music
          maxSvgSize={pageDimensions}
          setMax={setMax}
          pageData={pageData}
          setPageData={setPageData}
          setSvgLoaded={setSvgLoaded}
        />
      )}
      {pageData.template === "handwriting" && (
        <Handwriting
          maxSvgSize={pageDimensions}
          setMax={setMax}
          pageData={pageData}
          setPageData={setPageData}
          setSvgLoaded={setSvgLoaded}
        />
      )}
      {pageData.template === "cross" && (
        <CrossGrid
          maxSvgSize={pageDimensions}
          setMax={setMax}
          pageData={pageData}
          setPageData={setPageData}
          setSvgLoaded={setSvgLoaded}
        />
      )}
      {pageData.template === "calligraphy" && (
        <Calligraphy
          maxSvgSize={pageDimensions}
          setMax={setMax}
          pageData={pageData}
          setPageData={setPageData}
          setSvgLoaded={setSvgLoaded}
        />
      )}
    </svg>
  )
}

export default DemoTemplate