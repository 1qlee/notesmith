import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import { colors, fonts, widths } from "../../styles/variables"

const StyledModal = styled.dialog`
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
  border: ${colors.borders.black};
  box-shadow: ${props => props.boxshadow ? props.boxshadow : colors.shadow.layered};
  display: block;
  left: 50%;
  margin: 0;
  padding: 0 16px;
  position: absolute;
  top: 20%;
  transform: translate(-50%, -25%);
  max-width: ${props => props.width || widths.modal};
  width: inherit;
  z-index: 9001;
`

const ModalBackground = styled.div`
  background-color: ${colors.gray.threeHundred};
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 9000;
`

const ModalHeader = styled.div`
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
  color: ${props => props.color || colors.gray.nineHundred};
  border-bottom: ${colors.borders.black};
  font-size: 1.25rem;
  font-weight: 700;
  font-family: ${props => props.fontfamily || fonts.secondary};
  padding: 16px 0;
`

const ModalContent = styled.div`
  padding: 16px 0;
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
  font-size: 1rem;
`

const ModalFooter = styled.div`
  align-items: center;
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
  border-top: ${props => props.border ? props.border : `${colors.borders.black}`};
  border-radius: 0 0 8px 8px;
  display: flex;
  justify-content: ${props => props.justify};
  padding: 16px 0;
`

function Modal({ children, setShowModal, width, boxshadow, backgroundcolor, unclickable }) {
  const modalBackground = useRef()

  useEffect(() => {
    if (!unclickable) {
      document.addEventListener("mousedown", handleClick)
      document.addEventListener("keydown", handleEscKey)

      return () => {
        document.removeEventListener("mousedown", handleClick)
        document.removeEventListener("keydown", handleEscKey)
      }
    }
  })

  function handleEscKey(e) {
    if (e.keyCode === 27) {
      setShowModal({
        show: false
      })
    }
  }

  function handleClick(e) {
    if (modalBackground.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setShowModal({
      show: false
    })
  }

  return (
    <ModalBackground>
      <StyledModal
        width={width}
        boxshadow={boxshadow}
        backgroundcolor={backgroundcolor}
        ref={modalBackground}
        onClick={e => handleClick(e)}
      >
        {children}
      </StyledModal>
    </ModalBackground>
  )
}

export { Modal, ModalHeader, ModalContent, ModalFooter }
