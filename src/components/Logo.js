import React from "react"
import NotesmithLogo from "../assets/notesmith-logo.svg"

function Logo(props) {
  return (
    <NotesmithLogo width={props.width || "200"} height={props.height || "80"} stroke={props.color} />
  )
}

export default Logo
