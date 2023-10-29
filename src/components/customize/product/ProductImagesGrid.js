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
    let tabKeyPressListener = null

    if (modalImage) {
      const handleTabKeyPress = (event) => {
        if (event.key === "Tab") {
          event.preventDefault()
          buttonRef.current.focus()
        }
      }

      tabKeyPressListener = handleTabKeyPress
      document.addEventListener('keydown', handleTabKeyPress)
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalImage(null)
      }
    }

    const handleEscapeKeyPress = (event) => {
      if (event.key === "Escape") {
        setModalImage(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener("keydown", handleEscapeKeyPress)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKeyPress)

      if (tabKeyPressListener) {
        document.removeEventListener('keydown', tabKeyPressListener)
      }
    }
  }, [modalRef, modalImage])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
      {images.nodes.map((image, index) => (
        <div key={index} onClick={() => handleImageClick(image)}>
          <GatsbyImage image={getImage(image)} alt={`Product Image ${index + 1}`} style={{ width: '100%', height: 'auto', cursor: 'pointer' }} />
        </div>
      ))}
      {modalImage && (
        <ImageModalBackground>
          <ImageModal ref={modalRef} role="dialog" aria-modal="true">
            <GatsbyImage image={getImage(modalImage)} alt="Full-sized Product Image" style={{ width: '100%', height: '100%' }} />
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

