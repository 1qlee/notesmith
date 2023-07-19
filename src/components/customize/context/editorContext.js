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

export function EditorProvider({ bookDimensions, children, setSelectedPageSvg }) {
  const [canvasState, dispatch] = useReducer(setCanvasState, { ...initialState, bookWidth: bookDimensions.width, bookHeight: bookDimensions.height })

  useEffect(() => {
    console.log("render")
    const deleteElements = (e) => {
      // if key pressed is delete or backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        canvasState.selectedElements.forEach(ele => {
          ele.remove()
          canvasState.selectionPath.hide()
        })
      }
    }

    document.addEventListener("keydown", deleteElements)
    if (canvasState.canvas) {
      setSelectedPageSvg(canvasState.canvas.node)
    }

    return () => {
      document.removeEventListener("keydown", deleteElements)
    }
  }, [canvasState.canvas])

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
      }
    // when user is dragging mouse to select elements
    case 'change-selection':
      log("changing selection...")
      state.selection.transform({ translate: [state.margins.left + state.position.x, state.margins.top + state.position.y] })

      let elementPaths = []

      if (state.selection.children()) {
        
      }

      const firstSelectedEle = svgJs(action.selectedElements[0])
      const lastSelectedEle = svgJs(action.selectedElements[action.selectedElements.length - 1])
      const firstBbox = firstSelectedEle.bbox()
      const lastBbox = lastSelectedEle.bbox()
      const coords = {
        x1: convertFloatFixed(firstBbox.x + state.margins.left, 3),
        y1: convertFloatFixed(firstBbox.y + state.margins.top, 3),
        x2: convertFloatFixed(lastBbox.x2 + state.margins.left, 3),
        y2: convertFloatFixed(lastBbox.y + state.margins.top, 3),
      }

      console.log(firstBbox)
      console.log(lastBbox)

      state.selectionPath.attr("d", `M ${coords.x1}, ${coords.y1} L ${coords.x2}, ${coords.y1} L ${coords.x2}, ${coords.y2} L ${coords.x1}, ${coords.y2} Z`).show().stroke({ color: "#1a73e8", width: 1 }).fill("none")
      
      return {
        ...state
      }
    case 'select':
      log("selecting elements: ", action.selectedElements)

      return {
        ...state
      }
    case 'ungroup-selection':
      log("ungrouping selection...")
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