import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

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
    <StyledProductImages>
      <ThumbnailRow>
        {allImages.map((image, index) => (
          <Thumbnail
            key={index}
            className={activeImage === index ? "is-active" : null}
            onClick={() => handleSelectImage(image.main, index)}
          >
            <GatsbyImage
              image={getImage(image.thumbnail)}
              alt=""
            />
          </Thumbnail>
        ))}
      </ThumbnailRow>
      <MainProductImage>
        <GatsbyImage 
          image={getImage(activeImageData)}
          alt=""
        />
      </MainProductImage>
    </StyledProductImages>
  )
}

export default ProductImages
