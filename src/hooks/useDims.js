import { useState, useLayoutEffect } from 'react';

function useDims(ref, isSvg = false) {
  const [dim, setDim] = useState({
    height: 0,
    width: 0,
    top: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    if (ref && ref.current) {
      if (isSvg) {
        console.log(ref.current)
        console.log(ref.current.getBoundingClientRect())
        const { height, width, x, y } = ref.current.getBBox();
        console.log(height, width, x, y)
        setDim({
          height,
          width,
          top: y,
          left: x,
        });
      } else {
        setDim({
          height: ref.current.offsetHeight,
          width: ref.current.offsetWidth,
          top: ref.current.offsetTop,
          left: ref.current.offsetLeft,
        });
      }
    }
  }, [ref, isSvg]);

  return dim;
}

export default useDims;