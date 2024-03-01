import React, { useState } from "react"
import styled, { keyframes } from "styled-components"
import { colors, widths, breakpoints } from "../../styles/variables"
import { CircleNotch, X } from "@phosphor-icons/react"
import { ScreenClassRender } from "react-grid-system"

import AlignmentControls from "../customize/templateControls/components/AlignmentControls"
import Button from "../ui/Button"
import CalligraphyControls from "../customize/templateControls/CalligraphyControls"
import CrossGridControls from "../customize/templateControls/CrossGridControls"
import DotControls from "../customize/templateControls/DotControls"
import GraphControls from "../customize/templateControls/GraphControls"
import HandwritingControls from "../customize/templateControls/HandwritingControls"
import HexagonControls from "../customize/templateControls/HexagonControls"
import Icon from "../ui/Icon"
import IsometricControls from "../customize/templateControls/IsometricControls"
import MarginControls from "../customize/templateControls/components/MarginControls"
import MusicControls from "../customize/templateControls/MusicControls"
import RuledControls from "../customize/templateControls/RuledControls"
import SeyesControls from "../customize/templateControls/SeyesControls"
import ToggleControls from "../customize/templateControls/components/ToggleControls"
import { Flexbox } from "../layout/Flexbox"
import { StyledLabel } from "../form/FormComponents"

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`

const StyledTemplatesBar = styled.div`
  animation: ${slideIn} 0.3s ease;
  background-color: ${colors.white};
  border: ${colors.borders.black};
  max-height: 816px;
  position: relative;
  width: ${widths.sidebar};
  z-index: 25;
  &.is-collapsed {
    top: 0px;
    border: none;
    width: 0;
    height: 0;
  }
  @media only screen and (max-width: 1388px) {
    box-shadow: ${colors.shadow.drawer};
    position: fixed;
    left: -1px;
    top: 107px;
    box-shadow: ${colors.shadow.drawer};
    height: calc(100vh - 106px);
    z-index: 55;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`

const TemplatesContent = styled.div`
  background-color: ${colors.white};
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  max-height: 725px;
  @media only screen and (max-width: ${breakpoints.sm}) {
    max-height: 600px;
  }
  @media only screen and (max-width: ${breakpoints.xs}) {
    max-height: calc(100% - 71px);
  }
  &::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.threeHundred};
  }
`

const TemplatesCloseButton = styled(Button)`
  position: absolute;
  background-color: ${colors.white};
  border: ${colors.borders.black};
  color: ${colors.gray.nineHundred};
  right: -12px;
  top: -12px;
  padding: 4px;
  border-radius: 100%;
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
                <TemplatesCloseButton
                  onClick={() => setPageData({
                    ...pageData,
                    showControls: false,
                  })}
                >
                  <Icon>
                    <X />
                  </Icon>
                </TemplatesCloseButton>
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
                            dimensions={dimensions}
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
                      <span>Apply changes</span>
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