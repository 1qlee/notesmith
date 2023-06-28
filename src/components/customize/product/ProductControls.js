import React, { useState } from "react"
import styled from "styled-components"
import { colors, widths, fonts, convertFloatFixed, convertToPx, convertToMM, breakpoints, pageMargins } from "../../../styles/variables"
import { CircleNotch, ArrowSquareUp, ArrowSquareDown } from "phosphor-react"
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
  max-height: 812px;
  width: ${widths.sidebar};
  z-index: 2;
  &.is-collapsed {
    transform: translateY(calc(-100% - 4px));
    transition: transform 0.2s;
    top: 62px;
  }
  @media only screen and (max-width: ${breakpoints.md}) {
    position: absolute;
    left: 32px;
    top: 0;
    box-shadow: ${colors.shadow.drawer};
  }
`
const TemplatesContent = styled.div`
  overflow-y: auto;
  padding: 1rem;
  height: 600px;
  min-height: 600px;
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
  padding: 1rem;
  border-bottom: ${colors.borders.black};
  font-size: 0.875rem;
  &.is-collapsed {
    border-bottom: none;
  }
  &:hover {
    cursor: pointer;
    background-color: ${colors.gray.twoHundred};
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
  showControls,
  selectedPageSvg,
  setCurrentPageSide,
  setLeftPageData,
  setPageData,
  setRightPageData,
  setShowControls,
  svgSize,
  toast,
}) {
  const [loading, setLoading] = useState(false)
  const { marginTop, marginLeft } = pageData
  const margin = {
    top: convertToPx(marginTop),
    left: convertToPx(marginLeft),
  }
  const minimumMargin = pageMargins.minimum
  const maximumMarginHeight = convertFloatFixed(convertToMM(pageData.pageHeight) - pageData.thickness, 3)
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
        const isMobile = ["xs", "sm", "md"].includes(screenClass)
        const showCollapsed = !showControls && isMobile

        return (
          <StyledTemplatesBar
            className={showCollapsed ? "is-collapsed" : null}
          >
            {isMobile && (
              <TemplatesHeader
                onClick={() => setShowControls(!showControls)}
                className={!showControls ? "is-collapsed" : null}
              >
                {showControls ? (
                  <Icon margin="0 4px 0 0">
                    <ArrowSquareUp size={20} />
                  </Icon>
                ) : (
                  <Icon margin="0 4px 0 0">
                    <ArrowSquareDown size={20} />
                  </Icon>
                )}
                <span>
                  {showControls ? "Hide" : "Show"} controls
                </span>
              </TemplatesHeader>
            )}
            {!showCollapsed && (
              <>
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
                        />
                      )}
                      {pageData.template === "dot" && (
                        <DotControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                        />
                      )}
                      {pageData.template === "graph" && (
                        <GraphControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                        />
                      )}
                      {pageData.template === "hexagon" && (
                        <HexagonControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                        />
                      )}
                      {pageData.template === "isometric" && (
                        <IsometricControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                        />
                      )}
                      {pageData.template === "seyes" && (
                        <SeyesControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                        />
                      )}
                      {pageData.template === "music" && (
                        <MusicControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                        />
                      )}
                      {pageData.template === "handwriting" && (
                        <HandwritingControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                        />
                      )}
                      {pageData.template === "cross" && (
                        <CrossGridControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
                          pageData={pageData}
                          setPageData={setPageData}
                        />
                      )}
                      {pageData.template === "calligraphy" && (
                        <CalligraphyControls
                          svgSize={svgSize}
                          maximumMarginHeight={maximumMarginHeight}
                          maximumMarginWidth={maximumMarginWidth}
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
              </>
            )}
          </StyledTemplatesBar>
        )
      }}
    />
  )
}
export default ProductControls