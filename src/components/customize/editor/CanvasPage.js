import React, { useEffect } from "react"
import SVG from "react-inlinesvg"

import { useEditorDispatch } from "../context/editorContext"
import Template from "../pageComponents/Template"
import PageBackground from "../pageComponents/PageBackground"

function CanvasPage({
  canvasPageRef,
  templateData,
  setTemplateData,
  pageData,
  productData,
  selectedPage,
  setMax,
  setSelectedPageSvg,
  setSvgLoaded,
}) {
  const dispatch = useEditorDispatch()

  useEffect(() => {
    if (pageData.active) {
      setSvgLoaded(selectedPage)
    }

    dispatch({
      type: "reset",
    })
  }, [selectedPage])

  const handleSvgLoad = (src) => {
    if (src && pageData.active) {
      setSvgLoaded(selectedPage)
    }
  }

  if (selectedPage === 1 && pageData.side === "left") {
    return null
  }
  else if (selectedPage === productData.numOfPages && pageData.side === "right") {
    return null
  }
  else {
    return (
      <>
        <PageBackground
          currentPageSide={pageData.active ? pageData.pageSide : null}
          isSelected={pageData.active}
          pageSide={pageData.side}
          productData={productData}
          suppressContentEditableWarning={true}
        />
        {templateData.template && pageData.active ? (
          <Template
            currentPageSide={pageData.side}
            pageData={templateData}
            productData={productData}
            setMax={setMax}
            setPageData={setTemplateData}
            setSelectedPageSvg={setSelectedPageSvg}
            setSvgLoaded={setSvgLoaded}
            suppressContentEditableWarning={true}
          />
        ) : (
          <SVG
            key={selectedPage ? selectedPage : (pageData.pageSide === "left" ? selectedPage - 1 : selectedPage + 1)}
            innerRef={pageData.active ? canvasPageRef : null}
            onLoad={(src) => handleSvgLoad(src)}
            id={pageData.pageSide === "left" ? "left-page" : "right-page"}
            src={pageData && pageData.svg}
            suppressContentEditableWarning={true}
          />
        )}
      </>
    )
  }
}

export default CanvasPage