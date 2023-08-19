import React, { useEffect, createContext, useContext, useReducer } from "react"
import { createRoot } from 'react-dom/client';
import { SVG as svgJs } from "@svgdotjs/svg.js"
import "@svgdotjs/svg.draggable.js"
import * as d3 from "d3"

import { consolidateMixedObjects, processStringNumbers, convertFloatFixed, convertToMM } from "../../../utils/helper-functions"

const initialState = {
  canvas: null,
  context: null,
  deletionAllowed: true,
  hoveredElement: null,
  layerName: '',
  mode: 'select',
  multiselected: false,
  selectedElements: [],
  selectionAttributes: [],
  selectionBbox: {},
  selectionPath: "",
  updated: false,
  zoom: 100,
}

const EditorContext = createContext(null);
const EditorDispatchContext = createContext(null);

export function EditorProvider({ bookDimensions, children, setSelectedPageSvg, setPageData, pageData }) {
  const [canvasState, dispatch] = useReducer(setCanvasState, { ...initialState, bookWidth: bookDimensions.width, bookHeight: bookDimensions.height })

  useEffect(() => {
    const deleteElements = (e) => {
      if (canvasState.deletionAllowed) {
        // if key pressed is delete or backspace
        if (e.key === "Delete" || e.key === "Backspace") {
          canvasState.selectedElements.forEach(ele => {
            ele.remove()
          })

          dispatch({
            type: 'reset',
          })
        }
      }
    }

    if (canvasState.canvas) {
      setSelectedPageSvg(canvasState.canvas.node)
    }

    if (canvasState.selectedElements) {
      document.addEventListener("keydown", deleteElements)
    }

    return () => {
      document.removeEventListener("keydown", deleteElements)
    }
  }, [canvasState])

  return (
    <EditorContext.Provider 
      value={canvasState}
      suppressContentEditableWarning={true}
    >
      <EditorDispatchContext.Provider value={dispatch}>
        {children}
      </EditorDispatchContext.Provider>
    </EditorContext.Provider>
  );
}

const parseSelection = (elements) => {
  // coords for the selection path box
  let selectionPathCoords = {
    x: Infinity,
    y: Infinity,
    x2: -Infinity,
    y2: -Infinity,
  }
  // selection bbox properties
  let selectionBbox = {}
  let selectionAttributes = {}
  let eleBboxMM = {}

  // loop through selected elements and get the coords of the bbox
  // in this process, we convert the elements to svg.js objects so we should re-save them to state
  const selectedElements = []

  // for each selected element, get the bbox and find its bbox
  elements.forEach((ele, index) => {
    // convert to svg.js object
    const allAttr = ele.attributes
    const fill = allAttr.fill ? allAttr.fill.value : "none"
    const opacity = allAttr.opacity ? allAttr.opacity.value : 1
    const stroke = allAttr.stroke ? allAttr.stroke.value : "none"
    const fillOpacity = allAttr['fill-opacity'] ? allAttr['fill-opacity'].value : 1
    const strokeWidth = allAttr['stroke-width'] ? allAttr['stroke-width'].value : 0
    const strokeDasharray = allAttr['stroke-dasharray'] !== undefined ? processStringNumbers(allAttr['stroke-dasharray'].value, convertToMM) : ""
    const strokeStyle = ele.getAttribute("strokeStyle") || "Solid"
    const eleAttr = {
      fill,
      fillOpacity,
      opacity,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeStyle,
    }
    
    // push converted elements into dummy array so we can save to state later
    selectedElements.push(ele)
    
    // get the bbox of the element
    const bbox = ele.getBBox()
    const currentEleBbox = {
      x: convertFloatFixed(bbox.x, 3),
      y: convertFloatFixed(bbox.y, 3),
      width: convertFloatFixed(bbox.width, 3),
      height: convertFloatFixed(bbox.height, 3),
    }
    
    // set initial coords using the first element
    if (index === 0) {
      selectionBbox = currentEleBbox
      selectionAttributes = eleAttr
    }
    // function to create bbox object for client
    selectionBbox = consolidateMixedObjects(currentEleBbox, selectionBbox)
    // function to create attributes object for client
    selectionAttributes = consolidateMixedObjects(eleAttr, selectionAttributes)

    selectionPathCoords.x = Math.min(selectionPathCoords.x, currentEleBbox.x);
    selectionPathCoords.y = Math.min(selectionPathCoords.y, currentEleBbox.y);
    selectionPathCoords.x2 = Math.max(selectionPathCoords.x2, convertFloatFixed(currentEleBbox.x + currentEleBbox.width, 3));
    selectionPathCoords.y2 = Math.max(selectionPathCoords.y2, convertFloatFixed(currentEleBbox.y + currentEleBbox.height, 3));
  })

  // create the selection path based on coords
  // coords are top-left (x,y), top-right (x2,y), bottom-right (x2,y2), bottom-left (x,y2)
  const path = `M ${selectionPathCoords.x},${selectionPathCoords.y} L ${selectionPathCoords.x2},${selectionPathCoords.y} ${selectionPathCoords.x2},${selectionPathCoords.y2} ${selectionPathCoords.x},${selectionPathCoords.y2} Z`
  
  eleBboxMM = {
    x: typeof selectionBbox.x === "number" ? convertToMM(selectionBbox.x) : selectionBbox.x,
    y: typeof selectionBbox.y === "number" ? convertToMM(selectionBbox.y) : selectionBbox.y,
    width: typeof selectionBbox.width === "number" ? convertToMM(selectionBbox.width) : selectionBbox.width,
    height: typeof selectionBbox.height === "number" ? convertToMM(selectionBbox.height) : selectionBbox.height,
  }
  
  console.log("🚀 ~ file: editorContext.js:142 ~ parseSelection ~ eleBboxMM:", eleBboxMM)
  console.log("🚀 ~ file: editorContext.js:154 ~ parseSelection ~ selectedElements:", selectedElements)
  console.log("🚀 ~ file: editorContext.js:156 ~ parseSelection ~ selectionAttributes:", selectionAttributes)
  

  return {
    selectionBbox: eleBboxMM,
    tempSelectedElements: selectedElements,
    selectionAttributes: selectionAttributes,
    selectionPath: path,
  }
}

