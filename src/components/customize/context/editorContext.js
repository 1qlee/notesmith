import React, { useEffect, createContext, useContext, useReducer } from "react"
import * as d3 from "d3"

import { parseSelection } from "../editor/editor-functions"

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
    case "ungroup-selection": {
      log("ungrouping all selections...")

      const { selectedElements, canvas } = state

      d3.selectAll("[data-selected]").attr("data-selected", null)
      
      // if we already have a selection group that means elements are currently selected
      if (selectedElements && selectedElements.length > 0) {
        const selectionGroup = d3.select("#selection-group")
        const nextNode = d3.select("#selection-group").node().nextSibling
        const groupedElements = Array.from(d3.select("#selection-group").node().children)

        groupedElements.forEach(ele => {
          canvas.insertBefore(ele, nextNode)
        })

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
    case "parse-selection": {
      log("parsing selection...")

      const results = parseSelection(state.selectedElements)
      const { selectionBbox, selectionAttributes, selectionPath } = results

      return {
        ...state,
        selectionBbox: selectionBbox,
        selectionAttributes: selectionAttributes,
        selectionPath: selectionPath,
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
    case "bulk-update":
      log(`bulk updating state...`)

      return {
        ...state,
        ...action.state,
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