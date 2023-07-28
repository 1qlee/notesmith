import React, { useEffect, createContext, useContext, useReducer } from "react"
import { SVG as svgJs } from "@svgdotjs/svg.js"
import { convertFloatFixed } from "../../../styles/variables"

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
}

const EditorContext = createContext(null);
const EditorDispatchContext = createContext(null);

export function EditorProvider({ bookDimensions, children, setSelectedPageSvg, setPageData, pageData }) {
  const [canvasState, dispatch] = useReducer(setCanvasState, { ...initialState, bookWidth: bookDimensions.width, bookHeight: bookDimensions.height })

  useEffect(() => {
    const deleteElements = (e) => {
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

const setCanvasState = (state, action) => {
  switch (action.type) {
    case 'init':
      log("initializing canvas...")
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
      }
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

      // extract bbox coords from the first and last selected elements
      const firstSelectedEle = svgJs(action.selectedElements[0])
      const firstBbox = firstSelectedEle.bbox()
      let coords = {
        x1: convertFloatFixed(firstBbox.x, 3),
        y1: convertFloatFixed(firstBbox.y, 3),
        x2: convertFloatFixed(firstBbox.x2, 3),
        y2: convertFloatFixed(firstBbox.y2, 3),
      }

      action.selectedElements.forEach(ele => {
        const convertedEle = svgJs(ele)
        const bbox = convertedEle.bbox()

        if (bbox.x < coords.x1) {
          coords.x1 = bbox.x;
        }
        if (bbox.y < coords.y1) {
          coords.y1 = bbox.y;
        }
        if (bbox.x2 > coords.x2) {
          coords.x2 = bbox.x2;
        }
        if (bbox.y2 > coords.y2) {
          coords.y2 = bbox.y2;
        }
      })
      // coords are top-left (x1,y1), top-right (x2,y1), bottom-right (x2,y2), bottom-left (x1,y2)
      
      state.selectionPath.attr("d", `M ${coords.x1}, ${coords.y1} L ${coords.x2}, ${coords.y1} ${coords.x2}, ${coords.y2} ${coords.x1}, ${coords.y2} Z`).show().stroke({ color: "#1a73e8", width: 1 }).fill("none")
      
      return {
        ...state,
      }
    case 'select':
      log("selecting elements: ")

      const selectedElementsConverted = action.selectedElements.map(ele => svgJs(ele))

      return {
        ...state,
        selectedElements: selectedElementsConverted,
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
        ...state
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