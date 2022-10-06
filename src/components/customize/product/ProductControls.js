import React, { useState } from "react"
import styled from "styled-components"
import { colors, widths, fonts, convertFloatFixed, convertToMM } from "../../../styles/variables"
import { CircleNotch, ArrowRight } from "phosphor-react"
import { GatsbyImage } from "gatsby-plugin-image"

import Icon from "../../Icon"
import Content from "../../Content"
import Button from "../../Button"
import DotControls from "../templateControls/DotControls"
import RuledControls from "../templateControls/RuledControls"
import GraphControls from "../templateControls/GraphControls"
import HexagonControls from "../templateControls/HexagonControls"
import IsometricControls from "../templateControls/IsometricControls"
import SeyesControls from "../templateControls/SeyesControls"
import MusicControls from "../templateControls/MusicControls"
import HandwritingControls from "../templateControls/HandwritingControls"
import CrossGridControls from "../templateControls/CrossGridControls"
import CalligraphyControls from "../templateControls/CalligraphyControls"

const StyledTemplatesBar = styled.div`
  background-color: ${colors.white};
  border: 2px solid ${colors.gray.nineHundred};
  border-radius: 0.5rem;
  box-shadow: ${colors.shadow.solid};
  max-height: 812px;
  margin-right: 2rem;
  width: ${widths.sidebar};
  z-index: 10;
`
const TemplatesContent = styled.div`
  overflow-y: auto;
  padding: 1rem;
  max-height: 600px;
  &::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.threeHundred};
  }
`
const TemplatesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-bottom: 1px solid ${colors.gray.threeHundred};
  border-radius: 0.5rem 0.5rem 0 0;
  font-family: ${fonts.secondary};
  font-size: 0.875rem;
  &:hover {
    cursor: pointer;
    background-color: ${colors.gray.threeHundred};
  }
`

const TemplatesFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${colors.gray.threeHundred};
  border-radius: 0 0 0.5rem 0.5rem;
`

const PageButtonWrapper = styled.div`
  display: flex;
  border: 1px solid ${colors.gray.nineHundred};
  background-color: ${colors.white};
  border-radius: 0.25rem;
  padding: 0.25rem;
  margin-bottom: 1rem;
`

const PageButton = styled(Button)`
  background-color: ${colors.white};
  font-size: 0.75rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  flex: 1;
  position: relative;
  &:not(:last-child) {
    margin-right: 2px;
  }
  &:hover,
  &:focus {
    box-shadow: none;
    background-color: ${colors.gray.threeHundred};
  }
  &.is-active {
    color: ${colors.gray.oneHundred};
    background-color: ${colors.gray.nineHundred};
  }
`

function ProductControls({
  canvasPageSize,
  currentPageSide,
  pageContentSize,
  pageData,
  setCurrentPageSide,
  setLeftPageData,
  setPageData,
  setRightPageData,
  toast,
}) {
  const [loading, setLoading] = useState(false)
  const maximumMarginHeight = convertFloatFixed(convertToMM(pageData.pageHeight) - pageData.thickness, 3)
  const maximumMarginWidth = convertFloatFixed(convertToMM(pageData.pageWidth), 3)

  function handleSetTemplate() {
    setLoading(true)

    if (currentPageSide === "left") {
      setLeftPageData(pageData)
    }
    else if (currentPageSide === "both") {
      setLeftPageData(pageData)
      setRightPageData(pageData)
    }
    else {
      setRightPageData(pageData)
    }

    setLoading(false)
    toast.success(`Applied template to ${currentPageSide} pages!`)
  }

  return (
    <StyledTemplatesBar>
      <TemplatesHeader
        onClick={() => setPageData({
          ...pageData,
          show: false,
          template: "",
        })}
      >
        <span>Back to images</span>
        <Icon margin="0 0 0 0.125rem">
          <ArrowRight size="1rem" />
        </Icon>
      </TemplatesHeader>
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
              onClick={() => setCurrentPageSide("left")}
              className={currentPageSide === "left" ? "is-active" : null}
            >
              <span>Left</span>
            </PageButton>
            <PageButton
              onClick={() => setCurrentPageSide("both")}
              className={currentPageSide === "both" ? "is-active" : null}
            >
              <span>Both</span>
            </PageButton>
            <PageButton
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
                canvasPageSize={canvasPageSize}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                pageContentSize={pageContentSize}
                pageData={pageData}
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
                canvasPageSize={canvasPageSize}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                pageContentSize={pageContentSize}
                pageData={pageData}
                setPageData={setPageData}
              />
            )}
            {pageData.template === "seyes" && (
              <SeyesControls
                canvasPageSize={canvasPageSize}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                pageContentSize={pageContentSize}
                pageData={pageData}
                setPageData={setPageData}
              />
            )}
            {pageData.template === "music" && (
              <MusicControls
                canvasPageSize={canvasPageSize}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                pageContentSize={pageContentSize}
                pageData={pageData}
                setPageData={setPageData}
              />
            )}
            {pageData.template === "handwriting" && (
              <HandwritingControls
                canvasPageSize={canvasPageSize}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                pageContentSize={pageContentSize}
                pageData={pageData}
                setPageData={setPageData}
              />
            )}
            {pageData.template === "cross" && (
              <CrossGridControls
                canvasPageSize={canvasPageSize}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                pageContentSize={pageContentSize}
                pageData={pageData}
                setPageData={setPageData}
              />
            )}
            {pageData.template === "calligraphy" && (
              <CalligraphyControls
                canvasPageSize={canvasPageSize}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                pageContentSize={pageContentSize}
                pageData={pageData}
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
            <span>Apply template</span>
          )}
        </Button>
      </TemplatesFooter>
    </StyledTemplatesBar>
  )
}
export default ProductControls