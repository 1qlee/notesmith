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
  top: 28px;
  left: 0;
  padding-bottom: 32px;
  background-color: ${colors.white};
  min-width: 1440px;
  margin: 0 auto;
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
