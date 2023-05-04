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
  z-index: 99;
  transition: width 0.2s ease-in-out;
`

function Progress({
  width,
  height,
  margin,
  completion,
  wrappercolor,
  barcolor,
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
      />
    </ProgressWrapper>
  )
}

export default Progress
