import React, { useEffect, useState } from "react"
import Line1 from "../../assets/underlines/underline-1.svg"
import Line2 from "../../assets/underlines/underline-2.svg"
import Line3 from "../../assets/underlines/underline-3.svg"
import Line4 from "../../assets/underlines/underline-4.svg"
import Line5 from "../../assets/underlines/underline-5.svg"
import Line6 from "../../assets/underlines/underline-6.svg"
import { colors } from "../../styles/variables"

function RandomLine(props) {
  const [randomLine, setRandomLine] = useState(0)
  const lineStyle = {
    position: "absolute",
    fill: colors.gray.nineHundred,
    top: "100%",
    left: 0,
    width: "100%",
    height: "max-content"
  }
  const lines = [
    <Line4 style={lineStyle} />,
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