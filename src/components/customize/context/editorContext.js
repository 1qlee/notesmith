import React, { useEffect, createContext, useContext, useReducer } from "react"
import * as d3 from "d3"

import { consolidateMixedObjects, processStringNumbers, convertFloatFixed, convertToMM, convertToPx } from "../../../utils/helper-functions"

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
  tempSelectedElements: [],
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
      setSelectedPageSvg(canvasState.canvas)
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

const parseAttributes = (ele) => {
  const element = d3.select(ele)
  const fill = element.attr("fill") || "none"
  const stroke = element.attr("stroke") || "none"
  const strokeOpacity = element.attr("stroke-opacity") || 1
  const fillOpacity = element.attr("fill-opacity") || 1
  const strokeWidth = convertToMM(element.attr("stroke-width")) || 0.088
  const strokeDasharray = element.attr("stroke-dasharray") !== undefined ? processStringNumbers(element.attr("stroke-dasharray"), convertToMM) : ""
  const strokeStyle = element.attr("strokeStyle") || "Solid"
  const nodeAttributes = {
    fill,
    fillOpacity,
    strokeOpacity,
    stroke,
    strokeWidth,
    strokeDasharray,
    strokeStyle,
  }

  return nodeAttributes
}

const parseBbox = (ele, path) => {
  const bbox = ele.getBBox()
  const bboxX = convertFloatFixed(bbox.x, 3)
  const bboxY = convertFloatFixed(bbox.y, 3)
  const bboxWidth = convertFloatFixed(bbox.width, 3)
  const bboxHeight = convertFloatFixed(bbox.height, 3)
  const nodeBbox = {}

  if (path) {
    // for selection path
    nodeBbox = {
      x: bboxX,
      y: bboxY,
      x2: bboxX,
      y2: bboxY,
      width: bboxWidth,
      height: bboxHeight,
    }
  }
  else {
    nodeBbox = {
      x: bboxX,
      y: bboxY,
      width: bboxWidth,
      height: bboxHeight,
    }
  }

  return nodeBbox
}

const parseSelection = (elements) => {
  // coords for the selection path box
  let selectionPath = {
    x: Infinity,
    y: Infinity,
    x2: -Infinity,
    y2: -Infinity,
  }
  // selection bbox properties
  let selectionBbox = {}
  let selectionAttributes = {}
  let convertedSelectionBbox = {}

  // for each selected element, get the bbox and attributes
  elements.forEach((ele, index) => {
    const element = d3.select(ele)
    const { nodeName } = ele

    // if the element is a child of a group, get the group's bbox instead
    if (ele.parentNode && ele.parentNode instanceof SVGGElement) {
      console.log(ele.parentNode.getBBox())
      ele = ele.parentNode
      if (ele.parentNode instanceof SVGGElement) {
        ele = ele.parentNode
      }
      else {
        const groupElements = ele.childNodes
      }
    }

    // get the attribute values of the element
    let nodeAttributes = parseAttributes(element)

    // get the bbox of the element
    const strokeOffset = convertToPx(nodeAttributes.strokeWidth / 2)
    // for selection path
    let nodeBbox = parseBbox(ele, true)
    // for selection bbox (client side inputs)
    let nodeBboxAlt = parseBbox(ele, false)
    const isCircle = nodeName === "circle" || nodeName === "ellipse"
    const isLine = nodeName === "line"

    // adjust selection bbox values for different svg elements
    switch (true) {
      case isCircle:
        nodeBboxAlt.x = convertFloatFixed(element.attr("cx"), 3)
        nodeBboxAlt.y = convertFloatFixed(element.attr("cy"), 3)
        nodeBbox.x = convertFloatFixed(bboxX - strokeOffset, 3)
        nodeBbox.y = convertFloatFixed(bboxY - strokeOffset, 3)
        nodeBbox.x2 = convertFloatFixed(bboxX + strokeOffset, 3)
        nodeBbox.y2 = convertFloatFixed(bboxY + strokeOffset, 3)
        break
      case isLine:
        nodeBbox.y2 = convertFloatFixed(bboxY + strokeOffset, 3)
        break
    }
    
    // set initial coords using the first element
    if (index === 0) {
      selectionBbox = nodeBboxAlt
      selectionAttributes = nodeAttributes
    }
    
    // function to create bbox object for client
    selectionBbox = consolidateMixedObjects(nodeBboxAlt, selectionBbox)
    // function to create attributes object for client
    selectionAttributes = consolidateMixedObjects(nodeAttributes, selectionAttributes)

    // create coords for the selection path
    selectionPath.x = Math.min(selectionPath.x, nodeBbox.x);
    selectionPath.y = Math.min(selectionPath.y, nodeBbox.y);
    selectionPath.x2 = Math.max(selectionPath.x2, convertFloatFixed(nodeBbox.x2 + nodeBbox.width, 3))
    selectionPath.y2 = Math.max(selectionPath.y2, convertFloatFixed(nodeBbox.y2 + nodeBbox.height, 3))
  })

  // create the selection path based on coords
  // coords are top-left (x,y), top-right (x2,y), bottom-right (x2,y2), bottom-left (x,y2)
  const path = `M ${selectionPath.x},${selectionPath.y} L ${selectionPath.x2},${selectionPath.y} ${selectionPath.x2},${selectionPath.y2} ${selectionPath.x},${selectionPath.y2} Z`
  
  convertedSelectionBbox = {
    x: typeof selectionBbox.x === "number" ? convertToMM(selectionBbox.x) : selectionBbox.x,
    y: typeof selectionBbox.y === "number" ? convertToMM(selectionBbox.y) : selectionBbox.y,
    width: typeof selectionBbox.width === "number" ? convertToMM(selectionBbox.width) : selectionBbox.width,
    height: typeof selectionBbox.height === "number" ? convertToMM(selectionBbox.height) : selectionBbox.height,
  }

  return {
    selectionBbox: convertedSelectionBbox,
    tempSelectedElements: elements,
    selectionAttributes: selectionAttributes,
    selectionPath: path,
  }
}

