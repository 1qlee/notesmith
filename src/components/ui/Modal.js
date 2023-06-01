import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import { colors, fonts, widths } from "../../styles/variables"

const StyledModal = styled.div`
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
  box-shadow: ${props => props.boxshadow ? props.boxshadow : colors.shadow.layered};
  border: ${colors.borders.black};
  left: 50%;
  width: ${widths.modal};
  position: absolute;
  top: 25%;
  transform: translate(-50%, -25%);
  width: ${props => props.width};
  padding: 0 16px;
  z-index: 9001;
`

const ModalBackground = styled.div`
  background-color: ${colors.primary.shadow};
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 9000;
`

const ModalHeader = styled.div`
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
  border-bottom: ${props => props.border || `2px solid ${colors.gray.nineHundred}`};
  color: ${props => props.color || colors.primary.nineHundred};
  font-size: 1rem;
  font-weight: 700;
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
  border-top: ${props => props.border ? props.border : `2px solid ${colors.gray.nineHundred}`};
  border-radius: 0 0 8px 8px;
  display: flex;
  justify-content: ${props => props.justifycontent};
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
