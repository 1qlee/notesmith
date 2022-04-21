import React, { useState, useEffect } from "react"
import styled from "styled-components"
import "../../../styles/toastify.css"
import { ArrowRight, CircleNotch, CheckCircle } from "phosphor-react"
import { colors, convertToMM } from "../../../styles/variables"
import { svgToObjects } from "../../../utils/helper-functions"
import { ToastContainer, toast } from 'react-toastify'

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

const PageIcon = styled.div`
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid ${colors.gray.threeHundred};
  display: flex;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: 0.825rem;
  justify-content: center;
  padding: 0.5rem;
  transition: border-color 0.2s, background-color 0.2s;
  margin: ${props => props.margin};
  &:hover {
    border-color: ${colors.gray.sixHundred};
    background-color: ${colors.primary.hover};
    cursor: pointer;
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
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const maximumMarginHeight = convertToMM(pageData.pageHeight)
  const maximumMarginWidth = convertToMM(pageData.pageWidth)

  useEffect(() => {

  }, [pageContentSize])

  function handleSetTemplate() {
    setLoading(true)

    // create artificial async
    setTimeout(() => {
      if (currentPageSide === "left") {
        setLeftPageData(pageData)
      }
      else {
        setRightPageData(pageData)
      }

      setLoading(false)
      toast.success(`Applied template to ${currentPageSide} pages!`)
    }, 500)
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
              <Flexbox
                flex="flex"
                margin="0"
              >
                <PageIcon
                  margin="0 0.5rem 0 0"
                  className={currentPageSide === "left" ? "is-active" : null}
                  onClick={() => setCurrentPageSide("left")}
                >
                  L
                </PageIcon>
                <PageIcon
                  margin="0 0.5rem 0 0"
                  className={currentPageSide === "right" ? "is-active" : null}
                  onClick={() => setCurrentPageSide("right")}
                >
                  R
                </PageIcon>
              </Flexbox>
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
        <ToastContainer
          autoClose={3000}
          closeOnClick
          draggable
          draggablePercent={50}
          hideProgressBar={false}
          limit={3}
          newestOnTop={false}
          pauseOnFocusLoss
          pauseOnHover
          position="bottom-center"
          rtl={false}
          theme="colored"
          style={{
            fontFamily: "Inter, Helvetica, Tahoma, sans-serif",
            fontSize: "0.75rem",
          }}
        />
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
