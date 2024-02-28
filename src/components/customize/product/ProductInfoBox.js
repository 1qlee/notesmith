import React from "react"

import { Flexbox } from "../../layout/Flexbox"
import Content from "../../ui/Content"

function ProductInfoBox({
  heading,
  index,
  text,
}) {
  return (
    <>
      <Content
        margin="0 0 8px"
        h5fontsize="0.875rem"
        h5margin="0"
        headinglineheight="1.75"
        paragraphfontsize="0.875rem"
      >
        <h5>{heading}</h5>
        <p>{text}</p>
      </Content>
    </>
  )
}

export default ProductInfoBox