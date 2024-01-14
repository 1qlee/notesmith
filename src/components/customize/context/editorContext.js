import React, { useEffect, createContext, useContext, useReducer } from "react"
import * as d3 from "d3"
import { SVG } from '@svgdotjs/svg.js'
import '../editor/helpers/svg.drag.js'
import '../editor/helpers/svg.select.js'
import '../editor/helpers/svg.resize.js'

import { parseSelection } from "../editor/editor-functions"
import Toastify from "../../ui/Toastify";

const initialState = {
  canvas: null,
  context: null,
  deletionAllowed: true,
  hoveredElement: null,
  layerName: '',
  lastNode: null,
  mode: 'select',
  multiselected: false,
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

export function EditorProvider({ bookDimensions, children, setSelectedPageSvg }) {
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
      <Toastify />
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

      d3.selectAll("[data-selected]").attr("data-selected", null)
      d3.selectAll("[data-hovered]").attr("data-hovered", null)

      return {
        ...state,
        canvas: null,
        mode: "select",
        selectedElements: [],
        selectionBbox: {},
        selectionPath: "",
      }
    case "change-selection": {
      log("changing selection...")
      const { newlyDeselectedElements, newlySelectedElements, selectedElements } = action
      const numOfElements = selectedElements.length

      // remove data-selected from newly deselected elements
      if (newlyDeselectedElements && newlyDeselectedElements.length > 0) {
        newlyDeselectedElements.forEach(element => {
          SVG(element).attr("data-selected", null)
        })
      }

      // add data-selected to newly selected elements
      newlySelectedElements.forEach((element) => {
        const node = SVG(element)
        const nodeId = node.attr("id")

        if (nodeId !== "hover-clone") {
          node.attr('data-selected', '')
          // SVG(element).selectize().resize()
        }
      })

      // if there are selected elements, parse them to create the selection box and attributes for designbar
      if (numOfElements > 0) {
        const results = parseSelection(selectedElements)
        const { selectionBbox, selectionAttributes, selectionPath, selectionGroup } = results

        return {
          ...state,
          selectedElements: selectedElements,
          selectionAttributes: selectionAttributes,
          selectionBbox: selectionBbox,
          selectionPath: selectionPath,
          selectionGroup: selectionGroup,
        }
      }
      else {
        d3.selectAll("[data-selected]").attr("data-selected", null)

        return {
          ...state,
          selectedElements: [],
          selectionAttributes: [],
          selectionBbox: {},
          selectionPath: "",
          selectionGroup: null,
        }
      }
    }
    case "ungroup-selection": {
      log("ungrouping all selections...")

      d3.selectAll("[data-selected]").attr("data-selected", null)

      return {
        ...state,
        selectedElements: [],
        selectionAttributes: [],
        selectionBbox: {},
        selectionPath: "",
        selectionGroup: null,
      }
    }
    case "parse-selection": {
      log("parsing selection...")

      const results = parseSelection(state.selectedElements)
      const { selectionBbox, selectionAttributes, selectionPath } = results

      return {
        ...state,
        selecting: false,
        selectionBbox: selectionBbox,
        selectionAttributes: selectionAttributes,
        selectionPath: selectionPath,
      }
    }
    case "toggle":
      log(`toggling setting: ${action.setting} to ${action.value}...`)

      return {
        ...state,
        [action.setting]: action.value,
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