import React from "react"
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
  productData,
  canvasPages,
  canvasPageTemplates,
  canvasSize,
  pageData,
  selectedPage,
  selectedPageSvg,
  setMax,
  setPageData,
  setSelectedPageSvg,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
}) {
  return (
    <>
      <Workspace>
        <StyledCanvas
          height={canvasSize.height}
          width={canvasSize.width}
        >
          <PageSpread
            productData={productData}
            canvasSize={canvasSize}
            canvasPages={canvasPages}
            canvasPageTemplates={canvasPageTemplates}
            pageData={pageData}
            selectedPage={selectedPage}
            selectedPageSvg={selectedPageSvg}
            setMax={setMax}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            leftPageData={leftPageData}
            rightPageData={rightPageData}
            setLeftPageData={setLeftPageData}
            setRightPageData={setRightPageData}
          />
        </StyledCanvas>
      </Workspace>
    </>
  )
}

export default Canvas
