import React, { useState } from "react"

const StepContext = React.createContext()

function StepProvider(props) {
  const [activeStepItem, setActiveStepItem] = useState("1")

  return (
    <StepContext.Provider value={{
        activeStepItem,
        setActiveStepItem
      }}
    >
      {props.children}
    </StepContext.Provider>
  )
}

export default StepContext
export { StepProvider }
