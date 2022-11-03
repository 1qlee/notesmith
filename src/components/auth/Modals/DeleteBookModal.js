import React from "react"
import { colors } from "../../../styles/variables"

import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import Button from "../../Button"
import Content from "../../Content"

function DeleteBookModal({
  bookToBeDeleted,
  deleteBook,
  setShowModal,
}) {
  return (
    <Modal
      width="300px"
      setShowModal={setShowModal}
    >
      <ModalHeader>Delete this book</ModalHeader>
      <ModalContent
        backgroundcolor={colors.white}
      >
        <Content
          h3fontsize="1.25rem"
          h3margin="0 0 0 0"
        >
          <p>Are you sure you want to delete <b>{bookToBeDeleted.title}</b>? The book and all of its pages will be removed.</p>
        </Content>
      </ModalContent>
      <ModalFooter
        justifycontent="flex-end"
      >
        <Button
          backgroundcolor={colors.gray.oneHundred}
          color={colors.gray.nineHundred}
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
