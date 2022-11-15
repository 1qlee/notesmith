import React from "react"
import Line1 from "../../assets/underlines/underline-1.svg"
import Line2 from "../../assets/underlines/underline-2.svg"
import Line3 from "../../assets/underlines/underline-3.svg"
import Line4 from "../../assets/underlines/underline-4.svg"
import Line5 from "../../assets/underlines/underline-5.svg"
import Line6 from "../../assets/underlines/underline-6.svg"
import Line7 from "../../assets/underlines/underline-7.svg"
import Line8 from "../../assets/underlines/underline-8.svg"
import Line9 from "../../assets/underlines/underline-9.svg"
import Line10 from "../../assets/underlines/underline-10.svg"

function RandomLine() {
  const randomNum = Math.floor(Math.random() * 10)
  const lineStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    height: "50%"
  }
  const lines = [
    <Line1 style={lineStyle} />,
    <Line2 style={lineStyle} />,
    <Line3 style={lineStyle} />,
    <Line4 style={lineStyle} />,
    <Line5 style={lineStyle} />,
    <Line6 style={lineStyle} />,
    <Line7 style={lineStyle} />,
    <Line8 style={lineStyle} />,
    <Line9 style={lineStyle} />,
    <Line10 style={lineStyle} />,
  ]

  return (
    <>
      {lines[randomNum]}
    </>
  )
}

export default RandomLine