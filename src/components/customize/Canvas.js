import React, { useEffect, useState, useRef, useContext, useLayoutEffect } from "react"
import SvgCanvas from '@svgedit/svgcanvas'
import styled from "styled-components"
import { colors } from "../../styles/variables"
import sanitizeSvg from "./editor/sanitizeSvg"
import config from "./editor/editorConfig"
import updateCanvas from "./editor/updateCanvas"
import { canvasContext, CanvasContextProvider } from  "./context/canvasContext"

import PageSpread from "./PageSpread"
import Workspace from "./Workspace"

const StyledCanvas = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: ${colors.white};
  height: ${props => props.height + "px" || "100%"};
  width: ${props => props.width  + "px" || "100%"};
`

function Canvas({
  bookData,
  canvasPages,
  canvasPageTemplates,
  pageData,
  selectedPage,
  selectedPageSvg,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
  svgContent, 
  svgUpdate, 
  svgSize,
  log
}) {
  const textRef = useRef(null)
  const svgcanvasRef = useRef(null)
  const oiAttributes = React.useRef(sanitizeSvg.saveOIAttr(svgContent))
  const [canvasState, dispatchCanvasState] = useContext(canvasContext)
  const [canvasSize, setCanvasSize] = useState({
    width: 1456,
    height: 916,
  })

  const updateContextPanel = () => {
    let elem = canvasState.selectedElement
    // If element has just been deleted, consider it null
    if (elem && !elem.parentNode) {
      elem = null
    }
    if (elem) {
      const { tagName } = elem
      if (tagName === 'text') {
        // we should here adapt the context to a text field
        textRef.current.value = elem.textContent
      }
    }
  }

  const selectedHandler = (win, elems) => {
    log('selectedHandler', elems)

    const selectedElement = elems.length === 1 || !elems[1] ? elems[0] : null
    const multiselected = (elems.length >= 2 && !!elems[1])

    dispatchCanvasState({
      type: 'selectedElement',
      selectedElement,
      multiselected,
    })
  }

  const changedHandler = (win, elems) => {
    log('changedHandler', { elems })
    dispatchCanvasState({ type: 'updated', updated: true })
  }

  const svgUpdateHandler = (svgString) => {
    svgUpdate(sanitizeSvg.restoreOIAttr(svgString, oiAttributes.current))
    console.log(canvasState)
    dispatchCanvasState({ type: 'updated', updated: false })
  }

  const contextsetHandler = (win, context) => {
    dispatchCanvasState({ type: 'context', context })
  }

  const onKeyUp = (event) => {
    dispatchCanvasState({ type: 'setTextContent', text: event.target.value })
  }

  const onKeyDown = (event) => {
    if (event.key === 'Backspace' && event.target.tagName !== 'INPUT') {
      event.preventDefault()
      dispatchCanvasState({ type: 'deleteSelectedElements' })
    }
  }

  // unused events -> we just log them in debug mode.
  const eventList = {
    selected: selectedHandler,
    changed: changedHandler,
    contextset: contextsetHandler,
    'extension-added': () => log('extensionAddedHandler'),
    cleared: () => log('clearedHandler'),
    exported: () => log('exportedHandler'),
    exportedPDF: () => log('exportedPDFHandler'),
    message: () => log('messageHandler'),
    pointsAdded: () => log('pointsAddedHandler'),
    saved: () => log('savedHandler'),
    setnonce: () => log('setnonceHandler'),
    unsetnonce: () => log('unsetnonceHandler'),
    transition: () => log('transitionHandler'),
    zoomed: () => log('zoomedHandler'),
    zoomDone: () => log('zoomDoneHandler'),
    updateCanvas: () => log('updateCanvasHandler'),
    extensionsAdded: () => log('extensionsAddedHandler'),
  }

  // useLayoutEffect(() => {
  //   // get the outer container for the svg canvas
  //   const canvasDom = svgcanvasRef.current
  //   // create new canvas instance inside the container
  //   const canvas = new SvgCanvas(canvasDom, config)

  //   updateCanvas(canvas, canvasDom, config, true)

  //   canvas.textActions.setInputElem(textRef.current)

  //   Object.entries(eventList).forEach(([eventName, eventHandler]) => {
  //     canvas.bind(eventName, eventHandler)
  //   })

  //   dispatchCanvasState({ type: 'init', canvas, svgcanvas: canvasDom, config })

  //   document.addEventListener('keydown', onKeyDown.bind(canvas))

  //   return () => {
  //     // cleanup function
  //     console.log('cleanup')
  //     document.removeEventListener('keydown', onKeyDown.bind(canvas))
  //   }
  // }, [])

  // useLayoutEffect(() => {
  //   log('new svgContent', svgContent.length)

  //   if (!canvasState.canvas) return

  //   oiAttributes.current = sanitizeSvg.saveOIAttr(svgContent)

  //   canvasState.canvas.clear()

  //   const success = canvasState.canvas.setSvgString(svgContent.replace(/'/g, "\\'"), true) // true => prevent undo

  //   updateCanvas(canvasState.canvas, svgcanvasRef.current, config, true)

  //   if (!success) throw new Error('Error loading SVG')

  //   dispatchCanvasState({ type: 'updated', updated: false })
  // }, [svgContent, canvasState.canvas])

  // updateContextPanel()

  return (
    <>
      <Workspace>
        <StyledCanvas
          height={canvasSize.height}
          width={canvasSize.width}
        >
          <PageSpread
            bookData={bookData}
            canvasSize={canvasSize}
            canvasPages={canvasPages}
            canvasPageTemplates={canvasPageTemplates}
            pageData={pageData}
            selectedPage={selectedPage}
            selectedPageSvg={selectedPageSvg}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            setSvgSize={setSvgSize}
            svgSize={svgSize}
          />
        </StyledCanvas>
      </Workspace>
    </>
  )
}

const CanvasWithContext = (props) => (<CanvasContextProvider><Canvas {...props} /></CanvasContextProvider>)

export default CanvasWithContext
