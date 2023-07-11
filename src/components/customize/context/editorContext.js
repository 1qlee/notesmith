import React, { createContext, useContext, useReducer } from "react"

const initialState = {
  mode: 'select',
  selectedElements: null,
  multiselected: false,
  updated: false,
  zoom: 100,
  context: null,
  layerName: '',
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
    case 'add':
      return [...state, action.task];
    case 'select':
      console.log("selecting: ", action.selectedElements)
      return {
        ...state,
        selectedElement: action.selectedElements,
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