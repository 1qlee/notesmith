import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { X } from '@phosphor-icons/react'
import { colors } from '../../../styles/variables'
import { getImage, GatsbyImage } from 'gatsby-plugin-image'
import Button from '../../ui/Button'
import Icon from '../../ui/Icon'

const ImageModalBackground = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  background-color: ${colors.primary.shadow};
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 9000;
`

const ImageModal = styled.dialog`
  width: 100%;
  height: 100%;
  margin: auto;
  padding: 16px;
  background-color: ${colors.white};
  border-radius: 8px;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  &.is-zoomed {
    .gatsby-image-wrapper {
      cursor: zoom-out;
      width: ${props => +props.width}px;
      height: auto;
      position: absolute;
    }
  }
  .gatsby-image-wrapper {
    width: ${props => +props.width / 2}px;
    height: 100%;
    position: absolute;
    cursor: zoom-in;
  }
`

const ImageCloseButton = styled(Button)`
  position: fixed;
  top: 16px;
  right: 32px;
` 

const ProductImagesGrid = ({ images, main, filter }) => {
  let sortedImages = images.nodes.sort((a, b) => a.name.localeCompare(b.name))

  if (main) {
    const filteredImages = images.nodes.filter(img => img.name.split("-")[0] === filter)
    sortedImages = filteredImages
  }
  const [modalImage, setModalImage] = useState(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const modalRef = useRef(null)
  const buttonRef = useRef(null)

  const handleImageClick = (image) => {
    setModalImage(image)
    setIsZoomed(false)
  }

  const handleCloseModal = () => {
    setModalImage(null)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalImage(null)
      }
    }

    const handleKeyPress = (event) => {
      switch(event.key) {
        case "Tab":
          if (modalImage) {
            event.preventDefault()
            buttonRef.current.focus()
          }
          break
        case "ArrowLeft":
          if (modalImage) {
            const index = sortedImages.indexOf(modalImage)

            if (index !== 0) {
              setModalImage(sortedImages[sortedImages.indexOf(modalImage) - 1])
            }
          }
          break
        case "ArrowRight":
          setModalImage(sortedImages[sortedImages.indexOf(modalImage) + 1])
          break
        case "Escape":
          setModalImage(null)
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
        <ImageModalBackground>
          <ImageModal 
            width={modalImage.childImageSharp.gatsbyImageData.width}
            className={isZoomed && "is-zoomed"}
            ref={modalRef} 
            role="dialog" 
            aria-modal="true"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <GatsbyImage 
              image={getImage(modalImage)} 
              alt={`pro wired notebook a5 close-up`} 
            />
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
        </ImageModalBackground>
      )}
    </div>
  )
}

export default ProductImagesGrid

