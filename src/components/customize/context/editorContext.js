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
  selectionBox: {},
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
        selectionBox: bbox,
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

      // coords will hold bbox properties
      let coords = {
        x: 0,
        y: 0,
        x2: 0,
        y2: 0,
      }

      // loop through selected elements and get the coords of the bbox
      // in this process, we convert the elements to svg.js objects so we should re-save them to state
      const convertedSelectedElements = []

      // for each selected element, get the bbox and find its bbox
      action.selectedElements.forEach((ele, index) => {
        // convert to svg.js object
        const convertedEle = svgJs(ele)
        // push into dummy array so we can save to state later
        convertedSelectedElements.push(convertedEle)
        const bbox = convertedEle.bbox()

        // set initial coords using the first element
        if (index === 0) {
          coords = {
            x: bbox.x,
            y: bbox.y,
            x2: bbox.x2,
            y2: bbox.y2,
          }
        }

        // find min-max coord values for the selection box
        if (bbox.x < coords.x) {
          coords.x = convertFloatFixed(bbox.x, 3);
        }
        if (bbox.y < coords.y) {
          coords.y = convertFloatFixed(bbox.y, 3);
        }
        if (bbox.x2 > coords.x2) {
          coords.x2 = convertFloatFixed(bbox.x2, 3);
        }
        if (bbox.y2 > coords.y2) {
          coords.y2 = convertFloatFixed(bbox.y2, 3);
        }
      })
      
      // create the selection path based on coords
      // coords are top-left (x,y), top-right (x2,y), bottom-right (x2,y2), bottom-left (x,y2)
      state.selectionPath.attr("d", `M ${coords.x}, ${coords.y} L ${coords.x2}, ${coords.y} ${coords.x2}, ${coords.y2} ${coords.x}, ${coords.y2} Z`).show().stroke({ color: "#1a73e8", width: 1 }).fill("none")

      // get the bbox of the selection so we can set it to state
      // we need this value in designbar to allow input changes
      const selectedElementsBbox = state.selection.bbox()
      const convertedBbox = {
        x: convertFloatFixed(selectedElementsBbox.x, 3),
        y: convertFloatFixed(selectedElementsBbox.y, 3),
        x2: convertFloatFixed(selectedElementsBbox.x2, 3),
        y2: convertFloatFixed(selectedElementsBbox.y2, 3),
        height: convertFloatFixed(selectedElementsBbox.height, 3),
        width: convertFloatFixed(selectedElementsBbox.width, 3),
        cx: convertFloatFixed(selectedElementsBbox.cx, 3),
        cy: convertFloatFixed(selectedElementsBbox.cy, 3),
        h: convertFloatFixed(selectedElementsBbox.h, 3),
        w: convertFloatFixed(selectedElementsBbox.w, 3),
      }
      
      return {
        ...state,
        tempSelectedElements: convertedSelectedElements,
        selectionBox: convertedBbox,
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
        // store new bbox coords
        let coords = {
          x: 0,
          y: 0,
          x2: 0,
          y2: 0,
        }

        // loop through selected elements and perform mutation
        // then get the bbox of the newly mutated element and find the new selection bbox
        state.selectedElements.forEach((ele, index) => {
          if (index === 0) {
            const bbox = ele.bbox()
            coords = {
              x: bbox.x,
              y: bbox.y,
              x2: bbox.x2,
              y2: bbox.y2,
            }
          }
          
          // get bbox of element after mutation
          const bbox = ele.bbox()

          if (bbox.x < coords.x) {
            coords.x = convertFloatFixed(bbox.x, 3);
          }
          if (bbox.y < coords.y) {
            coords.y = convertFloatFixed(bbox.y, 3);
          }
          if (bbox.x2 > coords.x2) {
            coords.x2 = convertFloatFixed(bbox.x2, 3);
          }
          if (bbox.y2 > coords.y2) {
            coords.y2 = convertFloatFixed(bbox.y2, 3);
          }
        })

        // draw a new selection path
        state.selectionPath.attr("d", `M ${coords.x}, ${coords.y} L ${coords.x2}, ${coords.y} ${coords.x2}, ${coords.y2} ${coords.x}, ${coords.y2} Z`).show().stroke({ color: "#1a73e8", width: 1 }).fill("none")

        const selectedElementsBbox = state.selection.bbox()
        const convertedBbox = {
          x: convertFloatFixed(selectedElementsBbox.x, 3),
          y: convertFloatFixed(selectedElementsBbox.y, 3),
          x2: convertFloatFixed(selectedElementsBbox.x2, 3),
          y2: convertFloatFixed(selectedElementsBbox.y2, 3),
          height: convertFloatFixed(selectedElementsBbox.height, 3),
          width: convertFloatFixed(selectedElementsBbox.width, 3),
          cx: convertFloatFixed(selectedElementsBbox.cx, 3),
          cy: convertFloatFixed(selectedElementsBbox.cy, 3),
          h: convertFloatFixed(selectedElementsBbox.h, 3),
          w: convertFloatFixed(selectedElementsBbox.w, 3),
        }

        return {
          ...state,
          selectionBox: convertedBbox,
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
        selectionBox: null,
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