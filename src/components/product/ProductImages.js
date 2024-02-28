import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  }
};

const StyledProductImages = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
`

const ThumbnailRow = styled.div`
  -webkit-overflow-scrolling: touch;
`

const Thumbnail = styled.figure`
  width: 80px;
  height: 80px;
  padding: 0.3rem;
  border: 2px solid ${colors.gray.threeHundred};
  border-radius: 8px;
  transition: border 0.3s ease;
  margin: 0.5rem;
  &.is-active {
    border-color: ${colors.gray.nineHundred};
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      border-color: ${colors.gray.sixHundred};
    }
  }
`

const MainProductImage = styled.figure`
  margin-bottom: 1rem;
  width: 100%;
`

function ProductImages({
  coverColor,
  productImages,
  productThumbnails,
  setCartThumbnail,
}) {
  const [allImages, setAllImages] = useState([])
  const [activeImage, setActiveImage] = useState(0)
  const [activeImageData, setActiveImageData] = useState(null)

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
    function parseImages(images, color, thumbnails) {
      const imagesDummyArray = []
      const filteredImages = images.nodes.filter(img => img.name.split("-")[0] === color)
      const filteredThumbnails = thumbnails.nodes.filter(img => img.name.split("-")[0] === color)
      // sort images into ascending order
      filteredImages.sort(sortImages)
      filteredThumbnails.sort(sortImages)
      const firstImage = filteredImages[0]
      const firstThumbnail = filteredThumbnails[0]

      filteredImages.forEach((img, index) => {
        imagesDummyArray.push({
          main: img,
          thumbnail: filteredThumbnails[index],
          alt: img.name,
        })
      })

      setActiveImageData(firstImage)
      setActiveImage(0)
      setCartThumbnail(firstThumbnail)
      setAllImages(imagesDummyArray)
    }

    parseImages(productImages, coverColor, productThumbnails)
  }, [productImages, productThumbnails, coverColor, setCartThumbnail])

  function handleSelectImage(img, index) {
    setActiveImage(index)
    setActiveImageData(img)
  }

  return (
    <Carousel
      additionalTransfrom={0}
      arrows
      autoPlaySpeed={3000}
      centerMode={false}
      className=""
      containerClass="container"
      dotListClass=""
      draggable
      focusOnSelect={false}
      infinite
      itemClass=""
      keyBoardControl
      minimumTouchDrag={80}
      pauseOnHover
      responsive={responsive}
      renderArrowsWhenDisabled={false}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      rewind={false}
      rewindWithAnimation={false}
      rtl={false}
      shouldResetAutoplay
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
          />
        </MainProductImage>
      ))}
    </Carousel>
  )
}

export default ProductImages
