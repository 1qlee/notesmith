import React, { useEffect, createContext, useContext, useReducer } from "react"
import { SVG as svgJs } from "@svgdotjs/svg.js"
import "@svgdotjs/svg.draggable.js"
import { consolidateMixedObjects, processStringNumbers, convertFloatFixed, convertToMM } from "../../../utils/helper-functions"

const initialState = {
  canvas: null,
  context: null,
  deletionAllowed: true,
  layerName: '',
  hoveredElement: null,
  mode: 'select',
  multiselected: false,
  selectedElements: null,
  selection: null,
  updated: false,
  zoom: 100,
  selectionBbox: {},
  selectionAttributes: [],
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
            canvasState.selectionPath.hide()
          })

          dispatch({
            type: 'remove-selection',
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

const parseSelection = (elements, path) => {
  // coords for the selection path box
  let selectionPathCoords = {}
  // selection bbox properties
  let selectionBbox = {}
  let selectionAttributes = {}
  let eleBboxMM = {}

  // loop through selected elements and get the coords of the bbox
  // in this process, we convert the elements to svg.js objects so we should re-save them to state
  const convertedElements = []

  // for each selected element, get the bbox and find its bbox
  elements.forEach((ele, index) => {
    // convert to svg.js object
    const convertedEle = svgJs(ele)
    const allAttr = convertedEle.attr()
    const { fill, opacity } = allAttr
    const stroke = allAttr.stroke || "none"
    const fillOpacity = allAttr['fill-opacity'] || 1
    const strokeWidth = convertToMM(allAttr['stroke-width'])
    const strokeDasharray = allAttr['stroke-dasharray'] !== undefined ? processStringNumbers(allAttr['stroke-dasharray'], convertToMM) : ""
    const strokeStyle = convertedEle.data("strokeStyle") || "Solid"
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
    convertedElements.push(convertedEle)
    
    // get the bbox of the element
    const bbox = convertedEle.bbox()
    const currentEleBbox = {
      x: convertFloatFixed(bbox.x, 3),
      y: convertFloatFixed(bbox.y, 3),
      x2: convertFloatFixed(bbox.x2, 3),
      y2: convertFloatFixed(bbox.y2, 3),
      width: convertFloatFixed(bbox.width, 3),
      height: convertFloatFixed(bbox.height, 3),
      cx: convertFloatFixed(bbox.cx, 3),
      cy: convertFloatFixed(bbox.cy, 3),
    }
    
    // set initial coords using the first element
    if (index === 0) {
      selectionPathCoords = {
        x: currentEleBbox.x,
        y: currentEleBbox.y,
        x2: currentEleBbox.x2,
        y2: currentEleBbox.y2,
      }
      selectionBbox = currentEleBbox
      selectionAttributes = eleAttr
    }
    // function to create bbox object for client
    selectionBbox = consolidateMixedObjects(currentEleBbox, selectionBbox)
    // function to create attributes object for client
    selectionAttributes = consolidateMixedObjects(eleAttr, selectionAttributes)

    // find min-max coord values for the selection box
    if (currentEleBbox.x < selectionPathCoords.x) {
      selectionPathCoords.x = currentEleBbox.x;
    }
    if (currentEleBbox.y < selectionPathCoords.y) {
      selectionPathCoords.y = currentEleBbox.y;
    }
    if (currentEleBbox.x2 > selectionPathCoords.x2) {
      selectionPathCoords.x2 = currentEleBbox.x2;
    }
    if (currentEleBbox.y2 > selectionPathCoords.y2) {
      selectionPathCoords.y2 = currentEleBbox.y2;
    }
  })

  // create the selection path based on coords
  // coords are top-left (x,y), top-right (x2,y), bottom-right (x2,y2), bottom-left (x,y2)
  path.attr("d", `M ${selectionPathCoords.x},${selectionPathCoords.y} L ${selectionPathCoords.x2},${selectionPathCoords.y} ${selectionPathCoords.x2},${selectionPathCoords.y2} ${selectionPathCoords.x},${selectionPathCoords.y2} Z`).show().stroke({ color: "#1a73e8", width: 1 }).fill("none").css("pointer-events", "none")
  
  eleBboxMM = {
    x: typeof selectionBbox.x === "number" ? convertToMM(selectionBbox.x) : selectionBbox.x,
    y: typeof selectionBbox.y === "number" ? convertToMM(selectionBbox.y) : selectionBbox.y,
    x2: typeof selectionBbox.x2 === "number" ? convertToMM(selectionBbox.x2) : selectionBbox.x2,
    y2: typeof selectionBbox.y2 === "number" ? convertToMM(selectionBbox.y2) : selectionBbox.y2,
    width: typeof selectionBbox.width === "number" ? convertToMM(selectionBbox.width) : selectionBbox.width,
    height: typeof selectionBbox.height === "number" ? convertToMM(selectionBbox.height) : selectionBbox.height,
    cx: typeof selectionBbox.cx === "number" ? convertToMM(selectionBbox.cx) : selectionBbox.cx,
    cy: typeof selectionBbox.cy === "number" ? convertToMM(selectionBbox.cy) : selectionBbox.cy,
  }

  return {
    selectionBbox: eleBboxMM,
    tempSelectedElements: convertedElements,
    selectionAttributes: selectionAttributes,
  }
}

const hideSelectionPath = (path) => {
  path.attr("d", "").hide()
}

const setCanvasState = (state, action) => {
  switch (action.type) {
    case 'init':
      {log("initializing canvas...")
      // create the canvas object
      const { canvas, parent, margins, position } = action
      const doesSelectionGroupExist = parent.findOne("#selection-group")

      if (doesSelectionGroupExist) {
        doesSelectionGroupExist.remove()
      }

      if (state.selectedElements) {
        state.selectedElements.forEach(ele => ele.attr({ 'data-selected': null}))
      }

      // create a group object to hold the selected elements (selection)
      const selection = parent.group().attr("id", "selection-group")
      const bbox = selection.bbox()
      // create a path object to display the selection "box"
      const selectionPath = selection.path(``).attr("id", "selection-path").hide()

      return {
        ...state,
        margins: margins,
        position: position,
        canvas: canvas,
        selection: selection,
        selectionPath: selectionPath,
        selectedElements: null,
        selectionBbox: bbox,
      }}
    // when user is dragging mouse to select elements
    case 'change-selection':
      log("changing selection...")
      let results = {}
      // move the selection group to the appropriate coordinates
      state.selection.transform({ translate: [state.position.x, state.position.y] })

      // toggle "data-selected" attribute
      action.newlyDeselectedElements.forEach(element => element.removeAttribute('data-selected'))
      action.newlySelectedElements.forEach(element => {
        if (element.getAttribute("id") !== "selection-path") {
          element.setAttribute('data-selected', '')
        }
      })

      // if there are selected elements, parse them to create the selection box and attributes for designbar
      if (action.selectedElements.length > 0) {
        // if there is a hoveredElement that means the user has their cursor on an element
        // make the element draggable
        if (state.hoveredElement) {
          const dragElement = state.hoveredElement.draggable()
          // attach draggable to the hovered element
          // fires even if the element was not dragged (aka "clicked" - when mouse is up)
          dragElement.on("dragend", e => {
            console.log("drag end")
            // remove draggable on drag end
            state.hoveredElement.draggable(false)
          })

          dragElement.on("dragmove", e => {
            // we need a custom selector to select the element that is being dragged
            // and create a selection box around it afterwards
            console.log(e)
          })
        }
        else {
          results = parseSelection(action.selectedElements, state.selectionPath)

          return {
            ...state,
            selectionAttributes: results.selectionAttributes,
            selectionBbox: results.selectionBbox,
            tempSelectedElements: results.tempSelectedElements,
            mode: "select",
          }
        }
      }
      else {
        hideSelectionPath(state.selectionPath)

        return state
      }
    case 'select':
      {
        log("selecting elements and saving them to state...")

        return {
          ...state,
          selectedElements: state.tempSelectedElements,
          tempSelectedElements: null,
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
    case 'remove-selection':
      log("removing selection...")

      return {
        ...state,
        selectedElements: null,
      }
    case 'ungroup-selection':
      log("ungrouping selection...")

      // clear the selection path and hide it
      hideSelectionPath(state.selectionPath)

      if (state.selectedElements) {
        // clear "data-selected" attribute from all selected elements
        state.selectedElements.forEach(ele => ele.attr({ 'data-selected': null }))
      }

      return {
        ...state,
        selectedElements: null,
        tempSelectedElements: null,
        selectionBbox: null,
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
      console.log(action.hoveredElement)

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

        // save it to state
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