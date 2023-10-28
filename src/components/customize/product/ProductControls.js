import React, { useState } from "react"
import styled from "styled-components"
import { colors, widths, breakpoints } from "../../../styles/variables"
import { convertFloatFixed, convertToMM } from "../../../utils/helper-functions"
import { CircleNotch, CaretCircleDown, CaretCircleRight, CaretCircleLeft, CaretCircleUp, XCircle } from "@phosphor-icons/react"
import { ScreenClassRender } from "react-grid-system"

import Icon from "../../ui/Icon"
import Content from "../../ui/Content"
import Button from "../../ui/Button"
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
  border: ${colors.borders.black};
  max-height: 816px;
  width: ${widths.sidebar};
  z-index: 2;
  &.is-collapsed {
    top: 0px;
    border: none;
    width: 0;
    height: 0;
  }
  @media only screen and (max-width: 1388px) {
    position: absolute;
    left: 48px;
    top: 0;
    box-shadow: ${colors.shadow.drawer};
  }
  @media only screen and (max-width: ${breakpoints.md}) {
    position: absolute;
    left: 16px;
    top: 0;
    box-shadow: ${colors.shadow.drawer};
  }
`

const TemplatesButton = styled(Button)`
  position: absolute;
  right: calc(100% - 16px);
  top: -1px;
  height: 57px;
  padding: 4px 8px;
  z-index: 9;
  &.is-active {
    right: calc(100% - 48px);
  }
  @media only screen and (max-width: 1388px) {
    right: 100% !important;
  }
`

const TemplatesContent = styled.div`
  overflow-y: auto;
  padding: 1rem;
  max-height: 677px;
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
  justify-content: space-between;
  padding: 1rem;
  border-bottom: ${colors.borders.black};
  &.is-collapsed {
    border-bottom: none;
  }
`

const TemplatesFooter = styled.div`
  padding: 1rem;
  border-top: ${colors.borders.black};
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
  color: ${colors.gray.nineHundred};
  font-size: 0.875rem;
  padding: 0.25rem;
  flex: 1;
  position: relative;
  &:not(:last-child) {
    margin-right: 2px;
  }
  &:hover,
  &:focus {
    box-shadow: none;
    background-color: ${colors.gray.twoHundred};
  }
  &.is-active {
    color: ${colors.gray.oneHundred};
    background-color: ${colors.gray.nineHundred};
  }
`

function ProductControls({
  currentPageSide,
  pageData,
  max,
  selectedPageSvg,
  setCurrentPageSide,
  setLeftPageData,
  setPageData,
  setRightPageData,
  svgSize,
  toast,
}) {
  const [loading, setLoading] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const maximumMarginHeight = convertFloatFixed(convertToMM(pageData.pageHeight) - pageData.strokeWidth, 3)
  const maximumMarginWidth = convertFloatFixed(convertToMM(pageData.pageWidth), 3)

  function handleSetTemplate() {
    setLoading(true)

    if (currentPageSide === "left") {
      setLeftPageData({
        template: pageData.template,
        svg: selectedPageSvg.outerHTML,
      })
    }
    else if (currentPageSide === "both") {
      setRightPageData({
        template: pageData.template,
        svg: selectedPageSvg.outerHTML,
      })
      setCurrentPageSide("left")

      setTimeout(() => {
        setLeftPageData({
          template: pageData.template,
          svg: selectedPageSvg.outerHTML,
        })
        setCurrentPageSide("both")
      }, 100)
    }
    else {
      setRightPageData({
        template: pageData.template,
        svg: selectedPageSvg.outerHTML,
      })
    }

    setLoading(false)
    toast.success(`Applied template to ${currentPageSide} pages!`)
  }

  return (
    <ScreenClassRender
      render={screenClass => {
        const isMobile = ["xs", "sm", "md", "lg"].includes(screenClass)

        return (
          <StyledTemplatesBar
            className={!showControls ? "is-collapsed" : null}
          >
            <TemplatesButton
              borderradius="4px 0 0 4px"
              onClick={() => setShowControls(!showControls)}
              className={!showControls && !isMobile ? "is-active" : null}
            >
              {showControls ? (
                <Icon>
                  <CaretCircleLeft size={16} weight="bold" />
                </Icon>
              ) : (
                <Icon>
                  <CaretCircleRight size={16} weight="bold" />
                </Icon>
              )}
            </TemplatesButton>
            {showControls && (
              <>
                <TemplatesHeader
                  className={!showControls ? "is-collapsed" : null}
                >
                  <span>
                    Template controls
                  </span>
                </TemplatesHeader>
                <TemplatesContent>
                  <Content
                    h5fontsize="0.875rem"
                    h5margin="0 0 8px 0"
                    h5fontweight="700"
                    margin="0 0 1rem 0"
                  >
                    <h5>Page side</h5>
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
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "dot" && (
                        <DotControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "graph" && (
                        <GraphControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "hexagon" && (
                        <HexagonControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "isometric" && (
                        <IsometricControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "seyes" && (
                        <SeyesControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "music" && (
                        <MusicControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "handwriting" && (
                        <HandwritingControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "cross" && (
                        <CrossGridControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "calligraphy" && (
                        <CalligraphyControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
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
              </>
            )}
          </StyledTemplatesBar>
        )
      }}
    />
  )
}
export default ProductControls