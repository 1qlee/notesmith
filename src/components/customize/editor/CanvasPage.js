import React, { useEffect } from "react"
import SVG from "react-inlinesvg"
import { pageMargins } from "../../../styles/variables"
import { convertFloatFixed, convertToPx } from "../../../utils/helper-functions"

import { useEditorDispatch } from "../context/editorContext"
import Template from "../pageComponents/Template"
import PageBackground from "../pageComponents/PageBackground"

function CanvasPage({
  productData,
  canvasPageRef,
  currentPageSide,
  isSelected,
  pageData,
  pagePosition,
  pageSide,
  pageTemplate,
  selectedPage,
  selectedPageSvg,
  setPageData,
  setSelectedPageSvg,
  setSvgLoaded,
  setSvgData,
  setMax,
}) {
  const dispatch = useEditorDispatch()
  const maxSvgSize = {
    height: convertFloatFixed(pageData.maxContentHeight - convertToPx(pageData.marginTop) - convertToPx(pageData.marginBottom), 3),
    width: convertFloatFixed(pageData.maxContentWidth - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight), 3),
  }
  const isLeftPage = pageSide === "left"

  useEffect(() => {
    if (isSelected) {
      setSvgLoaded(selectedPage)
    }

    dispatch({
      type: "reset",
    })
  }, [selectedPage, isSelected])

  const handleSvgLoad = (src) => {
    if (src && isSelected) {
      setSvgLoaded(selectedPage)
    }
  }

  if (selectedPage === 1 && pageSide === "left") {
    return null
  }
  else if (selectedPage === productData.numOfPages && pageSide === "right") {
    return null
  }
  else {
    return (
      <>
        <PageBackground
          currentPageSide={currentPageSide}
          isSelected={isSelected}
          pageHeight={pageData.svgHeight}
          pageWidth={pageData.svgWidth}
          pageSide={pageSide}
          suppressContentEditableWarning={true}
        />
        {pageData.template && isSelected ? (
          <Template
            currentPageSide={currentPageSide}
            maxSvgSize={maxSvgSize}
            pageData={pageData}
            pagePosition={pagePosition}
            selectedPageSvg={selectedPageSvg}
            setMax={setMax}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            setSvgData={setSvgData}
            setSvgLoaded={setSvgLoaded}
            suppressContentEditableWarning={true}
          />
        ) : (
          <SVG
            key={selectedPage ? selectedPage : (isLeftPage ? selectedPage - 1 : selectedPage + 1)}
            innerRef={isSelected ? canvasPageRef : null}
            onLoad={(src) => handleSvgLoad(src)}
            id={isLeftPage ? "left-page" : "right-page"}
            xmlns="http://www.w3.org/2000/svg"
            x={pageData.x}
            y={pageData.y}
            width={maxSvgSize.width}
            height={maxSvgSize.height}
            viewBox={`0 0 ${maxSvgSize.width} ${maxSvgSize.height}`}
            src={pageTemplate && pageTemplate.svg}
            suppressContentEditableWarning={true}
          />
        )}
      </>
    )
  }
}

export default CanvasPage