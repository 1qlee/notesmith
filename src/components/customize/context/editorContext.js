import React, { useEffect, createContext, useContext, useReducer } from "react"
import * as d3 from "d3"

import { consolidateMixedObjects, processStringNumbers, convertFloatFixed, convertToMM, convertToPx } from "../../../utils/helper-functions"

const initialState = {
  canvas: null,
  context: null,
  deletionAllowed: true,
  hoveredElement: null,
  layerName: '',
  lastNode: null,
  mode: 'select',
  multiselected: false,
  selectionGroup: null,
  selectedElements: [],
  selectionAttributes: [],
  selectionBbox: {},
  selectionPath: "",
  selecting: false,
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
          console.log("Deleting")
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

const parseAttributes = (element) => {
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

const parseBbox = (element, path) => {
  const bbox = element.getBBox()
  const bboxX = convertFloatFixed(bbox.x, 3)
  const bboxY = convertFloatFixed(bbox.y, 3)
  const bboxWidth = convertFloatFixed(bbox.width, 3)
  const bboxHeight = convertFloatFixed(bbox.height, 3)
  let pathBbox = {}

  if (path) {
    // for selection path
    pathBbox = {
      x: bboxX,
      y: bboxY,
      x2: bboxX,
      y2: bboxY,
      width: bboxWidth,
      height: bboxHeight,
    }
  }
  else {
    pathBbox = {
      x: bboxX,
      y: bboxY,
      width: bboxWidth,
      height: bboxHeight,
    }
  }

  return pathBbox
}

function sortNodesByDOMOrder(scrambledNodes) {
  return scrambledNodes.sort((a, b) => {
    const position = a.compareDocumentPosition(b);
    return position === Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
}

const parseSelection = (elements, cb) => {
  console.log(elements)
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

    // get the attribute values of the element
    let nodeAttributes = parseAttributes(element)
    // get the bbox of the element
    const strokeOffset = convertToPx(nodeAttributes.strokeWidth / 2)
    // for selection path
    let pathBbox = parseBbox(ele, true)
    // for positioning attributes
    let positioningBbox = parseBbox(ele, false)
    const isCircle = nodeName === "circle" || nodeName === "ellipse"
    const isLine = nodeName === "line"

    // adjust selection bbox values for different svg elements
    switch (true) {
      case isCircle:
        positioningBbox.x = convertFloatFixed(element.attr("cx"), 3)
        positioningBbox.y = convertFloatFixed(element.attr("cy"), 3)
        pathBbox.x = convertFloatFixed(pathBbox.x - strokeOffset, 3)
        pathBbox.y = convertFloatFixed(pathBbox.y - strokeOffset, 3)
        pathBbox.x2 = convertFloatFixed(pathBbox.x2 + strokeOffset, 3)
        pathBbox.y2 = convertFloatFixed(pathBbox.y2 + strokeOffset, 3)
        break
      case isLine:
        pathBbox.y2 = convertFloatFixed(pathBbox.y2 + strokeOffset, 3)
        break
    }
    
    // set initial coords using the first element
    if (index === 0) {
      selectionBbox = positioningBbox
      selectionAttributes = nodeAttributes
    }
    
    // function to create bbox object for client
    selectionBbox = consolidateMixedObjects(positioningBbox, selectionBbox)
    // function to create attributes object for client
    selectionAttributes = consolidateMixedObjects(nodeAttributes, selectionAttributes)

    // create coords for the selection path
    selectionPath.x = Math.min(selectionPath.x, pathBbox.x);
    selectionPath.y = Math.min(selectionPath.y, pathBbox.y);
    selectionPath.x2 = Math.max(selectionPath.x2, convertFloatFixed(pathBbox.x2 + pathBbox.width, 3))
    selectionPath.y2 = Math.max(selectionPath.y2, convertFloatFixed(pathBbox.y2 + pathBbox.height, 3))

    if (cb) {
      // fire the callback
      cb(ele)
    }
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

      d3.selectAll("#selection-group").remove()
      d3.selectAll("[data-selected]").attr("data-selected", null)
      d3.selectAll("[data-hovered]").attr("data-hovered", null)

      return {
        ...state,
        canvas: null,
        mode: "select",
        selectedElements: [],
        selectionBbox: {},
        selectionGroup: null,
        selectionPath: "",
      }
    // when user is dragging mouse to select elements
    case "change-selection": {
      log("changing selection...")
      const { canvas, selectionGroup, lastNode } = state
      const { newlyDeselectedElements, newlySelectedElements, selectedElements } = action
      let selection, currentNode

      // create a selection group if it doesn't exist already
      if (d3.select("#selection-group").empty()) {
        selection = d3.select(state.canvas).append("g").attr("id", "selection-group")
      }
      else {
        selection = selectionGroup
      }

      if (newlyDeselectedElements && newlyDeselectedElements.length > 0) {
        newlyDeselectedElements.forEach(element => {
          const node = d3.select(element)
          
          // remove "data-selected" attribute from deselected elements
          node.attr("data-selected", null)
        })
      }

      newlySelectedElements.forEach((element, index) => {
        const node = d3.select(element)
        const nodeId = node.attr("id")
        const parentNode = element.parentNode
        const isGrouped = parentNode && parentNode instanceof SVGGElement

        if (!isGrouped && nodeId !== "selection-group") {
          node.attr('data-selected', '')
        }
      })

      // if there are selected elements, parse them to create the selection box and attributes for designbar
      if (selectedElements.length > 0) {
        let orderedElements = []

        for (let i = 0, numOfEles = selectedElements.length; i < numOfEles; i++) {
          const node = selectedElements[i]
          const parentNode = node.parentNode
          const isGrouped = parentNode && parentNode.nodeName === "g" && parentNode.getAttribute("id") !== "selection-group"
          const nodeToAppend = isGrouped ? parentNode : node

          // if the element is part of a group, append the entire group to the selection group
          selection.node().appendChild(nodeToAppend)

          orderedElements.push(nodeToAppend)
        }
        console.log("🚀 ~ file: editorContext.js:273 ~ setCanvasState ~ orderedElements:", orderedElements)
        const results = parseSelection(selectedElements)

        return {
          ...state,
          selectedElements: selectedElements,
          selectionAttributes: results.selectionAttributes,
          selectionBbox: results.selectionBbox,
          selectionGroup: selection,
          selectionPath: results.selectionPath,
          lastNode: currentNode ? currentNode : lastNode,
        }
      }
      else {
        if (selection) {
          selection.remove()
        }
        
        return {
          ...state,
          selectionAttributes: [],
          selectionBbox: {},
          selectedElements: [],
          selectionPath: "",
          selectionGroup: null,
          lastNode: null,
        }
      }
    }
    case "ungroup-selection": {
      log("ungrouping all selections...")

      const { selectedElements, selectionGroup, lastNode, canvas } = state

      console.log(selectedElements)

      d3.selectAll("[data-selected]").attr("data-selected", null)
      
      if (selectedElements) {
        // clear "data-selected" attribute from all selected elements
        selectedElements.forEach(element => {
          canvas.appendChild(element)
        })
      }

      if (selectionGroup) {
        selectionGroup.remove()
      }

      return {
        ...state,
        selectedElements: [],
        selectionBbox: {},
        selectionGroup: null,
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
    case "remake-selection": {
      log("remaking selection...")


      return {
        ...state,
      }
    }
    case "toggle":
      log(`toggling setting: ${action.setting} to ${action.value}...`)

      return {
        ...state,
        [action.setting]: action.value || !state[action.setting],
      }
    case "remove":
      // log(`removing state: ${action.setting}...`)

      return {
        ...state,
        [action.setting]: action.value || null,
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