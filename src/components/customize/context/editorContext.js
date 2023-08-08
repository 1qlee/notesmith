import React, { useEffect, createContext, useContext, useReducer } from "react"
import { SVG as svgJs } from "@svgdotjs/svg.js"
import { convertFloatFixed } from "../../../styles/variables"
import { compareObjects } from "../../../utils/helper-functions"

const initialState = {
  canvas: null,
  context: null,
  layerName: '',
  mode: 'select',
  multiselected: false,
  selectedElements: null,
  selection: null,
  updated: false,
  zoom: 100,
  selectionBbox: {},
}

const EditorContext = createContext(null);
const EditorDispatchContext = createContext(null);

export function EditorProvider({ bookDimensions, children, setSelectedPageSvg, setPageData, pageData }) {
  const [canvasState, dispatch] = useReducer(setCanvasState, { ...initialState, bookWidth: bookDimensions.width, bookHeight: bookDimensions.height })

  useEffect(() => {
    const deleteElements = (e) => {
      // don't delete elements if the user is typing into an input
      if (!document.hasFocus()) {
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
    <EditorContext.Provider value={canvasState}>
      <EditorDispatchContext.Provider value={dispatch}>
        {children}
      </EditorDispatchContext.Provider>
    </EditorContext.Provider>
  );
}

const createSelectionBbox = (elements, path) => {
  // coords for the selection path box
  let selectionPathCoords = {}
  // selection bbox properties
  let selectionBbox = {}

  // loop through selected elements and get the coords of the bbox
  // in this process, we convert the elements to svg.js objects so we should re-save them to state
  const convertedElements = []

  // for each selected element, get the bbox and find its bbox
  elements.forEach((ele, index) => {
    // convert to svg.js object
    const convertedEle = svgJs(ele)
    // push into dummy array so we can save to state later
    convertedElements.push(convertedEle)
    const currentEleBbox = convertedEle.bbox()
    const convertedEleBbox = {
      x: convertFloatFixed(currentEleBbox.x, 3),
      y: convertFloatFixed(currentEleBbox.y, 3),
      x2: convertFloatFixed(currentEleBbox.x2, 3),
      y2: convertFloatFixed(currentEleBbox.y2, 3),
      width: convertFloatFixed(currentEleBbox.width, 3),
      height: convertFloatFixed(currentEleBbox.height, 3),
      cx: convertFloatFixed(currentEleBbox.cx, 3),
      cy: convertFloatFixed(currentEleBbox.cy, 3),
    }
    
    // set initial coords using the first element
    if (index === 0) {
      selectionPathCoords = {
        x: convertedEleBbox.x,
        y: convertedEleBbox.y,
        x2: convertedEleBbox.x2,
        y2: convertedEleBbox.y2,
      }
      selectionBbox = convertedEleBbox
    }
    
    selectionBbox = compareObjects(convertedEleBbox, selectionBbox)

    // find min-max coord values for the selection box
    if (convertedEleBbox.x < selectionPathCoords.x) {
      selectionPathCoords.x = convertedEleBbox.x;
    }
    if (convertedEleBbox.y < selectionPathCoords.y) {
      selectionPathCoords.y = convertedEleBbox.y;
    }
    if (convertedEleBbox.x2 > selectionPathCoords.x2) {
      selectionPathCoords.x2 = convertedEleBbox.x2;
    }
    if (convertedEleBbox.y2 > selectionPathCoords.y2) {
      selectionPathCoords.y2 = convertedEleBbox.y2;
    }
  })

  // create the selection path based on coords
  // coords are top-left (x,y), top-right (x2,y), bottom-right (x2,y2), bottom-left (x,y2)
  path.attr("d", `M ${selectionPathCoords.x}, ${selectionPathCoords.y} L ${selectionPathCoords.x2}, ${selectionPathCoords.y} ${selectionPathCoords.x2}, ${selectionPathCoords.y2} ${selectionPathCoords.x}, ${selectionPathCoords.y2} Z`).show().stroke({ color: "#1a73e8", width: 1 }).fill("none")
  
  return {
    selectionBbox: selectionBbox,
    tempSelectedElements: convertedElements,
  }
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
      // move the selection group to the appropriate coordinates
      state.selection.transform({ translate: [state.position.x, state.position.y] })

      // toggle "data-selected" attribute
      action.newlyDeselectedElements.forEach(element => element.removeAttribute('data-selected'))
      action.newlySelectedElements.forEach(element => {
        if (element.getAttribute("id") !== "selection-path") {
          element.setAttribute('data-selected', '')
        }
      })

      const results = createSelectionBbox(action.selectedElements, state.selectionPath)
      const { selectionBbox, tempSelectedElements } = results
      
      return {
        ...state,
        tempSelectedElements: tempSelectedElements,
        selectionBbox: selectionBbox,
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

        const results = createSelectionBbox(state.selectedElements, state.selectionPath)
        const { selectionBbox } = results

        return {
          ...state,
          selectionBobx: selectionBbox,
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
      state.selectionPath.attr("d", "").hide()

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