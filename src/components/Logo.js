import React from "react"
import NotesmithLogo from "../assets/logo2.svg"

function Logo(props) {
  return (
    <NotesmithLogo width="160" height="32" stroke={props.color} />
  )
}

export default Logo
