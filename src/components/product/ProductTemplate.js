import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import { pageMargins, colors } from "../../styles/variables"
import { convertToPx, convertFloatFixed, convertToMM } from "../../utils/helper-functions"
import { ScreenClassRender } from "react-grid-system"
import { X } from "@phosphor-icons/react"

import Holes from "../customize/pageComponents/Holes"
import Ruled from "../customize/templates/Ruled"
import Dot from "../customize/templates/Dot"
import Graph from "../customize/templates/Graph"
import Hexagon from "../customize/templates/Hexagon"
import Isometric from "../customize/templates/Isometric"
import Seyes from "../customize/templates/Seyes"
import Music from "../customize/templates/Music"
import Handwriting from "../customize/templates/Handwriting"
import CrossGrid from "../customize/templates/CrossGrid"
import Calligraphy from "../customize/templates/Calligraphy"
import Button from "../ui/Button"
import Box from "../ui/Box"
import Icon from "../ui/Icon"

const TemplatesHideButton = styled(Button)`
  position: absolute;
  background-color: ${colors.white};
  border: ${colors.borders.black};
  color: ${colors.gray.nineHundred};
  right: -12px;
  top: -12px;
  padding: 4px;
  border-radius: 100%;
`

function ProductTemplate({
  bookData,
  currentPageSide,
  pageData,
  svgLoaded,
  setPageData,
  setLeftPageData,
  setRightPageData,
  setSelectedPageSvg,
  setMax,
  setSvgLoaded,
  setDimensions,
}) {
  const minimumMargin = pageMargins.minimum
  const holesMargin = pageMargins.holes
  const templateMargins = {
    top: convertToPx(pageData.marginTop),
    right: convertToPx(pageData.marginRight),
    bottom: convertToPx(pageData.marginBottom),
    left: convertToPx(pageData.marginLeft),
  }
  const templateData = {
    position: {
      x: currentPageSide === "left" ? minimumMargin + templateMargins.left : convertFloatFixed(holesMargin + templateMargins.left, 3),
      y: convertFloatFixed(minimumMargin + templateMargins.top, 3),
    },
    size: {
      height: convertFloatFixed(pageData.maxContentHeight - (templateMargins.top + templateMargins.bottom), 3),
      width: convertFloatFixed(pageData.maxContentWidth - (templateMargins.left + templateMargins.right), 3),
    }
  }
  const templateRef = useRef(null)

  useEffect(() => {
    if (templateRef && templateRef.current) {
      const template = templateRef.current
      const pageBbox = template.getBBox()

      setSelectedPageSvg(template)
      setDimensions({
        svgHeight: pageBbox.height,
        svgWidth: pageBbox.width,
        maximumMarginHeight: convertFloatFixed(convertToMM(templateData.size.height) - pageData.strokeWidth, 3),
        maximumMarginWidth: convertToMM(templateData.size.width),
        x: templateData.position.x,
        y: templateData.position.y,
      })

      // apply page changes to left or right page
      if (currentPageSide === "left") {
        setLeftPageData({
          template: pageData.template,
          svg: template.outerHTML,
          pageData: pageData,
        })
      }
      else if (currentPageSide === "both") {
        setRightPageData({
          template: pageData.template,
          svg: template.outerHTML,
          pageData: pageData,
        })
        setLeftPageData({
          template: pageData.template,
          svg: template.outerHTML,
          pageData: pageData,
        })
      }
      else {
        setRightPageData({
          template: pageData.template,
          svg: template.outerHTML,
          pageData: pageData,
        })
      }
    }
  }, [pageData.template, svgLoaded])

  return (
    <ScreenClassRender
      render={screenClass => {
        const isMobile = ["xs", "sm"].includes(screenClass)
        return (
          <Box
            position="relative"
          >
            <TemplatesHideButton
              onClick={() => setPageData({
                ...pageData,
                show: !pageData.show,
              })}
            >
              <Icon>
                <X />
              </Icon>
            </TemplatesHideButton>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox={`0 0 ${bookData.widthPixel} ${bookData.heightPixel}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={bookData.widthPixel}
                height={bookData.heightPixel}
                x="0"
                y="0"
              >
                <rect
                  width={bookData.widthPixel}
                  height={bookData.heightPixel}
                  fill={colors.white}
                  stroke={colors.gray.threeHundred}
                  strokeWidth="2px"
                ></rect>
                <Holes
                  currentPageSide={currentPageSide}
                  pageHeight={bookData.heightPixel}
                  pageWidth={bookData.widthPixel}
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                ref={templateRef}
                id={currentPageSide === "left" ? "left-page" : "right-page"}
                x={templateData.position.x}
                y={templateData.position.y}
                width={templateData.size.width}
                height={templateData.size.height}
                viewBox={`0 0 ${templateData.size.width} ${templateData.size.height}`}
                fill="#fff"
              >
                {pageData.template === "blank" && (
                  null
                )}
                {pageData.template === "ruled" && (
                  <Ruled
                    maxSvgSize={templateData.size}
                    pageData={pageData}
                    setPageData={setPageData}
                    setMax={setMax}
                    setSvgLoaded={setSvgLoaded}
                  />
                )}
                {pageData.template === "dot" && (
                  <Dot
                    maxSvgSize={templateData.size}
                    pageData={pageData}
                    setPageData={setPageData}
                    setMax={setMax}
                    setSvgLoaded={setSvgLoaded}
                  />
                )}
                {pageData.template === "graph" && (
                  <Graph
                    maxSvgSize={templateData.size}
                    pageData={pageData}
                    setPageData={setPageData}
                    setMax={setMax}
                    setSvgLoaded={setSvgLoaded}
                  />
                )}
                {pageData.template === "hexagon" && (
                  <Hexagon
                    maxSvgSize={templateData.size}
                    pageData={pageData}
                    setPageData={setPageData}
                    setMax={setMax}
                    setSvgLoaded={setSvgLoaded}
                  />
                )}
                {pageData.template === "isometric" && (
                  <Isometric
                    maxSvgSize={templateData.size}
                    pageData={pageData}
                    setPageData={setPageData}
                    setMax={setMax}
                    setSvgLoaded={setSvgLoaded}
                  />
                )}
                {pageData.template === "seyes" && (
                  <Seyes
                    maxSvgSize={templateData.size}
                    pageData={pageData}
                    setPageData={setPageData}
                    setMax={setMax}
                    setSvgLoaded={setSvgLoaded}
                  />
                )}
                {pageData.template === "music" && (
                  <Music
                    maxSvgSize={templateData.size}
                    pageData={pageData}
                    setPageData={setPageData}
                    setMax={setMax}
                    setSvgLoaded={setSvgLoaded}
                  />
                )}
                {pageData.template === "handwriting" && (
                  <Handwriting
                    maxSvgSize={templateData.size}
                    pageData={pageData}
                    setPageData={setPageData}
                    setMax={setMax}
                    setSvgLoaded={setSvgLoaded}
                  />
                )}
                {pageData.template === "cross" && (
                  <CrossGrid
                    maxSvgSize={templateData.size}
                    pageData={pageData}
                    setPageData={setPageData}
                    setMax={setMax}
                    setSvgLoaded={setSvgLoaded}
                  />
                )}
                {pageData.template === "calligraphy" && (
                  <Calligraphy
                    maxSvgSize={templateData.size}
                    pageData={pageData}
                    setPageData={setPageData}
                    setMax={setMax}
                    setSvgLoaded={setSvgLoaded}
                  />
                )}
              </svg>
            </svg>
          </Box>
        )
      }}
    />
  )
}

export default ProductTemplate