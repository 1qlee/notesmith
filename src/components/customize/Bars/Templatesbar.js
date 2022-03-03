import React, { useState } from "react"
import styled from "styled-components"
import { colors, convertToMM } from "../../../styles/variables"
import { CaretDown, ArrowRight } from "phosphor-react"

import { Flexbox } from "../../layout/Flexbox"
import { StyledLabel, StyledFieldset, SelectWrapper, StyledSelect, SelectIcon } from "../../form/FormComponents"
import PageIcons from "../PageIcons"
import Content from "../../Content"
import Button from "../../Button"
import Icon from "../../Icon"
import TextLink from "../../TextLink"
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

const FloatingTemplatesbar = styled.div`
  background-color: ${colors.white};
  margin-right: 2rem;
  width: 300px;
  height: 100%;
  z-index: 10;
  border-radius: 0 0.25rem 0.25rem 0;
  box-shadow: 8px 0 16px ${colors.shadow.float};
`

function Templatesbar({
  pageData,
  selectedPageSvg,
  setPageData,
  setShowModal,
}) {
  const [loading, setLoading] = useState(false)
  const lineWidthMM = convertToMM(pageData.pageWidth)
  const maximumMarginHeight = convertToMM(pageData.pageHeight)
  const maximumMarginWidth = convertToMM(pageData.pageWidth)
  const templateHeight = selectedPageSvg ? selectedPageSvg.getBoundingClientRect().height : null
  const templateWidth = selectedPageSvg ? selectedPageSvg.getBoundingClientRect().width : null

  if (pageData.show) {
    return (
      <FloatingTemplatesbar>
        <TextLink
          color={colors.gray.sixHundred}
          hovercolor={colors.gray.nineHundred}
          flex="flex"
          justifycontent="flex-end"
          borderbottom={`1px solid ${colors.gray.threeHundred}`}
          padding="1rem"
          onClick={() => setPageData({
            ...pageData,
            show: false,
          })}
        >
          <p>Back to product</p>
          <Icon margin="0 0 0 0.25rem">
            <ArrowRight size="1rem" />
          </Icon>
        </TextLink>
        <Flexbox
          backgroundcolor={colors.white}
          flex="flex"
          flexdirection="column"
          justifycontent="space-between"
          borderradius="0.25rem"
          margin="0 0 0 auto"
        >
          <TemplatesContent>
            <Content
              headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
              h3fontsize="0.75rem"
              margin="0"
            >
              <h3>Page layout</h3>
            </Content>
            <Flexbox
              flex="flex"
              flexwrap="wrap"
              alignitems="center"
              margin="0 0 2rem 0"
            >
              <PageIcons
                checkActiveVar={pageData.template}
                data={pageData}
                iconMargin="0 0.5rem"
                setData={setPageData}
                showLabels={false}
              />
            </Flexbox>
            {pageData.template !== "blank" && pageData.template !== "none" && (
              <>
                {pageData.template === "ruled" && (
                  <RuledControls
                    pageData={pageData}
                    setPageData={setPageData}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    templateHeight={templateHeight}
                    templateWidth={templateWidth}
                  />
                )}
                {pageData.template === "dot" && (
                  <DotControls
                    pageData={pageData}
                    setPageData={setPageData}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    templateHeight={templateHeight}
                    templateWidth={templateWidth}
                  />
                )}
                {pageData.template === "graph" && (
                  <GraphControls
                    pageData={pageData}
                    setPageData={setPageData}
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
            borderradius="0 0 0.25rem 0"
          >
            <Button
              backgroundcolor={colors.primary.sixHundred}
              className={loading ? "is-loading" : null}
              borderradius="0.25rem"
              color={colors.primary.white}
              padding="1rem"
              width="100%"
              disabled={pageData.template === "none" ? true : false}
            >
              Apply template
            </Button>
          </Flexbox>
        </Flexbox>
      </FloatingTemplatesbar>
    )
  }
  else {
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
                  pageData={pageData}
                  setPageData={setPageData}
                  maximumMarginHeight={maximumMarginHeight}
                  maximumMarginWidth={maximumMarginWidth}
                  templateHeight={templateHeight}
                  templateWidth={templateWidth}
                />
              )}
              {pageData.template === "dot" && (
                <DotControls
                  pageData={pageData}
                  setPageData={setPageData}
                  maximumMarginHeight={maximumMarginHeight}
                  maximumMarginWidth={maximumMarginWidth}
                  templateHeight={templateHeight}
                  templateWidth={templateWidth}
                />
              )}
              {pageData.template === "graph" && (
                <GraphControls
                  pageData={pageData}
                  setPageData={setPageData}
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
}

export default Templatesbar
