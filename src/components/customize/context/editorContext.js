import React, { createContext, useContext, useReducer } from "react"

const initialState = {
  canvas: null,
  context: null,
  layerName: '',
  mode: 'select',
  multiselected: false,
  selectedElements: null,
  selectedGroup: null,
  updated: false,
  zoom: 100,
}

const EditorContext = createContext(null);
const EditorDispatchContext = createContext(null);

export function EditorProvider({ children }) {
  const [pageData, dispatch] = useReducer(setCanvasState, initialState)

  return (
    <EditorContext.Provider value={pageData}>
      <EditorDispatchContext.Provider value={dispatch}>
        {children}
      </EditorDispatchContext.Provider>
    </EditorContext.Provider>
  );
}

const setCanvasState = (state, action) => {
  switch (action.type) {
    case 'init':
      console.log("init: ", action.canvas)
      return {
        ...state,
        canvas: action.canvas,
      }
    case 'select':
      console.log("selecting elements: ", action.selectedElements)
      // create an svg group to temporarily contain the selected elements
      const group = state.canvas.group().attr("id", "selected-group")

      action.selectedElements.forEach(element => {
        group.add(element)
      })
      
      console.log("grouping elements: ", group)
      
      return {
        ...state,
        selectedElements: action.selectedElements,
        selectedGroup: group,
      }
    case 'ungroup-selection':
      console.log(state)
      console.log("ungrouping elements: ", action.id)
      // find the group by id
      const findGroup = state.canvas.findOne(`#${action.id}`)
      // ungroup the selected elements
      if (state.selectedGroup) {
        console.log(state.selectedGroup)
        state.selectedGroup.ungroup()
      }

      return {
        ...state,
        selectedGroup: null,
      }
    case 'remove':
      return state.filter((_, index) => index !== action.index);
    case 'update':
      return state.map((task, index) => {
        if (index === action.index) {
          return { ...task, ...action.task };
        }
        return task;
      });
    default:
      return state;
  }
}

export function useEditorContext() {
  return useContext(EditorContext)
}

export function useEditorDispatch() {
  return useContext(EditorDispatchContext)
}