import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import { Arrow } from "../ui/Carousel"

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  }
};

const MainProductImage = styled.figure`
  margin-bottom: 1rem;
  width: 100%;
`

function ProductImages({
  coverColor,
  productImages,
}) {
  const [allImages, setAllImages] = useState([])

  useEffect(() => {
    function sortImages(a, b) {
      if (a.name.split("-")[1] < b.name.split("-")[1]) {
        return -1
      }
      else {
        return 0
      }
    }
    // filter images by the specified color
    function parseImages(images, color) {
      const imagesDummyArray = []
      const filteredImages = images.nodes.filter(img => img.name.split("-")[0] === color)
      // sort images into ascending order
      filteredImages.sort(sortImages)

      filteredImages.forEach(img => {
        imagesDummyArray.push({
          main: img,
          alt: img.name,
        })
      })

      setAllImages(imagesDummyArray)
    }

    parseImages(productImages, coverColor)
  }, [productImages, coverColor])

  return (
    <Carousel
      additionalTransfrom={0}
      arrows
      centerMode={false}
      className=""
      customLeftArrow={<Arrow side="left" />}
      customRightArrow={<Arrow side="right" />}
      containerClass="carousel"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      dotListClass="carousel-dots"
      draggable
      focusOnSelect={false}
      infinite
      keyBoardControl
      minimumTouchDrag={80}
      pauseOnHover
      responsive={responsive}
      showDots
      sliderClass=""
      slidesToSlide={1}
      swipeable
    >
      {allImages.map((image, index) => (
        <MainProductImage
          key={index}
        >
          <GatsbyImage
            image={getImage(image.main)}
            alt={image.alt}
            draggable={false}
          />
        </MainProductImage>
      ))}
    </Carousel>
  )
}

export default ProductImages
