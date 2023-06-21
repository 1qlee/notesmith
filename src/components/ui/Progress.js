import React from "react"
import styled from "styled-components"

const ProgressWrapper = styled.div`
  width: ${props => props.width || "100%"};
  height: ${props => props.height || "8px"};
  margin: ${props => props.margin || "0 0 0.5rem"};
  background-color: ${props => props.wrappercolor};
  border-radius: 0.25rem;
  position: relative;
`

const ProgressBar = styled.div`
  height: 100%;
  background-color: ${props => props.barcolor};
  border-radius: 0.25rem;
  transition: ${props => props.animate && "width 100ms"};
  z-index: 99;
`

function Progress({
  width,
  height,
  margin,
  completion,
  wrappercolor,
  barcolor,
  animate,
}) {
  return (
    <ProgressWrapper
      width={width}
      height={height}
      margin={margin}
      wrappercolor={wrappercolor}
    >
      <ProgressBar
        style={{
          width: `${completion}%`
        }}
        barcolor={barcolor}
        animate={animate}
      />
    </ProgressWrapper>
  )
}

export default Progress
