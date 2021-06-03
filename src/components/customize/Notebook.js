import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { navigate, Link } from "gatsby"
import { ArrowRight, WarningCircle } from "phosphor-react"
import { colors, convertToDecimal, spacing } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"

import { Container, LayoutContainer } from "../layout/Container"
import { Flexbox } from "../layout/Flexbox"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../ui/Modal"
import { SectionMain, Section, SectionContent } from "../layout/Section"
import Button from "../Button"
import Content from "../Content"
import Icon from "../Icon"
import Layout from "../layout/Layout"
import Loader from "../Loader"
import Nav from "../layout/Nav"
import Canvas from "./Canvas"
import Controlsbar from "./Controlsbar"
import Functionsbar from "./Functionsbar"
import Notification from "../ui/Notification"
import Toolbar from "./Toolbar"
import SEO from "../layout/Seo"

const Notebook = ({ location, notebookId }) => {
  const { user, loading } = useFirebaseContext()
  const [initializing, setInitializing] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedPage, setSelectedPage] = useState(1)
  const [canvasSize, setCanvasSize] = useState({
    width: 1082,
    height: 716
  })
  const [pageSize, setPageSize] = useState({
    width: 528,
    height: 816
  })
  const canvasPages = localStorage.getItem("canvas-pages")

  useEffect(() => {
    setShowModal({
      show: user ? false : true
    })
    console.log(notebookId)

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
          const svg = `<rect width=${pageSize.width} height=${pageSize.height} fill='#fff'></rect>`
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
              <Functionsbar />
              <Flexbox
                flex="flex"
                height="100%"
              >
                <Toolbar />
                <Canvas
                  selectedPage={selectedPage}
                  canvasSize={canvasSize}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                />
                <Controlsbar
                  quantity={location.state ? location.state.quantity : 1}
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                />
              </Flexbox>
            </Flexbox>
          </LayoutContainer>
        </Container>
      </SectionMain>
      {showModal.show && (
        <Modal
          setShowModal={setShowModal}
          width="300px"
          boxshadow="none"
          backgroundcolor="transparent"
        >
          <Notification
            backgroundcolor={colors.paper.cream}
            color={colors.gray.nineHundred}
            bordercolor={colors.red.sixHundred}
          >
            <Flexbox
              flex="flex"
              alignitems="flex-start"
            >
              <Icon>
                <WarningCircle color={colors.red.sixHundred} size="2rem" weight="duotone" />
              </Icon>
              <Content
                paragraphcolor={colors.primary.sevenHundred}
                paragraphfontsize="1rem"
              >
                <h4>Log in or create an account to save layouts</h4>
                <p>Unfortunately, we won't be able to save your layouts unless you're logged into a Notesmith account.</p>
                <p><Link to="/signup">Sign up</Link> for free or <Link to="/login">log in</Link> to an existing account.</p>
              </Content>
            </Flexbox>
          </Notification>
          <ModalFooter
            justifycontent="flex-end"
            backgroundcolor="transparent"
            border="none"
          >
            <Content
              linkcolor={colors.red.sixHundred}
              paragraphfontsize="0.85rem"
              paragraphmarginbottom="0"
            >
              <Button
                backgroundcolor={colors.red.sixHundred}
                color={colors.red.oneHundred}
                onClick={() => setShowModal({
                  show: false
                })}
              >
                <span>
                  No thanks, I'm okay with losing my work
                </span>
                <Icon margin="0 0 0 0.25rem">
                  <ArrowRight color={colors.red.oneHundred} weight="bold" />
                </Icon>
              </Button>
            </Content>
          </ModalFooter>
        </Modal>
      )}
    </Layout>
  )
}

export default Notebook
