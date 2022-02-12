import React, { useState } from "react"

const Nav = props => {
  const [show, setShow] = useState(false)

  return (
    <>
      {show || props.showNav ? (
        <nav>This is navbar</nav>
      ) : (
        <button onClick={() => setShow(true)}>Show nav</button>
      )}
    </>
  )
}

export default Nav
