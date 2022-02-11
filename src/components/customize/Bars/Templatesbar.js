import React, { useState } from "react"
import styled from "styled-components"
import { colors, convertToMM } from "../../../styles/variables"
import { CaretDown } from "phosphor-react"

import { Flexbox } from "../../layout/Flexbox"
import { StyledLabel, StyledFieldset, SelectWrapper, StyledSelect, SelectIcon } from "../../form/FormComponents"
import { BlankPageIcon, RuledPageIcon, GraphPageIcon, DotPageIcon } from "../PageIcons"
import Button from "../../Button"
import DotControls from "../Template-controls/DotControls"
import RuledControls from "../Template-controls/RuledControls"
import GraphControls from "../Template-controls/GraphControls"

const TemplatesContent = styled.div`
  overflow-y: auto;
  padding: 1rem;
  &::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.threeHundred};
  }
`

function Templatesbar({
  pageData,
  setPageData,
  setShowModal,
  selectedPage,
  selectedPageSvg,
}) {
  const [loading, setLoading] = useState(false)
  const lineWidthMM = convertToMM(pageData.pageWidth)
  const maximumMarginHeight = convertToMM(pageData.pageHeight)
  const maximumMarginWidth = convertToMM(pageData.pageWidth)
  const templateHeight = selectedPageSvg ? selectedPageSvg.getBoundingClientRect().height : null
  const templateWidth = selectedPageSvg ? selectedPageSvg.getBoundingClientRect().width : null

  function handleTemplateSelect(template) {
    // set initial values for page data
    switch(template) {
      case "ruled":
        setPageData({
          ...pageData,
          template: template,
          alignmentHorizontal: "center",
          alignmentVertical: "middle",
          spacing: 5,
          opacity: 1,
          thickness: 0.175,
          dotRadius: 0.6,
          rows: 43,
          columns: 27,
          marginTop: 2.275,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          width: 127,
          lineWidth: lineWidthMM,
        })
        break
      case "dot":
        setPageData({
          ...pageData,
          template: template,
          alignmentHorizontal: "center",
          alignmentVertical: "middle",
          spacing: 5,
          opacity: 1,
          thickness: 0.175,
          dotRadius: 0.1,
          rows: 43,
          columns: 27,
          marginTop: 2.173,
          marginBottom: 0,
          marginLeft: 0.899,
          marginRight: 0,
          width: 1,
          lineWidth: lineWidthMM,
        })
        break
      case "graph":
        setPageData({
          ...pageData,
          template: template,
          alignmentHorizontal: "center",
          alignmentVertical: "middle",
          spacing: 5,
          opacity: 1,
          thickness: 0.175,
          dotRadius: 0.6,
          rows: 43,
          columns: 27,
          marginTop: 2.229,
          marginBottom: 0,
          marginLeft: 0.913,
          marginRight: 0,
          width: 127,
          lineWidth: lineWidthMM,
        })
        break
      default:
        setPageData({
          ...pageData,
          template: template,
          alignmentHorizontal: "center",
          alignmentVertical: "middle",
          spacing: 5,
          opacity: 1,
          thickness: 0.175,
          dotRadius: 0.6,
          rows: 43,
          columns: 27,
          marginTop: 4.687,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          width: 1,
          lineWidth: lineWidthMM,
        })
        break
    }
  }

  return (
    <Flexbox
      flex="flex"
      flexdirection="column"
      justifycontent="space-between"
      height="100%"
    >
      <TemplatesContent>
        <Flexbox
          flex="flex"
          flexwrap="wrap"
          alignitems="center"
          justifycontent="space-between"
          margin="0 0 2rem 0"
        >
          <BlankPageIcon handleTemplateSelect={handleTemplateSelect} isActive={pageData.template === "blank"} />
          <RuledPageIcon handleTemplateSelect={handleTemplateSelect} isActive={pageData.template === "ruled"} />
          <DotPageIcon handleTemplateSelect={handleTemplateSelect} isActive={pageData.template === "dot"} />
          <GraphPageIcon handleTemplateSelect={handleTemplateSelect} isActive={pageData.template === "graph"} />
        </Flexbox>
        {pageData.template !== "blank" && pageData.template !== "none" && (
          <>
            {pageData.template === "ruled" && (
              <RuledControls
                selectedPage={selectedPage}
                pageData={pageData}
                setPageData={setPageData}
                selectedPageSvg={selectedPageSvg}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                templateHeight={templateHeight}
                templateWidth={templateWidth}
              />
            )}
            {pageData.template === "dot" && (
              <DotControls
                selectedPage={selectedPage}
                pageData={pageData}
                setPageData={setPageData}
                selectedPageSvg={selectedPageSvg}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                templateHeight={templateHeight}
                templateWidth={templateWidth}
              />
            )}
            {pageData.template === "graph" && (
              <GraphControls
                selectedPage={selectedPage}
                pageData={pageData}
                setPageData={setPageData}
                selectedPageSvg={selectedPageSvg}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                templateHeight={templateHeight}
                templateWidth={templateWidth}
              />
            )}
          </>
        )}
      </TemplatesContent>
      <Flexbox
        padding="1rem"
        backgroundcolor={colors.white}
        className="has-border-top"
        bordercolor={colors.gray.threeHundred}
      >
        <Button
          backgroundcolor={colors.primary.sixHundred}
          className={loading ? "is-loading" : null}
          borderradius="0.25rem"
          color={colors.primary.white}
          padding="1rem"
          width="100%"
          disabled={pageData.template === "none" ? true : false}
          onClick={() => setShowModal({
            show: true,
            type: "template"
          })}
        >
          Apply template
        </Button>
      </Flexbox>
    </Flexbox>
  )
}

export default Templatesbar
