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
  canvasPageSize,
  canvasSize,
  pageData,
  setPageContentSize,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
}) {

  return (
    <Workspace>
      <StyledCanvas>
        <svg
          id="page-root"
          xlinkns="http://www.w3.org/1999/xlink"
          width={canvasSize.width}
          height={canvasSize.height}
        >
          <PageSpread
            bookData={bookData}
            canvasPages={canvasPages}
            canvasPageSize={canvasPageSize}
            canvasSize={canvasSize}
            pageData={pageData}
            selectedPage={selectedPage}
            setPageContentSize={setPageContentSize}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
          />
        </svg>
      </StyledCanvas>
    </Workspace>
  )
}

export default Canvas
