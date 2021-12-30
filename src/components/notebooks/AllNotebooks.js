import React from "react"
import { Link } from "gatsby"

function AllNotebooks() {
  return (
    <div>
      <div>Notebooks</div>
      <Link to="/notebooks/wired-notebook">
        <p>Wired notebook</p>
      </Link>
    </div>
  )
}

export default AllNotebooks
