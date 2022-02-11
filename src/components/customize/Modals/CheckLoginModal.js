import React from "react"
import { Link } from "gatsby"
import { colors } from "../../../styles/variables"

import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"

function CheckLoginModal({ setShowModal }) {
  return (
    <Modal
      setShowModal={setShowModal}
      width="300px"
    >
      <ModalHeader>Sign in or create an account to create layouts</ModalHeader>
      <ModalContent>
        <Content
          paragraphmarginbottom="1rem"
        >
          <p>You won't be able to purchase notebooks with custom layouts without first making a Notesmith account.</p>
          <p><Link to="/signup">Sign up</Link> for free or <Link to="/signin">sign in</Link> to an existing account to create notebooks with custom layouts.</p>
        </Content>
      </ModalContent>
      <ModalFooter
        justifycontent="flex-end"
      >
        <Button
          backgroundcolor={colors.gray.twoHundred}
          fontsize="0.8rem"
          margin="0 0 0 auto"
          flex="flex"
          onClick={() => setShowModal({
            show: false,
            type: "notification",
          })}
        >
          <span>
            I just want to browse
          </span>
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CheckLoginModal
