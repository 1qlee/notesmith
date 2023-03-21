import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"

const StyledModal = styled.div`
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
  box-shadow: ${props => props.boxshadow ? props.boxshadow : colors.shadow.layered};
  border-radius: 8px;
  left: 50%;
  min-width: ${widths.modal};
  position: absolute;
  top: 25%;
  transform: translate(-50%, -25%);
  width: ${props => props.width};
  z-index: 9001;
`

const ModalBackground = styled.div`
  background-color: ${colors.primary.shadow};
  height: 100vh;
  left: 0;
  position: absolute;
  top: 0;
  width: 100vw;
  z-index: 9000;
`

const ModalHeader = styled.div`
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
  border-bottom: ${props => props.border || `1px solid ${colors.gray.threeHundred}`};
  border-radius: 8px 8px 0 0;
  color: ${props => props.color || colors.primary.nineHundred};
  font-size: 1.25rem;
  font-weight: 700;
  padding: 1rem;
`

const ModalContent = styled.div`
  padding: 1rem;
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
`

const ModalFooter = styled.div`
  align-items: center;
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
  border-top: ${props => props.border ? props.border : `1px solid ${colors.gray.threeHundred}`};
  border-radius: 0 0 8px 8px;
  display: flex;
  justify-content: ${props => props.justifycontent};
  padding: 1rem;
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
