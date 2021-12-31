import React from "react"
import { Link } from "gatsby"
import notebooks from "../../data/notebooks.json"

function AllNotebooks() {
  return (
    <div>
      <div>Notebooks</div>
      {Object.keys(notebooks).map((key, index) => (
        <Link to={`/notebooks/${notebooks[key].slug}`}>
          <p>{notebooks[key].name}</p>
        </Link>
      ))}
    </div>
  )
}

export default AllNotebooks
