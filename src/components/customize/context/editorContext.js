import React, { useEffect, createContext, useContext, useReducer } from "react"
import { SVG as svgJs } from "@svgdotjs/svg.js"

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

export function EditorProvider({ bookDimensions, children }) {
  const [canvasState, dispatch] = useReducer(setCanvasState, { ...initialState, bookWidth: bookDimensions.width, bookHeight: bookDimensions.height })

  useEffect(() => {
    const deleteElements = (e) => {
      console.log(e)
      // if key pressed is delete or backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        console.log(canvasState.selection)
      }
    }

    document.addEventListener("keydown", deleteElements)

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
      const canvas = svgJs(action.canvas)
      console.log(canvas)
      // create a group object to hold the selected elements (selection)
      const selection = canvas.group().attr("id", "selection-group")
      const selectionPath = selection.path(``).attr("id", "selection-path")

      return {
        ...state,
        canvas: canvas,
        selection: selection,
        selectionPath: selectionPath,
      }
    case 'change-selection':
      // add the selected elements to the selection group
      action.selectedElements.forEach(element => {
        state.selection.add(element)
      })

      const rbox = state.selection.rbox(state.canvas)
      console.log(rbox)

      // state.selectionPath.attr("d", `M ${selPathBox.x} L776.9484252929688,393.39801025390625 776.9484252929688,594 106.61907958984375,594z`)

      return {
        ...state
      }
    case 'select':
      log("selecting elements: ", action.selectedElements)
      
      return {
        ...state,
        selectedElements: action.selectedElements,
      }
    case 'ungroup-selection':
      log("ungrouping selection...")

      if (state.selection.children().length > 1) {
        log("ungrouping selection...")
        // ungroup the selected elements
        state.selection.ungroup()

        // create a new selection group
        const newSelectionGroup = state.canvas.group().attr("id", "selection-group")
        // add the selection path to the new selection group
        const newSelectionPath = state.canvas.findOne("#selection-path").addTo(newSelectionGroup)

        return {
          ...state,
          selection: newSelectionGroup,
          selectionPath: newSelectionPath,
        }
      }

      return {
        ...state,
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