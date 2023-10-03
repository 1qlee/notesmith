import React from 'react'
import ReactDOM from 'react-dom'

export default function InPortal({ node, children }) {
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return ReactDOM.createPortal(
    children,
    node
  )
}