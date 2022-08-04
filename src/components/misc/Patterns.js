import React from "react"

function Patterns({
  color
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="0" height="0" style={{ contain: "strict", position: "absolute",}}>
      <defs>
        <pattern id="pattern-1" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-10" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M2,0 l0,4 M0,2 l4,0" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-11" patternUnits="userSpaceOnUse" width="6" height="6">
          <path d="M3,0 l0,6 M0,3 l6,0" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-12" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M4,0 l0,8 M0,4 l8,0" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-13" patternUnits="userSpaceOnUse" width="12" height="12">
          <path d="M6,0 l0,12 M0,6 l12,0" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-14" patternUnits="userSpaceOnUse" width="6" height="6">
          <path d="M-1,5 l2,2 M5,7 l2,-2" style={{ stroke: color }} fill="none"></path>
          <polyline points="0,0 3,3 6,0" style={{ stroke: color }} fill="none"></polyline>
        </pattern><pattern id="pattern-15" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M-1,7 l2,2 M7,9 l2,-2" style={{ stroke: color }} fill="none"></path>
          <polyline points="0,0 4,4 8,0" style={{ stroke: color }} fill="none"></polyline>
        </pattern><pattern id="pattern-16" patternUnits="userSpaceOnUse" width="12" height="12">
          <path d="M-1,11 l2,2 M11,13 l2,-2" style={{ stroke: color }} fill="none"></path>
          <polyline points="0,0 6,6 12,0" style={{ stroke: color }} fill="none"></polyline>
        </pattern><pattern id="pattern-17" patternUnits="userSpaceOnUse" width="8" height="8">
          <circle cx="4" cy="4" r="2" style={{ stroke: color }} fill="none"></circle>
        </pattern><pattern id="pattern-18" patternUnits="userSpaceOnUse" width="12" height="12">
          <circle cx="6" cy="6" r="3" style={{ stroke: color }} fill="none"></circle>
        </pattern><pattern id="pattern-19" patternUnits="userSpaceOnUse" width="16" height="16">
          <circle cx="8" cy="8" r="4" style={{ stroke: color }} fill="none"></circle>
        </pattern><pattern id="pattern-2" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M0,0 l4,4
             M-1,3 l2,2
             M3,-1 l2,2" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-20" patternUnits="userSpaceOnUse" width="12" height="12">
          <circle cx="0" cy="6" r="2" style={{ stroke: color }} fill="none"></circle>
          <circle cx="12" cy="6" r="2" style={{ stroke: color }} fill="none"></circle>
          <circle cx="6" cy="0" r="2" style={{ stroke: color }} fill="none"></circle>
          <circle cx="6" cy="12" r="2" style={{ stroke: color }} fill="none"></circle>
        </pattern><pattern id="pattern-21" patternUnits="userSpaceOnUse" width="16" height="16">
          <circle cx="0" cy="8" r="3" style={{ stroke: color }} fill="none"></circle>
          <circle cx="16" cy="8" r="3" style={{ stroke: color }} fill="none"></circle>
          <circle cx="8" cy="0" r="3" style={{ stroke: color }} fill="none"></circle>
          <circle cx="8" cy="16" r="3" style={{ stroke: color }} fill="none"></circle>
        </pattern><pattern id="pattern-22" patternUnits="userSpaceOnUse" width="24" height="24">
          <circle cx="0" cy="12" r="4" style={{ stroke: color }} fill="none"></circle>
          <circle cx="24" cy="12" r="4" style={{ stroke: color }} fill="none"></circle>
          <circle cx="12" cy="0" r="4" style={{ stroke: color }} fill="none"></circle>
          <circle cx="12" cy="24" r="4" style={{ stroke: color }} fill="none"></circle>
        </pattern><pattern id="pattern-23" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="2" height="2" x="0" y="0" fill={color} style={{ fill: color }}></rect>
        </pattern><pattern id="pattern-24" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="2" height="2" x="0" y="0" fill={color} style={{ fill: color }}></rect>
        </pattern><pattern id="pattern-25" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="2" height="2" x="0" y="0" fill={color} style={{ fill: color }}></rect>
        </pattern><pattern id="pattern-26" patternUnits="userSpaceOnUse" width="12" height="12">
          <rect width="2" height="2" x="0" y="0" fill={color} style={{ fill: color }}></rect>
        </pattern><pattern id="pattern-27" patternUnits="userSpaceOnUse" width="6" height="6">
          <path d="M2,2 l2,0 l0,2 l-2,0 l0,-2 M0,0 l1,0 l0,1 l-1,0 l0,-1 M5,0 l1,0 l0,1 l-1,0 l0,-1 M0,5 l1,0 l0,1 l-1,0 l0,-1 M5,5 l1,0 l0,1 l-1,0 l0,-1" fill={color} style={{ fill: color }}></path>
        </pattern><pattern id="pattern-28" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M3,3 l2,0 l0,2 l-2,0 l0,-2 M0,0 l1,0 l0,1 l-1,0 l0,-1 M7,0 l1,0 l0,1 l-1,0 l0,-1 M0,7 l1,0 l0,1 l-1,0 l0,-1 M7,7 l1,0 l0,1 l-1,0 l0,-1" fill={color} style={{ fill: color }}></path>
        </pattern><pattern id="pattern-29" patternUnits="userSpaceOnUse" width="12" height="12">
          <path d="M5,5 l2,0 l0,2 l-2,0 l0,-2 M0,0 l1,0 l0,1 l-1,0 l0,-1 M11,0 l1,0 l0,1 l-1,0 l0,-1 M0,11 l1,0 l0,1 l-1,0 l0,-1 M11,11 l1,0 l0,1 l-1,0 l0,-1" fill={color} style={{ fill: color }}></path>
        </pattern><pattern id="pattern-3" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M-1,1 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-30" patternUnits="userSpaceOnUse" width="16" height="16">
          <path d="M7,7 l2,0 l0,2 l-2,0 l0,-2 M0,0 l1,0 l0,1 l-1,0 l0,-1 M15,0 l1,0 l0,1 l-1,0 l0,-1 M0,15 l1,0 l0,1 l-1,0 l0,-1 M15,15 l1,0 l0,1 l-1,0 l0,-1" fill={color} style={{ fill: color }}></path>
        </pattern><pattern id="pattern-31" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="1" fill={color} style={{ fill: color }}></circle>
        </pattern><pattern id="pattern-32" patternUnits="userSpaceOnUse" width="6" height="6">
          <circle cx="3" cy="3" r="1" fill={color} style={{ fill: color }}></circle>
        </pattern><pattern id="pattern-33" patternUnits="userSpaceOnUse" width="8" height="8">
          <circle cx="4" cy="4" r="1" fill={color} style={{ fill: color }}></circle>
        </pattern><pattern id="pattern-34" patternUnits="userSpaceOnUse" width="30" height="30">
          <circle cx="6" cy="6" r="3" fill={color} style={{ fill: color }}></circle>
        </pattern><pattern id="pattern-35" patternUnits="userSpaceOnUse" width="6" height="6">
          <circle cx="0" cy="0" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="0" cy="6" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="6" cy="6" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="6" cy="0" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="3" cy="3" r="1" fill={color} style={{ fill: color }}></circle>
        </pattern><pattern id="pattern-36" patternUnits="userSpaceOnUse" width="8" height="8">
          <circle cx="0" cy="0" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="0" cy="8" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="8" cy="8" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="8" cy="0" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="4" cy="4" r="1" fill={color} style={{ fill: color }}></circle>
        </pattern><pattern id="pattern-37" patternUnits="userSpaceOnUse" width="12" height="12">
          <circle cx="0" cy="0" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="0" cy="12" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="12" cy="12" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="12" cy="0" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="6" cy="6" r="1" fill={color} style={{ fill: color }}></circle>
        </pattern><pattern id="pattern-38" patternUnits="userSpaceOnUse" width="16" height="16">
          <circle cx="0" cy="0" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="0" cy="16" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="16" cy="16" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="16" cy="0" r="1" fill={color} style={{ fill: color }}></circle>
          <circle cx="8" cy="8" r="1" fill={color} style={{ fill: color }}></circle>
        </pattern><pattern id="pattern-39" patternUnits="userSpaceOnUse" width="6" height="6">
          <path d="M5,-1 l2,2 M5,7 l2,-2" style={{ stroke: color }} fill="none"></path>
          <polyline points="0,0 3,3 0,6" style={{ stroke: color }} fill="none"></polyline>
        </pattern><pattern id="pattern-4" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M0,0 l8,8
             M-1,7 l4,4
             M7,-1 l4,4" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-40" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M7,-1 l2,2 M7,9 l2,-2" style={{ stroke: color }} fill="none"></path>
          <polyline points="0,0 4,4 0,8" style={{ stroke: color }} fill="none"></polyline>
        </pattern><pattern id="pattern-41" patternUnits="userSpaceOnUse" width="12" height="12">
          <path d="M11,-1 l2,2 M11,13 l2,-2" style={{ stroke: color }} fill="none"></path>
          <polyline points="0,0 6,6 0,12" style={{ stroke: color }} fill="none"></polyline>
        </pattern><pattern id="pattern-5" patternUnits="userSpaceOnUse" width="6" height="6">
          <path d="M-1,1 l2,-2 M0,6 l6,-6 M5,7 l2,-2" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-6" patternUnits="userSpaceOnUse" width="6" height="6">
          <path d="M7,1 l-2,-2 M0,0 l6,6 M1,7 l-2,-2" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-7" patternUnits="userSpaceOnUse" width="6" height="6">
          <path d="M0,0 l6,6 M6,0 l-6,6" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-8" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M0,0 l8,8
             M8,0 l-8,8" stroke={color} style={{ stroke: color }}></path>
        </pattern><pattern id="pattern-9" patternUnits="userSpaceOnUse" width="12" height="12">
          <path d="M0,0 l12,12 M12,0 l-12,12" stroke={color} style={{ stroke: color }}></path>
        </pattern>
      </defs>
    </svg>
  )
}

function Pattern({
  color,
  height,
  left,
  pattern,
  top,
  width,
  zindex,
}) {
  return (
    <>
      <Patterns 
        color={color}
      />
      <svg 
        class="pattern_svg" 
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: top,
          left: left,
          zIndex: zindex,
        }}
      >
        <rect 
          height={height}
          width={width}
          fill={`url(#${pattern})`}
        />
      </svg>
    </>
  )
}

export default Pattern