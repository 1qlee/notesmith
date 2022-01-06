import React, { useState } from "react"
import { Link, navigate } from "gatsby"
import styled from "styled-components"
import { ArrowRight, Warning } from "phosphor-react"
import { colors } from "../../../styles/variables"
import { useFirebaseContext } from "../../../utils/auth"

import { StyledLabel, StyledInput, ErrorLine } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"

function DeleteBookModal({
  bookToBeDeleted,
  deleteBook,
  setShowModal,
}) {
  return (
    <Modal>
      <ModalContent
        backgroundcolor={colors.white}
      >
        <Content
          h3fontsize="1.25rem"
          margin="0 0 0 0"
        >
          <h3>Delete this book</h3>
          <p>Are you sure you want to delete <b>{bookToBeDeleted.title}</b>?</p>
        </Content>
      </ModalContent>
      <ModalFooter
        justifycontent="flex-end"
      >
        <Button
          backgroundcolor={colors.gray.oneHundred}
          boxshadow={colors.shadow.layeredSmall}
          onClick={() => setShowModal({
            show: false,
            type: "deletebook"
          })}
          margin="0 0.5rem 0 0"
        >
          Cancel
        </Button>
        <Button
          backgroundcolor={colors.red.sixHundred}
          color={colors.white}
          onClick={() => deleteBook(bookToBeDeleted)}
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteBookModal
