import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import PageSpread from "./PageSpread"
import Workspace from "./Workspace"

const StyledCanvas = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: ${colors.white};
  height: ${props => props.height + "px" || "100%"};
  width: ${props => props.width  + "px" || "100%"};
`

function Canvas({
  bookData,
  canvasPages,
  canvasPageTemplates,
  pageData,
  selectedPage,
  selectedPageSvg,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
  svgContent, 
  svgUpdate, 
  svgSize,
  log
}) {
  const [canvasSize, setCanvasSize] = useState({
    width: 1456,
    height: 916,
  })

  return (
    <>
      <Workspace>
        <StyledCanvas
          height={canvasSize.height}
          width={canvasSize.width}
        >
          <PageSpread
            bookData={bookData}
            canvasSize={canvasSize}
            canvasPages={canvasPages}
            canvasPageTemplates={canvasPageTemplates}
            pageData={pageData}
            selectedPage={selectedPage}
            selectedPageSvg={selectedPageSvg}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            setSvgSize={setSvgSize}
            svgSize={svgSize}
          />
        </StyledCanvas>
      </Workspace>
    </>
  )
}

export default Canvas
