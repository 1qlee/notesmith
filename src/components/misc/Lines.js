import React, { useEffect, useState } from "react"
import Line1 from "../../assets/underlines/underline-1.svg"
import Line2 from "../../assets/underlines/underline-2.svg"
import Line3 from "../../assets/underlines/underline-3.svg"
import Line4 from "../../assets/underlines/underline-4.svg"
import Line5 from "../../assets/underlines/underline-5.svg"
import Line6 from "../../assets/underlines/underline-6.svg"
import { colors } from "../../styles/variables"

function RandomLine() {
  const [randomLine, setRandomLine] = useState(0)
  const lineStyle = {
    position: "absolute",
    fill: colors.gray.nineHundred,
    stroke: colors.gray.sixHundred,
    top: "36px",
    left: 0,
    width: "100%",
    height: "100%"
  }
  const lines = [
    <Line1 style={lineStyle} />,
    <Line2 style={lineStyle} />,
    <Line3 style={lineStyle} />,
    <Line4 style={lineStyle} />,
    <Line5 style={lineStyle} />,
    <Line6 style={lineStyle} />,
  ]

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * lines.length)
    setRandomLine(randomNum)
  }, [])

  return (
    <>
      {lines[randomLine]}
    </>
  )
}

export default RandomLine