import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import PageSpread from "./PageSpread"
import Workspace from "./Workspace"

const StyledCanvas = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  padding: 32px 64px;
  background-color: ${colors.white};
`

function Canvas({
  productData,
  canvasPages,
  canvasPageTemplates,
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
        <StyledCanvas>
          <PageSpread
            productData={productData}
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
