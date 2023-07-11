import React, { createContext, useContext, useReducer } from "react"
import { pageMargins } from "../../../styles/variables"

const EditorContext = createContext(null);
const EditorDispatchContext = createContext(null);

export function EditorProvider({ bookData, children }) {
  const initialPageData = {
    alignmentHorizontal: "center",
    alignmentVertical: "top",
    angle: 30,
    ascSpacing: 5,
    borderData: {
      sync: true,
      toggle: true,
      thickness: 0.088,
      opacity: 1,
    },
    columns: 27,
    columnSpacing: 5,
    dashedLineData: {
      sync: true,
      thickness: 0.088,
      opacity: 1,
      dashArray: "2 4 4 2",
      dashOffset: 0,
    },
    dscSpacing: 5,
    hexagonRadius: 1,
    lineWidth: 100,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    maxContentHeight: bookData.heightPixel - pageMargins.vertical,
    maxContentWidth: bookData.widthPixel - pageMargins.horizontal,
    opacity: 1,
    radius: 0.1,
    rows: 42,
    rowSpacing: 5,
    show: false,
    crossSize: 1,
    slantAngle: 55,
    slants: 20,
    slantSpacing: 5,
    spacing: 5,
    staffSpacing: 5,
    staves: 9,
    svgHeight: bookData.heightPixel,
    svgWidth: bookData.widthPixel,
    template: "",
    thickness: 0.088,
    xHeight: 5,
  }
  const [pageData, dispatch] = useReducer(setPageData, initialPageData)

  return (
    <EditorContext.Provider value={pageData}>
      <EditorDispatchContext.Provider value={dispatch}>
        {children}
      </EditorDispatchContext.Provider>
    </EditorContext.Provider>
  );
}

const setPageData = (state, action) => {
  switch (action.type) {
    case 'add':
      return [...state, action.task];
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

export function useEditor() {
  return useContext(EditorContext)
}

export function useEditorDispatch() {
  return useContext(EditorDispatchContext)
}