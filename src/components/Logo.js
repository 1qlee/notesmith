import React from "react"
import NotesmithLogo from "../assets/logo2.svg"

function Logo(props) {
  return (
    <NotesmithLogo width="150" height="40" stroke={props.color} />
  )
}

export default Logo
