import React from "react"
import { fonts } from "../../styles/variables"
import Content from "../Content"
import Highlight from "../misc/Highlight"

function SectionHeading({
  children
}) {
  return (
    <Content
      h2fontsize="1rem"
      h2margin="0"
      headingfontfamily={fonts.secondary}
      padding="0 0 8px 0"
      margin="0 0 32px"
    >
      <h2><Highlight>{children}</Highlight></h2>
    </Content>
  )
}

export default SectionHeading