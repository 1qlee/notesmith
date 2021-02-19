import React from "react"
import NotesmithLogo from "../assets/logo2.svg"

function Logo(props) {
  return (
    <NotesmithLogo width={props.width || "160"} height={props.height || "32"} stroke={props.color} />
  )
}

export default Logo
