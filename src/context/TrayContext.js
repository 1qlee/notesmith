import React, { useState } from "react"

const TrayContext = React.createContext()

function TrayProvider(props) {
  const [activeTrayItem, setActiveTrayItem] = useState("0")

  return (
    <TrayContext.Provider value={{
        activeTrayItem,
        setActiveTrayItem
      }}
    >
      {props.children}
    </TrayContext.Provider>
  )
}

export default TrayContext
export { TrayProvider }
