import React from "react"
import NotesmithLogo from "../assets/logo.svg"

function Logo(props) {
  return (
    <NotesmithLogo width={props.width || "176"} height={props.height || "76"} stroke={props.color} />
  )
}

export default Logo
