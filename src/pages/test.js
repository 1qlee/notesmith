import React, { useEffect, useState } from "react"
import Nav from "../../unused/navie"

const Test = () => {
  const [showNav, setShowNav] = useState(false)
  const [shit, setShit] = useState({})

  useEffect(() => {

  }, [shit])

  return (
    <div>
      <h1>Homepage</h1>
      <h2>{Math.random(1)}</h2>
      <button onClick={() => setShowNav(true)}>homepage show nav</button>
      <Nav showNav={showNav} />
    </div>
  )
}

export default Test
