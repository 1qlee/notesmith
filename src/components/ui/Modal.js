import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"

const StyledModal = styled.div`
  background-color: ${colors.paper.cream};
  border-radius: 0.25rem;
  box-shadow: ${colors.shadow.modal};
  position: absolute;
  transform: translate(-50%, -25%);
  left: 50%;
  top: 25%;
  min-width: ${widths.modal};
  z-index: 9001;
`

const ModalBackground = styled.div`
  background-color: ${colors.gray.threeHundred};
  height: 100vh;
  background: ${colors.shadow.float};
  position: absolute;
  width: 100vw;
  z-index: 9000;
  top: 0;
  left: 0;
`

const ModalHeader = styled.div`
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.gray.threeHundred};
  color: ${props => props.color};
  border-radius: 0.25rem 0.25rem 0 0;
  padding: 1rem;
  h5 {
    color: ${props => props.color};
    font-size: 1rem;
    font-weight: 400;
  }
`

const ModalContent = styled.div`
  padding: 1rem;
`

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justifycontent};
  padding: 1rem;
  border-top: 1px solid ${colors.gray.threeHundred};
`

function Modal({ children, setShowModal }) {
  const modalBackground = useRef()

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleEscKey)

    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleEscKey)
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
      <StyledModal ref={modalBackground} onClick={e => handleClick(e)}>
        {children}
      </StyledModal>
    </ModalBackground>
  )
}

export { Modal, ModalHeader, ModalContent, ModalFooter }
