import React from "react"
import { Link } from "gatsby"

function Product404({ params }) {
  return (
    <div className="wrapper">
      <header>
        <Link to="/">Go back to "Home"</Link>
      </header>
      <main>
        <h1>Couldn't find product</h1>
        <p>We couldn't locate the product "{params.name}"</p>
      </main>
    </div>
  )
}

export default Product404
