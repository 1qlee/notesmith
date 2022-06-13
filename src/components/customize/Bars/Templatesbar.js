import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { ArrowRight, CircleNotch, CheckCircle } from "phosphor-react"
import { colors, convertToMM, fonts, convertFloatFixed } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"
import PageIcons from "../PageIcons"
import Content from "../../Content"
import Button from "../../Button"
import Icon from "../../Icon"
import TextLink from "../../TextLink"
import DotControls from "../templateControls/DotControls"
import RuledControls from "../templateControls/RuledControls"
import GraphControls from "../templateControls/GraphControls"
import HexagonControls from "../templateControls/HexagonControls"
import IsometricControls from "../templateControls/IsometricControls"
import SeyesControls from "../templateControls/SeyesControls"
import MusicControls from "../templateControls/MusicControls"
import HandwritingControls from "../templateControls/HandwritingControls"

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
  border-top: 1px solid ${colors.gray.nineHundred};
`

const FloatingTemplatesbar = styled.div`
  background-color: ${colors.white};
  border: 1px solid ${colors.gray.nineHundred};
  height: 688px;
  margin-right: 2rem;
  width: 300px;
  z-index: 10;
`

const PageButtonWrapper = styled.div`
  display: flex;
  border: 1px solid ${colors.gray.nineHundred};
  background-color: ${colors.white};
  padding: 0.25rem;
  margin-bottom: 1rem;
`

const PageButton = styled(Button)`
  background-color: ${colors.white};
  border-radius: 0.5rem 0.25rem 0.75rem 1rem / 1rem 0.25rem 0.75rem 0.5rem;
  flex: 1;
  position: relative;
  &:not(:last-child) {
    margin-right: 2px;
  }
  &:not(:last-child) {
    margin-right: 2px;
  }
  span {
    color: ${colors.gray.nineHundred};
    position: relative;
    transition: color 0.2s;
    z-index: 99;
  }
  &:not(:last-child) {
    margin-right: 2px;
  }
  &:hover,
  &:focus {
    box-shadow: none;
    background-color: ${colors.gray.twoHundred};
    &:not(.is-active) {
      box-shadow: 0 0 -1px ${colors.gray.threeHundred};
    }
  }
  &.is-active {
    &::before {
      transform: translateX(5px);
      width: 100%;
      opacity: 1;
    }
    span {
      color: ${colors.gray.oneHundred};
    }
  }
  &::before {
    background-color: ${colors.gray.nineHundred};
    border-radius: 0.5rem 0.25rem 0.75rem 1rem / 1rem 0.25rem 0.75rem 0.5rem;
    opacity: 0;
    content: "";
    height: 100%;
    left: -5px;
    position: absolute;
    top: 0;
    transition: transform 0.2s, width 0.2s ease-in, background-color 0.2s;
    width: 0;
    will-change: width, transform;
  }
`

function Templatesbar({
  borderData,
  canvasPageSize,
  currentPageSide,
  dashedLineData,
  pageContentSize,
  pageData,
  setBorderData,
  setCurrentPageSide,
  setDashedLineData,
  setLeftPageData,
  setPageData,
  setRightPageData,
  setShowModal,
  toast,
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const maximumMarginHeight = convertFloatFixed(convertToMM(pageData.pageHeight) - pageData.thickness, 3)
  const maximumMarginWidth = convertFloatFixed(convertToMM(pageData.pageWidth), 3)

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
        <Flexbox
          flex="flex"
          justifycontent="flex-end"
          className="has-border-bottom"
          padding="1rem"
        >
          <TextLink
            color={colors.gray.nineHundred}
            onClick={() => setPageData({
              ...pageData,
              show: false,
              template: "",
            })}
          >
            Back to images
            <Icon margin="0 0 0 0.25rem">
              <ArrowRight size="0.825rem" />
            </Icon>
          </TextLink>
        </Flexbox>
        <Flexbox
          backgroundcolor={colors.white}
          flex="flex"
          flexdirection="column"
          justifycontent="space-between"
          borderradius="0"
          height="calc(100% - 49px)"
          margin="0 0 0 auto"
        >
          <TemplatesContent>
            <Content
              headingfontfamily={fonts.secondary}
              h3fontsize="0.75rem"
              h3margin="0 0 0.5rem 0"
              margin="0 0 1rem 0"
            >
              <h3>Page side</h3>
              <PageButtonWrapper>
                <PageButton
                  padding="0.25rem 0.5rem"
                  fontsize="0.75rem"
                  onClick={() => setCurrentPageSide("left")}
                  className={currentPageSide === "left" ? "is-active" : null}
                >
                  <span>Left</span>
                </PageButton>
                <PageButton
                  padding="0.25rem 0.5rem"
                  fontsize="0.75rem"
                  onClick={() => setCurrentPageSide("right")}
                  className={currentPageSide === "right" ? "is-active" : null}
                >
                  <span>Right</span>
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
                    pageContentSize={pageContentSize}
                    pageData={pageData}
                    setPageData={setPageData}
                  />
                )}
                {pageData.template === "dot" && (
                  <DotControls
                    canvasPageSize={canvasPageSize}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    pageContentSize={pageContentSize}
                    pageData={pageData}
                    setPageData={setPageData}
                  />
                )}
                {pageData.template === "graph" && (
                  <GraphControls
                    borderData={borderData}
                    canvasPageSize={canvasPageSize}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    pageContentSize={pageContentSize}
                    pageData={pageData}
                    setBorderData={setBorderData}
                    setPageData={setPageData}
                  />
                )}
                {pageData.template === "hexagon" && (
                  <HexagonControls
                    canvasPageSize={canvasPageSize}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    pageContentSize={pageContentSize}
                    pageData={pageData}
                    setPageData={setPageData}
                  />
                )}
                {pageData.template === "isometric" && (
                  <IsometricControls
                    borderData={borderData}
                    canvasPageSize={canvasPageSize}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    pageContentSize={pageContentSize}
                    pageData={pageData}
                    setBorderData={setBorderData}
                    setPageData={setPageData}
                  />
                )}
                {pageData.template === "seyes" && (
                  <SeyesControls
                    borderData={borderData}
                    canvasPageSize={canvasPageSize}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    pageContentSize={pageContentSize}
                    pageData={pageData}
                    setBorderData={setBorderData}
                    setPageData={setPageData}
                  />
                )}
                {pageData.template === "music" && (
                  <MusicControls
                    borderData={borderData}
                    canvasPageSize={canvasPageSize}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    pageContentSize={pageContentSize}
                    pageData={pageData}
                    setBorderData={setBorderData}
                    setPageData={setPageData}
                  />
                )}
                {pageData.template === "handwriting" && (
                  <HandwritingControls
                    canvasPageSize={canvasPageSize}
                    dashedLineData={dashedLineData}
                    maximumMarginHeight={maximumMarginHeight}
                    maximumMarginWidth={maximumMarginWidth}
                    pageContentSize={pageContentSize}
                    pageData={pageData}
                    setDashedLineData={setDashedLineData}
                    setPageData={setPageData}
                  />
                )}
              </>
            )}
          </TemplatesContent>
          <TemplatesFooter>
            <Button
              backgroundcolor={colors.gray.nineHundred}
              className={loading ? "is-loading" : null}
              borderradius="0"
              color={colors.gray.oneHundred}
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
            backgroundcolor={colors.gray.nineHundred}
            className={loading ? "is-loading" : null}
            borderradius="0"
            color={colors.gray.oneHundred}
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
