import React, { useState } from "react"
import styled from "styled-components"
import { colors, convertToMM } from "../../../styles/variables"
import { CaretDown } from "phosphor-react"

import { Flexbox } from "../../layout/Flexbox"
import { StyledLabel, StyledFieldset, SelectWrapper, StyledSelect, SelectIcon } from "../../form/FormComponents"
import PageIcons from "../PageIcons"
import Button from "../../Button"
import DotControls from "../templateControls/DotControls"
import RuledControls from "../templateControls/RuledControls"
import GraphControls from "../templateControls/GraphControls"

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
          <PageIcons
            checkActiveVar={pageData.template}
            setData={setPageData}
            data={pageData}
            showLabels={true}
          />
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
