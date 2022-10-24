import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import { Flexbox } from "../layout/Flexbox"
import Button from "../Button"
import Icon from "../Icon"
import PageSpread from "./PageSpread"
import Workspace from "./Workspace"

const StyledCanvas = styled.div`
  display: block;
  background-color: ${colors.white};
  height: ${props => props.height || "100%"};
  width: ${props => props.width || "100%"};
`

function Canvas({
  bookData,
  canvasPages,
  canvasPageTemplates,
  pageData,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
}) {
  const [canvasSize, setCanvasSize] = useState({
    width: 1456,
    height: 916,
  })

  return (
    <Workspace>
      <StyledCanvas>
        <svg
          id="page-root"
          xmlns="http://www.w3.org/2000/svg"
          xlinkns="http://www.w3.org/1999/xlink"
          width={canvasSize.width}
          height={canvasSize.height}
        >
          <PageSpread
            bookData={bookData}
            canvasSize={canvasSize}
            canvasPages={canvasPages}
            canvasPageTemplates={canvasPageTemplates}
            pageData={pageData}
            selectedPage={selectedPage}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            setSvgSize={setSvgSize}
          />
        </svg>
      </StyledCanvas>
    </Workspace>
  )
}

export default Canvas
