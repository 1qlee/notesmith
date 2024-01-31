import React, { createContext, useContext, useReducer } from "react"

const initialState = {
  view_pages: true,
  view_controls: true,
}

const SettingsContext = createContext(null);
const SettingsDispatchContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settingsState, dispatchSettings] = useReducer(setSettingsState, initialState)

  return (
    <SettingsContext.Provider value={settingsState}>
      <SettingsDispatchContext.Provider value={dispatchSettings}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsContext.Provider>
  )
}

const setSettingsState = (state, action) => {
  switch (action.type) {
    case "toggle":
      return {
        ...state,
        [action.value]: !state[action.value],
      }
  }
}

export function useSettingsDispatch() {
  return useContext(SettingsDispatchContext)
}

export function useSettingsContext() {
  return useContext(SettingsContext)
}