import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { navigate, Link } from "gatsby"
import { ArrowRight, WarningCircle, CheckCircle, Circle } from "phosphor-react"
import { colors, convertToDecimal, spacing } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"

import { Container, LayoutContainer } from "../layout/Container"
import { Flexbox } from "../layout/Flexbox"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../ui/Modal"
import { SectionMain, Section, SectionContent } from "../layout/Section"
import { StyledFieldset, StyledLabel, StyledInput, RadioInput } from "../form/FormComponents"
import ApplyTemplateModal from "./Modals/ApplyTemplateModal"
import CheckLoginModal from "./Modals/CheckLoginModal"
import Button from "../Button"
import Content from "../Content"
import Icon from "../Icon"
import Layout from "../layout/Layout"
import Loader from "../Loader"
import Nav from "../layout/Nav"
import Canvas from "./Canvas"
import Controls from "./Controls"
import Functionsbar from "./Bars/Functionsbar"
import Notification from "../ui/Notification"
import Toolbar from "./Toolbar"
import SEO from "../layout/Seo"

const Notebook = ({ location, notebookId }) => {
  const { user, loading } = useFirebaseContext()
  const [initializing, setInitializing] = useState(true)
  const [showModal, setShowModal] = useState({
    show: false,
    type: "notification"
  })
  const [selectedPage, setSelectedPage] = useState(1)
  const [totalPages, setTotalPages] = useState(48)
  const [canvasSize, setCanvasSize] = useState({
    width: 1082,
    height: 716
  })
  const [pageSize, setPageSize] = useState({
    width: 528,
    height: 816
  })
  const [pageData, setPageData] = useState({
    template: "",
    alignmentHorizontal: "center",
    alignmentVertical: "center",
    spacing: 5,
    opacity: 1,
    thickness: 1,
    rows: 43,
    columns: 27,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    width: 1,
    lineWidth: pageSize.width
  })
  const [selectedPageSvg, setSelectedPageSvg] = useState()
  const canvasPages = localStorage.getItem("canvas-pages")
  const parseCanvasPages = JSON.parse(canvasPages)

  useEffect(() => {
    console.log(selectedPageSvg)
    setShowModal({
      show: user ? false : true,
      type: "notification",
    })
    console.log(notebookId)
    console.log(selectedPage)
    if (user) {
      console.log("logged in")
      console.log(notebookId)
    }
    else {
      console.log("not logged in")
      console.log(notebookId)
      if (canvasPages) {
        console.log("canvas pages exist")
      }
      else {
        console.log("canvas pages do not exist... creating canvas pages")
        const pagesArray = []

        for (let i = 0; i < 48; i++) {
          const svg = `<svg id="page-${i}" xmlns="http://www.w3.org/2000/svg"><rect width="${pageSize.width}" height="${pageSize.height}" fill="#fff"></rect></svg>`
          pagesArray.push(svg)
        }

        localStorage.setItem("canvas-pages", JSON.stringify(pagesArray))
      }
    }
  }, [user])

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <Layout className="is-full-height">
      <SEO title="Truly Custom Notebooks For All People" />
      <Nav chapterNumber="93" title="Create your own layout" />
      <SectionMain>
        <Container>
          <LayoutContainer>
            <Flexbox
              flex="flex"
              height="100%"
              flexdirection="column"
              justifycontent="space-between"
              padding="0"
            >
              <Functionsbar
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                totalPages={totalPages}
              />
              <Flexbox
                flex="flex"
                height="100%"
              >
                <Toolbar />
                <Canvas
                  canvasSize={canvasSize}
                  pageData={pageData}
                  pageSize={pageSize}
                  selectedPage={selectedPage}
                  setSelectedPageSvg={setSelectedPageSvg}
                  setPageData={setPageData}
                  setPageSize={setPageSize}
                />
                <Controls
                  pageData={pageData}
                  pageSize={pageSize}
                  quantity={location.state ? location.state.quantity : 1}
                  canvasPages={parseCanvasPages}
                  selectedPage={selectedPage}
                  setShowModal={setShowModal}
                  setPageData={setPageData}
                  setPageSize={setPageSize}
                  setSelectedPage={setSelectedPage}
                />
              </Flexbox>
            </Flexbox>
          </LayoutContainer>
        </Container>
      </SectionMain>
      {showModal.show && (
        <>
          {showModal.type === "notification" && (
            <CheckLoginModal setShowModal={setShowModal} />
          )}
          {showModal.type === "template" && (
            <ApplyTemplateModal
              setShowModal={setShowModal}
              selectedPage={selectedPage}
              selectedPageSvg={selectedPageSvg}
            />
          )}
        </>
      )}
    </Layout>
  )
}

export default Notebook
