import React, { useState } from "react"
import styled from "styled-components"
import { colors, widths, breakpoints } from "../../../styles/variables"
import { convertFloatFixed, convertToMM } from "../../../utils/helper-functions"
import { CircleNotch } from "@phosphor-icons/react"
import { ScreenClassRender } from "react-grid-system"

import AlignmentControls from "../templateControls/components/AlignmentControls"
import Button from "../../ui/Button"
import CalligraphyControls from "../templateControls/CalligraphyControls"
import CrossGridControls from "../templateControls/CrossGridControls"
import DotControls from "../templateControls/DotControls"
import GraphControls from "../templateControls/GraphControls"
import HandwritingControls from "../templateControls/HandwritingControls"
import HexagonControls from "../templateControls/HexagonControls"
import Icon from "../../ui/Icon"
import IsometricControls from "../templateControls/IsometricControls"
import MarginControls from "../templateControls/components/MarginControls"
import MusicControls from "../templateControls/MusicControls"
import PageNumberControls from "../templateControls/components/PageNumberControls"
import RuledControls from "../templateControls/RuledControls"
import SeyesControls from "../templateControls/SeyesControls"
import ToggleControls from "../templateControls/components/ToggleControls"
import { Flexbox } from "../../layout/Flexbox"
import { StyledLabel } from "../../form/FormComponents"

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

const TemplatesContent = styled.div`
  overflow-y: auto;
  padding: 1rem;
  max-height: 725px;
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
  border-top: ${colors.borders.black};
`

function ProductControls({
  currentPageSide,
  pageData,
  max,
  dimensions,
  selectedPageSvg,
  setCurrentPageSide,
  setLeftPageData,
  setPageData,
  setRightPageData,
  toast,
}) {
  const [loading, setLoading] = useState(false)
  const { maximumMarginHeight, maximumMarginWidth } = dimensions

  function handleSetTemplate() {
    setLoading(true)

    if (currentPageSide === "left") {
      setLeftPageData({
        template: pageData.template,
        svg: selectedPageSvg.outerHTML,
        pageData: pageData,
      })
    }
    else if (currentPageSide === "both") {
      setRightPageData({
        template: pageData.template,
        svg: selectedPageSvg.outerHTML,
        pageData: pageData,
      })
      setCurrentPageSide("left")

      setTimeout(() => {
        setLeftPageData({
          template: pageData.template,
          svg: selectedPageSvg.outerHTML,
          pageData: pageData,
        })
        setCurrentPageSide("both")
      }, 100)
    }
    else {
      setRightPageData({
        template: pageData.template,
        svg: selectedPageSvg.outerHTML,
        pageData: pageData,
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
          <>
            {pageData.showControls && (
              <StyledTemplatesBar
                className={!pageData.showControls ? "is-collapsed" : null}
              >
                <TemplatesContent>
                  <Flexbox
                    justify="flex-end"
                    margin="0 0 4px 0"
                  >
                    <small>All values shown in mm</small>
                  </Flexbox>
                  <StyledLabel>Apply to {currentPageSide} pages</StyledLabel>
                  <ToggleControls 
                    value={currentPageSide}
                    data={[
                      { name: "left" },
                      { name: "both" },
                      { name: "right" },
                    ]}
                    setData={setCurrentPageSide}
                  />
                  <StyledLabel>Page numbers</StyledLabel>
                  <PageNumberControls />
                  {pageData.template !== "blank" && pageData.template !== "none" && (
                    <>
                      {selectedPageSvg && (
                        <>
                          <MarginControls
                            pageData={pageData}
                            setPageData={setPageData}
                            maximumMarginHeight={maximumMarginHeight}
                            maximumMarginWidth={maximumMarginWidth}
                          />
                          <AlignmentControls
                            pageData={pageData}
                            setPageData={setPageData}
                            selectedPageSvg={selectedPageSvg}
                          />
                        </>
                      )}
                      {pageData.template === "ruled" && (
                        <RuledControls
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "dot" && (
                        <DotControls
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "graph" && (
                        <GraphControls
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "hexagon" && (
                        <HexagonControls
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "isometric" && (
                        <IsometricControls
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "seyes" && (
                        <SeyesControls
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "music" && (
                        <MusicControls
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "handwriting" && (
                        <HandwritingControls
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "cross" && (
                        <CrossGridControls
                          pageData={pageData}
                          setPageData={setPageData}
                          max={max}
                        />
                      )}
                      {pageData.template === "calligraphy" && (
                        <CalligraphyControls
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
              </StyledTemplatesBar>
            )}
          </>
        )
      }}
    />
  )
}
export default ProductControls