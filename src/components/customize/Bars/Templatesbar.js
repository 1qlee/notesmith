import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { CaretDown, CheckCircle, Circle } from "phosphor-react"

import { Flexbox } from "../../layout/Flexbox"
import { StyledLabel, StyledFieldset, SelectWrapper, StyledSelect, SelectIcon } from "../../form/FormComponents"
import Button from "../../Button"
import Content from "../../Content"
import DotControls from "../Template-controls/DotControls"
import Icon from "../../Icon"
import RuledControls from "../Template-controls/RuledControls"

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
  pageSize,
  setPageData,
  setShowModal,
}) {
  const [loading, setLoading] = useState(false)

  function handleTemplateSelect(template) {
    setPageData({
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
        <StyledFieldset
          margin="0 0 2rem 0"
        >
          <SelectWrapper>
            <StyledSelect
              width="100%"
              onChange={e => handleTemplateSelect(e.target.value)}
              value={pageData.template}
            >
              <option value="none">- None -</option>
              <option value="blank">Blank</option>
              <option value="ruled">Ruled</option>
              <option value="dot">Dot grid</option>
              <option value="graph">Graph</option>
            </StyledSelect>
            <SelectIcon top="1rem">
              <CaretDown size="1rem" />
            </SelectIcon>
          </SelectWrapper>
        </StyledFieldset>
        {pageData.template !== "blank" && pageData.template !== "none" && (
          <>
            {pageData.template === "ruled" && (
              <RuledControls pageData={pageData} setPageData={setPageData} pageSize={pageSize} />
            )}
            {pageData.template === "dot" && (
              <DotControls pageData={pageData} setPageData={setPageData} pageSize={pageSize} />
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
