import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { ArrowRight, CircleNotch, CheckCircle } from "phosphor-react"
import { colors, convertToMM, fonts } from "../../../styles/variables"
import { svgToObjects } from "../../../utils/helper-functions"

import { Flexbox } from "../../layout/Flexbox"
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

const TemplatesFooter = styled.div`
  padding: 1rem;
  border-radius: 0 0 0.25rem 0.25rem;
  border-top: 1px solid ${colors.gray.threeHundred};
`

const FloatingTemplatesbar = styled.div`
  background-color: ${colors.white};
  border-radius: 0.25rem;
  border: 1px solid ${colors.gray.threeHundred};
  height: 688px;
  margin-right: 2rem;
  width: 300px;
  z-index: 10;
`

const PageButtonWrapper = styled.div`
  display: flex;
  border: 1px solid ${colors.gray.threeHundred};
  background-color: ${colors.white};
  padding: 0.25rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
`

const PageButton = styled(Button)`
  flex: 1;
  &:not(:last-child) {
    margin-right: 2px;
  }
  &:hover,
  &:focus {
    background-color: ${colors.primary.hover};
  }
  &.is-active {
    background-color: ${colors.primary.sixHundred};
    color: ${colors.primary.white};
  }
`

function Templatesbar({
  canvasPageSize,
  currentPageSide,
  pageData,
  pageContentSize,
  setCurrentPageSide,
  setLeftPageData,
  setPageData,
  setRightPageData,
  setShowModal,
  toast,
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const maximumMarginHeight = convertToMM(pageData.pageHeight)
  const maximumMarginWidth = convertToMM(pageData.pageWidth)

  useEffect(() => {

  }, [pageContentSize])

  function handleSetTemplate() {
    setLoading(true)

    if (currentPageSide === "left") {
      setLeftPageData(pageData)
    }
    else {
      setRightPageData(pageData)
    }

    setLoading(false)
    toast.success(`Applied template to ${currentPageSide} pages!`)
  }

  function handleApplyTemplateButton() {
    // don't show the modal if no template is selected
    if (!pageData.template) {
      toast.error("Click and select a template first!")
    }
    else {
      setShowModal({
        show: true,
        type: "template"
      })
    }
  }

  if (pageData.show) {
    return (
      <FloatingTemplatesbar>
        <TextLink
          borderbottom={`1px solid ${colors.gray.threeHundred}`}
          color={colors.primary.threeHundred}
          flex="flex"
          hovercolor={colors.primary.sixHundred}
          justifycontent="flex-end"
          padding="1rem"
          onClick={() => setPageData({
            ...pageData,
            show: false,
          })}
        >
          Back to images
          <Icon margin="0 0 0 0.25rem">
            <ArrowRight size="0.825rem" />
          </Icon>
        </TextLink>
        <Flexbox
          backgroundcolor={colors.white}
          flex="flex"
          flexdirection="column"
          justifycontent="space-between"
          borderradius="0.25rem"
          height="calc(100% - 49px)"
          margin="0 0 0 auto"
        >
          <TemplatesContent>
            <Content
              headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
              h3fontsize="0.75rem"
              h3margin="0 0 0.5rem 0"
              margin="0 0 1rem 0"
            >
              <h3>Page side</h3>
              <PageButtonWrapper>
                <PageButton
                  backgroundcolor={colors.white}
                  borderradius="0.25rem"
                  boxshadow="none"
                  padding="0.25rem 0.5rem"
                  onClick={() => setCurrentPageSide("left")}
                  className={currentPageSide === "left" ? "is-active" : null}
                >
                  Left
                </PageButton>
                <PageButton
                  backgroundcolor={colors.white}
                  borderradius="0.25rem"
                  boxshadow="none"
                  padding="0.25rem 0.5rem"
                  onClick={() => setCurrentPageSide("right")}
                  className={currentPageSide === "right" ? "is-active" : null}
                >
                  Right
                </PageButton>
              </PageButtonWrapper>
            </Content>
            {pageData.template !== "blank" && pageData.template !== "none" && (
              <>
                {pageData.template === "ruled" && (
                  <RuledControls
                    canvasPageSize={canvasPageSize}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    pageData={pageData}
                    setPageData={setPageData}
                    pageContentSize={pageContentSize}
                  />
                )}
                {pageData.template === "dot" && (
                  <DotControls
                    pageData={pageData}
                    setPageData={setPageData}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    pageContentSize={pageContentSize}
                  />
                )}
                {pageData.template === "graph" && (
                  <GraphControls
                    pageData={pageData}
                    setPageData={setPageData}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    pageContentSize={pageContentSize}
                  />
                )}
              </>
            )}
          </TemplatesContent>
          <TemplatesFooter>
            <Button
              backgroundcolor={colors.primary.sixHundred}
              className={loading ? "is-loading" : null}
              borderradius="0.25rem"
              color={colors.primary.white}
              padding="1rem"
              width="100%"
              disabled={pageData.template === "none" ? true : false}
              onClick={() => handleSetTemplate()}
            >
              {loading ? (
                <Icon>
                  <CircleNotch size="1rem" />
                </Icon>
              ) : (
                <>
                  {success ? (
                    <>
                      <Icon margin="0 0.5rem 0 0">
                        <CheckCircle size="1rem" weight="bold" />
                      </Icon>
                      <span>Success!</span>
                    </>
                  ) : (
                    <span>Apply template</span>
                  )}
                </>
              )}
            </Button>
          </TemplatesFooter>
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
              isProductPage={false}
              setData={setPageData}
              data={pageData}
              showLabels={true}
            />
          </Flexbox>
          {pageData.template !== "blank" && pageData.template !== "none" && (
            <>
              {pageData.template === "ruled" && (
                <RuledControls
                  canvasPageSize={canvasPageSize}
                  maximumMarginHeight={maximumMarginHeight}
                  maximumMarginWidth={maximumMarginWidth}
                  pageData={pageData}
                  setPageData={setPageData}
                  pageContentSize={pageContentSize}
                />
              )}
              {pageData.template === "dot" && (
                <DotControls
                  pageData={pageData}
                  setPageData={setPageData}
                  maximumMarginHeight={maximumMarginHeight}
                  maximumMarginWidth={maximumMarginWidth}
                  pageContentSize={pageContentSize}
                />
              )}
              {pageData.template === "graph" && (
                <GraphControls
                  pageData={pageData}
                  setPageData={setPageData}
                  maximumMarginHeight={maximumMarginHeight}
                  maximumMarginWidth={maximumMarginWidth}
                  pageContentSize={pageContentSize}
                />
              )}
            </>
          )}
        </TemplatesContent>
        <TemplatesFooter>
          <Button
            backgroundcolor={colors.primary.sixHundred}
            className={loading ? "is-loading" : null}
            borderradius="0.25rem"
            color={colors.primary.white}
            padding="1rem"
            width="100%"
            disabled={!pageData.template}
            onClick={() => handleApplyTemplateButton()}
          >
            Apply template
          </Button>
        </TemplatesFooter>
      </Flexbox>
    )
  }
}

export default Templatesbar