const setCanvasState = (state, action) => {
  switch (action.type) {
    case "initialize":
      log("Initializing canvas...")

      return {
        ...state,
        canvas: action.canvas,
      }
    case "reset":
      log("Resetting...")

      d3.selectAll("[data-selected]").attr("data-selected", null)
      d3.selectAll("[data-hovered]").attr("data-hovered", null)

      return {
        ...state,
        selectedElements: [],
        tempSelectedElements: [],
        selectionBbox: {},
        selectionPath: "",
      }
    // when user is dragging mouse to select elements
    case "change-selection": {
      log("changing selection...")
      const { newlyDeselectedElements, newlySelectedElements } = action

      // toggle "data-selected" attribute directly through the DOM
      if (newlyDeselectedElements && newlyDeselectedElements.length > 0) {
        newlyDeselectedElements.forEach(element => {
          const ele = d3.select(element)
          ele.attr("data-selected", null)
        })
      }
      newlySelectedElements.forEach(element => {
        const ele = d3.select(element)
        const eleId = ele.attr("id")
        // make sure we don't add the selection path to the selected elements
        if (eleId !== "selection-path" && eleId !== "selection-group") {
          ele.attr('data-selected', '')
        }
      })

      // if there are selected elements, parse them to create the selection box and attributes for designbar
      if (action.selectedElements.length > 0) {
        const results = parseSelection(action.selectedElements)

        console.log(results.tempSelectedElements)

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
    }
    case "select":
      {
        log("selecting elements and saving them to state...")
        let lastNode, selectedGroup
        const { tempSelectedElements } = state
        const lastElement = tempSelectedElements.length - 1

        // if selected elements group exists, remove it and create a new one
        if (d3.select("#selected-elements")) {
          d3.selectAll("#selected-elements").remove()

          // create a new selection group
          let selection = d3.select(state.canvas).append("g").attr("id", "selected-elements")
          
          if (tempSelectedElements.length > 1) {
            selection.style("pointer-events", "bounding-box")
          }
          else {
            selection.style("pointer-events", "all")
          }

          selectedGroup = selection
        }
        else {
          selectedGroup = d3.select("#selected-elements")
        }

        state.tempSelectedElements.forEach((element, index) => {
          if (index === lastElement) {
            lastNode = element.nextSibling
          }
          selectedGroup.node().appendChild(element)
        })

        return {
          ...state,
          selectedElements: state.tempSelectedElements,
          lastNode: lastNode,
          tempSelectedElements: [],
        }
      }
    case "ungroup-selection": {
      if (state.selectedElements) {
        // clear "data-selected" attribute from all selected elements
        d3.selectAll("[data-selected]").attr("data-selected", null)

        // move selected elements back into the canvas
        state.selectedElements.forEach(element => {
          d3.select(element).attr("data-selected", null)
          state.canvas.insertBefore(element, state.lastNode)
        })

        if (d3.select("#selected-elements")) {
          d3.selectAll("#selected-elements").remove()
        }
      }

      return {
        ...state,
        selectedElements: [],
        tempSelectedElements: [],
        selectionBbox: {},
        selectionPath: "",
      }
    }
    case "mutate-selection": {
      log("mutating selection...")

      const results = parseSelection(state.selectedElements)
      const { selectionBbox, selectionAttributes, selectionPath } = results

      return {
        ...state,
        selectionBbox: selectionBbox,
        selectionAttributes: selectionAttributes,
        selectionPath: selectionPath,
      }
    }
    case "toggle-deletion":

      return {
        ...state,
        deletionAllowed: action.deletionAllowed,
      }
    case "remove-selectionPath":
      log("toggling selection path...")

      return {
        ...state,
        selectionPath: "",
      }
    case "change-mode":
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
    default:
      return state;
  }
}

function log(msg) {
  console.log(`%c[-EDITOR-] ${msg}%c `, 'color:#fff;background-color:#007aff', 'color:inherit')
}

export function useEditorContext() {
  return useContext(EditorContext)
}

export function useEditorDispatch() {
  return useContext(EditorDispatchContext)
}