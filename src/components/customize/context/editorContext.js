import React, { useEffect, createContext, useContext, useReducer } from "react"
import { SVG } from '@svgdotjs/svg.js'
import '../editor/helpers/svg.drag.js'
import '../editor/helpers/svg.select.js'
import '../editor/helpers/svg.resize.js'

import { parseSelection } from "../editor/editor-functions"

const initialState = {
  canvas: null,
  context: null,
  deletionAllowed: true,
  dragging: false,
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
  showSettingsMenu: false,
  tool: "select",
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
    </EditorContext.Provider>
  );
}

const setCanvasState = (state, action) => {
  switch (action.type) {
    case "initialize":

      return {
        ...state,
        canvas: action.canvas,
      }
    case "reset":

      return {
        ...state,
        canvas: null,
        mode: "select",
        selectedElements: [],
        selectionBbox: {},
        selectionPath: "",
        deletionAllowed: true,
      }
    case "change-selection": {
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
        SVG("#page-spread").find("[data-selected]").attr("data-selected", null)

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

      SVG("#page-spread").find("[data-selected]").attr("data-selected", null)

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
      const { updates } = action

      return {
        ...state,
        ...updates,
      }
    case "remove":

      return {
        ...state,
        [action.setting]: action.value || null,
      }
    case "bulk-update":

      return {
        ...state,
        ...action.state,
      }
    case "change-mode":
      log(`Changing mode to ${action.mode}`)

      const { mode } = action

      function getTool() {
        switch (mode) {
          case "select":
            return "select"
          case "text":
            return "text"
          case "drag":
            return "select"
          default:
            return "select"
        }
      }

      const tool = getTool()

      return {
        ...state,
        mode: mode,
        tool: tool,
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