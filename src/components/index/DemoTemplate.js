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

const TemplateComponents = {
  ruled: Ruled,
  dot: Dot,
  graph: Graph,
  hexagon: Hexagon,
  isometric: Isometric,
  seyes: Seyes,
  music: Music,
  handwriting: Handwriting,
  cross: CrossGrid,
  calligraphy: Calligraphy
}

function DemoTemplate({
  pageDimensions,
  pageData,
  setPageData,
  setSvgLoaded,
}) {
  let adjustedDimensions = {
    height: pageDimensions.height,
    width: pageDimensions.width,
  }
  const [max, setMax] = useState({
    rows: 200,
    columns: 200,
  })
  const TemplateComponent = TemplateComponents[pageData.template]

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="100%"
      width="100%"
      fill="#fff"
      x="0"
      y="0"
    >
      {TemplateComponent && (
        <TemplateComponent
          maxSvgSize={adjustedDimensions}
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