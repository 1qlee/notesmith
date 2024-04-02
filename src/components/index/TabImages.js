import React, { useState, useEffect } from "react"

import { getImage, GatsbyImage } from "gatsby-plugin-image"
import Box from "../ui/Box"

function TabImages({
  activeTab,
  tabImages,
}) {
  const [currentImage, setCurrentImage] = useState({})
  const imageAlts = [
    "Pages of a notebook",
    "Close-up of the notebooks' thick cover stock",
    "Water droplets resting on a notebook's laminated cover",
    "A notebook's gold colored spiral binding",
  ]

  useEffect(() => {
    if (tabImages) {
      tabImages.sort((a, b) => parseInt(a.childImageSharp.fluid.originalName.slice(4)) - parseInt(b.childImageSharp.fluid.originalName.slice(4)))
      setCurrentImage({
        image: tabImages[activeTab],
        alt: imageAlts[activeTab],
      })
    }
  }, [activeTab, tabImages])

  return (
    <Box
      padding="0 0 16px"
    >
      <GatsbyImage
        image={getImage(currentImage.image)}
        placeholder="blurred"
        alt={currentImage.alt}
        loading="lazy"
      />
    </Box>
  )
}

export default TabImages