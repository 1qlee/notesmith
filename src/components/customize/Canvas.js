import React, { useState, useRef, useContext, useLayoutEffect } from "react"
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
  display: block;
  background-color: ${colors.white};
  height: ${props => props.height || "100%"};
  width: ${props => props.width || "100%"};
`

function Canvas({
  bookData,
  canvasPages,
  canvasPageTemplates,
  pageData,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
  svgContent = '<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg"></svg>', 
  locale, 
  svgUpdate, 
  log
}) {
  const textRef = useRef(null)
  const svgcanvasRef = useRef(null)
  const oiAttributes = React.useRef(sanitizeSvg.saveOIAttr(svgContent))
  const [canvasState, dispatchCanvasState] = useContext(canvasContext)
  log('Canvas', { locale, canvasState })
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

  useLayoutEffect(() => {
    const editorDom = svgcanvasRef.current
    const canvas = new SvgCanvas(editorDom, config)
    updateCanvas(canvas, svgcanvasRef.current, config, true)
    console.log(canvas)
    canvas.textActions.setInputElem(textRef.current)
    Object.entries(eventList).forEach(([eventName, eventHandler]) => {
      canvas.bind(eventName, eventHandler)
    })
    dispatchCanvasState({ type: 'init', canvas, svgcanvas: editorDom, config })
    document.addEventListener('keydown', onKeyDown.bind(canvas))
    return () => {
      // cleanup function
      console.log('cleanup')
      document.removeEventListener('keydown', onKeyDown.bind(canvas))
    }
  }, [])

  useLayoutEffect(() => {
    log('new svgContent', svgContent.length)
    if (!canvasState.canvas) return
    oiAttributes.current = sanitizeSvg.saveOIAttr(svgContent)
    canvasState.canvas.clear()
    console.log(canvasState.canvas)
    const success = canvasState.canvas.setSvgString(svgContent.replace(/'/g, "\\'"), true) // true => prevent undo
    updateCanvas(canvasState.canvas, svgcanvasRef.current, config, true)
    if (!success) throw new Error('Error loading SVG')
    dispatchCanvasState({ type: 'updated', updated: false })
  }, [svgContent, canvasState.canvas])

  updateContextPanel()

  return (
    <Workspace>
      <StyledCanvas>
        <svg
          id="page-root"
          xmlns="http://www.w3.org/2000/svg"
          xlinkns="http://www.w3.org/1999/xlink"
          width={canvasSize.width}
          height={canvasSize.height}
          viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
        >
          <PageSpread
            bookData={bookData}
            canvasSize={canvasSize}
            canvasPages={canvasPages}
            canvasPageTemplates={canvasPageTemplates}
            pageData={pageData}
            selectedPage={selectedPage}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            setSvgSize={setSvgSize}
          />
        </svg>
        <div className="workarea">
          <div ref={svgcanvasRef} className="svgcanvas" style={{ position: 'relative' }} />
        </div>
        <input ref={textRef} onKeyUp={onKeyUp} type="text" size="35" style={{ position: 'absolute', left: '-9999px' }} />
      </StyledCanvas>
    </Workspace>
  )
}

const CanvasWithContext = (props) => (<CanvasContextProvider><Canvas {...props} /></CanvasContextProvider>)

export default CanvasWithContext
