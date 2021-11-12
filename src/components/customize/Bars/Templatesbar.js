import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
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
}) {
  const [loading, setLoading] = useState(false)

  function handleTemplateSelect(template) {
    // set initial values for page data
    setPageData({
      ...pageData,
      template: template,
      alignmentHorizontal: "center",
      alignmentVertical: "middle",
      spacing: 5,
      opacity: 1,
      thickness: 1,
      rows: 43,
      columns: 27,
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5,
      width: 1,
      lineWidth: pageData.width
    })
  }

  return (
    <Flexbox
      flex="flex"
      flexdirection="column"
      justifycontent="space-between"
      height="100%"
    >
      <TemplatesContent>
        <StyledLabel>Templates</StyledLabel>
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
              <RuledControls pageData={pageData} setPageData={setPageData} />
            )}
            {pageData.template === "dot" && (
              <DotControls pageData={pageData} setPageData={setPageData} />
            )}
            {pageData.template === "graph" && (
              <GraphControls pageData={pageData} setPageData={setPageData} />
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
