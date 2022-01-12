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
  background-color: ${colors.paper.offWhite};
`

function Canvas({
  canvasPages,
  canvasSize,
  bookData,
  pageData,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
}) {

  return (
    <Workspace>
      <StyledCanvas
        style={{
          width: canvasSize.width,
          height: canvasSize.height
        }}
      >
        <svg
          id="page-root"
          xlinkns="http://www.w3.org/1999/xlink"
          width={canvasSize.width}
          height={canvasSize.height}
        >
          <PageSpread
            canvasPages={canvasPages}
            canvasSize={canvasSize}
            pageData={pageData}
            bookData={bookData}
            selectedPage={selectedPage}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
          />
        </svg>
      </StyledCanvas>
    </Workspace>
  )
}

export default Canvas
