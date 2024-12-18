import { useCallback, useRef } from 'react'

function useRefCallback(cb, clean) {
  const ref = useRef(null)
  const setRef = useCallback(node => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
      console.log(ref.current)
    }

    if (node) {
      console.log(node)
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
    }

    // Save a reference to the node
    ref.current = node
  }, [])

  return [setRef]
}

export default useRefCallback