const setCanvasState = (state, action) => {
  switch (action.type) {
    case "reset":
      log("Resetting...")
      
      return {
        ...state,
        selectedElements: [],
        tempSelectedElements: [],
        selectionBbox: {},
        selectionPath: "",
      }
    // when user is dragging mouse to select elements
    case 'change-selection':
      log("changing selection...")
      let results = {}

      // toggle "data-selected" attribute directly through the DOM
      action.newlyDeselectedElements.forEach(element => element.removeAttribute('data-selected'))
      action.newlySelectedElements.forEach(element => {
        // make sure we don't add the selection path to the selected elements
        if (element.getAttribute("id") !== "selection-path") {
          element.setAttribute('data-selected', '')
        }
      })

      // if there are selected elements, parse them to create the selection box and attributes for designbar
      if (action.selectedElements.length > 0) {
        results = parseSelection(action.selectedElements)
        
        return {
          ...state,
          selectionAttributes: results.selectionAttributes,
          selectionBbox: results.selectionBbox,
          tempSelectedElements: results.tempSelectedElements,
          selectionPath: results.selectionPath,
        }
      }
      else {
        return {
          ...state,
          selectionAttributes: [],
          selectionBbox: {},
          tempSelectedElements: [],
          selectionPath: "",
        }
      }
    case 'select':
      {
        log("selecting elements and saving them to state...")

        return {
          ...state,
          selectedElements: state.tempSelectedElements,
          tempSelectedElements: [],
        }
      }
    case "mutate-selection":
      {
        log("mutating selection...")

        const results = parseSelection(state.selectedElements, state.selectionPath)
        const { selectionBbox, selectionAttributes } = results

        return {
          ...state,
          selectionBbox: selectionBbox,
          selectionAttributes: selectionAttributes,
        }
      }
    case "toggle-deletion":

      return {
        ...state,
        deletionAllowed: action.deletionAllowed,
      }
    case "change-mode":
      log(`Changing mode to [${action.mode}]`)
      const { mode } = action

      if (mode !== state.mode) {
        return {
          ...state,
          mode: mode,
        }
      }
      else {
        return state
      }
    case "hover-selection":
      log("Adding hovered element to state")
      const convertedElement = svgJs(action.hoveredElement)

      // if a hoveredElement already exists, remove the data-hovered attribute from it
      if (state.hoveredElement) {
        // unless it's the same element as the new hoveredElement
        if (state.hoveredElement !== convertedElement) {
          state.hoveredElement.attr({ 'data-hovered': null })
        }
      }

      // if the hoveredElement exists (it is a child of canvasPageRef)
      if (convertedElement) {
        // add the hovered attribute
        convertedElement.attr({ 'data-hovered': '' })

        // save it to statez
        return {
          ...state,
          hoveredElement: convertedElement,
        }
      }
      // otherwise set mode back to select; it could have been changed to drag
      // and remove any existing hoveredElement
      else {
        return {
          ...state,
          mode: "select",
          hoveredElement: null,
        }
      }
    default:
      return state;
  }
}

function log(msg) {
  console.log("%c[-EDITOR-]%c " + msg, 'color:#22543D;background-color:#9AE6B4', 'color:inherit')
}

export function useEditorContext() {
  return useContext(EditorContext)
}

export function useEditorDispatch() {
  return useContext(EditorDispatchContext)
}