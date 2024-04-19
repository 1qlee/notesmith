import React, { useEffect, useState } from "react"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import useEmblaCarousel from 'embla-carousel-react'

function ProductImages({
  coverColor,
  productImages,
  additionalImages,
}) {
  const [emblaRef] = useEmblaCarousel()
  let allImages = []
  let filteredImages = productImages.nodes.filter(img => img.name.split("-")[0] === coverColor)
  let combinedImages = [...filteredImages, ...additionalImages.nodes]

  combinedImages.forEach((img, index) => {
    allImages.push({
      main: img,
      alt: `${coverColor} colored book image ${index + 1}`
    })
  })

  return (
    <div
      ref={emblaRef}
      style={{
        overflow: "hidden",
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        {allImages.map((image, index) => (
          <div
            style={{
              flex: "0 0 100%",
              minWidth: 0,
            }}
            key={index}
          >
            <GatsbyImage
              image={getImage(image.main)}
              alt={image.alt}
              loading="eager"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
