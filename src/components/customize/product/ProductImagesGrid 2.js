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
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9000;
`

const ImageModal = styled.dialog`
  width: 80%;
  height: 80%;
  margin: auto;
  padding: 16px;
  background-color: ${colors.white};
  border-radius: 8px;
`

const ImageCloseButton = styled(Button)`
  position: absolute;
  top: 8px;
  right: 8px;
` 

const ProductImagesGrid = ({ images }) => {
  const sortedImages = images.nodes.sort((a, b) => a.name.localeCompare(b.name))
  const [modalImage, setModalImage] = useState(null)
  const modalRef = useRef(null)
  const buttonRef = useRef(null)

  const handleImageClick = (image) => {
    setModalImage(image)
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
            setModalImage(images.nodes[images.nodes.indexOf(modalImage) - 1])
          }
          break
        case "ArrowRight":
          if (modalImage) {
            setModalImage(images.nodes[images.nodes.indexOf(modalImage) + 1])
          }
          break
        case "Escape":
          setModalImage(null)
        default:
          break
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener("keydown", handleKeyPress)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [modalRef, modalImage])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
      {sortedImages.map((image, index) => (
        <div key={index} onClick={() => handleImageClick(image)}>
          <GatsbyImage image={getImage(image)} alt={`pro wired notebook a5 close-up ${index + 1}`} style={{ width: '100%', height: 'auto', cursor: 'pointer' }} />
        </div>
      ))}
      {modalImage && (
        <ImageModalBackground>
          <ImageModal ref={modalRef} role="dialog" aria-modal="true">
            <GatsbyImage image={getImage(modalImage)} alt={`pro wired notebook a5 close-up`} style={{ width: '100%', height: '100%' }} />
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

