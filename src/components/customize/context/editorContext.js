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

export function EditorProvider({ bookDimensions, children, setSelectedPageSvg }) {
  const [canvasState, dispatch] = useReducer(setCanvasState, { ...initialState, bookWidth: bookDimensions.width, bookHeight: bookDimensions.height })

  useEffect(() => {
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
      const canvas = action.canvas
      // create a group object to hold the selected elements (selection)
      const selection = canvas.group().attr("id", "selection-group")
      // create a path object to display the selection "box"
      const selectionPath = selection.path(``).attr("id", "selection-path").hide()

      return {
        ...state,
        canvas: canvas,
        selection: selection,
        selectionPath: selectionPath,
      }
    case 'change-selection':
      log("changing selection...")
      let elements = []
      if (state.selection) {
        state.selection.each((index, element) => {
          if (element[index].node.getAttribute("id") !== "selection-path") {
            element[index].toParent(state.canvas)
          }
        })

        state.selectionPath.hide()
      }
      // add the selected elements to the selection group
      action.selectedElements.forEach(element => {
        // don't add the selection path to the selection group
        if (element.getAttribute("id") !== "selection-path") {
          state.selection.add(element)
          elements.push(element)
        }
      })

      let newSelectionPath 

      if (elements.length > 1) {
        const selPathBox = state.selection.bbox()
        newSelectionPath = state.selectionPath.attr("d", `M ${selPathBox.x}, ${selPathBox.y} L${selPathBox.x2}, ${selPathBox.y} ${selPathBox.x2}, ${selPathBox.y2} ${selPathBox.x}, ${selPathBox.y2}z`).show().stroke({ color: "#1a73e8", width: 1 }).fill("none")

        return {
          ...state,
          selectionPath: newSelectionPath,
        }
      }
      else {
        return {
          ...state,
        }
      }
    case 'select':
      log("selecting elements: ", action.selectedElements)

      let finalSelection = []

      action.selectedElements.forEach(element => {
        if (element.getAttribute("id") !== "selection-path") {
          finalSelection.push(element)
        }
      })
      
      return {
        ...state,
        selectedElements: finalSelection,
      }
    case 'ungroup-selection':
      log("ungrouping selection...")
      // ungroup the selected elements
      state.selection.ungroup()

      // create a new selection group
      const replaceSelectionGroup = state.canvas.group().attr("id", "selection-group")
      state.canvas.findOne("#selection-path").remove()
      // add the selection path to the new selection group
      const replaceSelectionPath = replaceSelectionGroup.path(``).attr("id", "selection-path").hide()

      return {
        ...state,
        selection: replaceSelectionGroup,
        selectionPath: replaceSelectionPath,
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