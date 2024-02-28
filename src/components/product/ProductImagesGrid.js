import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { X } from '@phosphor-icons/react'
import { colors, breakpoints } from '../../styles/variables'
import { getImage, GatsbyImage } from 'gatsby-plugin-image'

import Button from '../ui/Button'
import Icon from '../ui/Icon'

const ImageModalWrapper = styled.div`
  background: ${colors.white};
  bottom: 0;
  left: 0;
  padding: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`

const ImageModal = styled.dialog`
  align-items: center;
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
  @media only screen and (max-width: ${breakpoints.sm}) {
    justify-content: flex-start;
  }
  &.is-zoomed {
    .gatsby-image-wrapper {
      cursor: zoom-out;
      transform: scale(1.25);
    }
  }
  .gatsby-image-wrapper {
    position: absolute;
    cursor: zoom-in;
    transform: scale(0.75);
  }
`

const ImageWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  height: 100vh;
  justify-content: center;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
  width: 100vw;
`

const ImageCloseButton = styled(Button)`
  position: fixed;
  top: 16px;
  right: 32px;
` 

const ProductImagesGrid = ({ 
  images, 
  main, 
  filter,
  setCartThumbnail,
  thumbnails,
  setHideScroll,
}) => {
  let sortedImages = images.nodes.sort((a, b) => a.name.localeCompare(b.name))
  let sortedThumbnails = main && thumbnails.nodes.sort((a, b) => a.name.localeCompare(b.name))

  if (main) {
    sortedImages = images.nodes.filter(img => img.name.split("-")[0] === filter)
    sortedThumbnails = thumbnails.nodes.filter(img => img.name.split("-")[0] === filter)
  }
  const [modalImage, setModalImage] = useState(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const modalRef = useRef(null)
  const buttonRef = useRef(null)

  const handleImageClick = (image) => {
    setHideScroll(true)
    setModalImage(image)
    setIsZoomed(false)
  }

  const handleCloseModal = () => {
    setModalImage(null)
    setHideScroll(false)
  }

  useEffect(() => {
    if (main) {
      setCartThumbnail(sortedThumbnails[0])
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalImage(null)
        setHideScroll(false)
      }
    }

    const handleKeyPress = (event) => {
      const index = sortedImages.indexOf(modalImage)

      switch(event.key) {
        case "Tab":
          if (modalImage) {
            event.preventDefault()
            buttonRef.current.focus()
          }
          break
        case "ArrowLeft":
          if (modalImage) {
            if (index !== 0) {
              setModalImage(sortedImages[index - 1])
            }
          }
          break
        case "ArrowRight":
          setModalImage(sortedImages[index + 1])

          if (!sortedImages[index + 1]) {
            setHideScroll(false)
          }
          break
        case "Escape":
          setModalImage(null)
          setHideScroll(false)
        default:
          break
      }
    }

    if (modalImage) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener("keydown", handleKeyPress)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [modalRef, modalImage])

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: sortedImages.length > 1 ? 'repeat(2, 1fr)' : '1fr',
      gap: '8px' 
    }}>
      {sortedImages.map((image, index) => (
        <div key={index} onClick={() => handleImageClick(image)}>
          <GatsbyImage 
            image={getImage(image)} 
            alt={`pro wired notebook a5 close-up ${index + 1}`} 
            style={{ width: '100%', height: 'auto', cursor: 'pointer' }} 
          />
        </div>
      ))}
      {modalImage && (
        <ImageModalWrapper>
          <div style={{position: 'relative'}}>
            <ImageModal
              width={modalImage.childImageSharp.gatsbyImageData.width}
              className={isZoomed && "is-zoomed"}
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <ImageWrapper>
                <GatsbyImage
                  image={getImage(modalImage)}
                  alt={`pro wired notebook a5 close-up`}
                />
              </ImageWrapper>
              <ImageCloseButton
                onClick={handleCloseModal}
                backgroundcolor={colors.white}
                ref={buttonRef}
              >
                <Icon>
                  <X size={24} color={colors.gray.nineHundred} />
                </Icon>
              </ImageCloseButton>
            </ImageModal>
          </div>
        </ImageModalWrapper>
      )}
    </div>
  )
}

export default ProductImagesGrid

