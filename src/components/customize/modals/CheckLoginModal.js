import React from "react"
import { Link } from "gatsby"
import { colors } from "../../../styles/variables"
import { Info } from "@phosphor-icons/react"

import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import Icon from "../../ui/Icon"
import Button from "../../ui/Button"
import Content from "../../ui/Content"
import Notification from "../../ui/Notification"

function CheckLoginModal({ setShowModal }) {
  return (
    <Modal
      setShowModal={setShowModal}
      width="300px"
    >
      <ModalHeader>Sign in or create an account</ModalHeader>
      <ModalContent>
        <Notification
          alignitems="flex-start"
          backgroundcolor={colors.gray.oneHundred}
          bordercolor={colors.gray.oneHundred}
          margin="0 0 1rem"
          padding="1rem"
        >
          <Icon
            borderradius="100%"
            margin="0.25rem 1rem 0 0"
            className="is-pulsating"
            pulseColor={colors.green.threeHundred}
          >
            <Info size="1.5rem" weight="fill" color={colors.green.sixHundred} />
          </Icon>
          <Content
            paragraphcolor={colors.gray.nineHundred}
          >
            <p>You won't be able to purchase notebooks with custom layouts without first making a Notesmith account.</p>
          </Content>
        </Notification>
        <Content
          paragraphmargin="0 0 16px"
          linkcolor={colors.link.normal}
        >
          <p><Link to="/signup">Sign up</Link> for free or <Link to="/signin">sign in</Link> to an existing account to create notebooks with custom layouts.</p>
        </Content>
      </ModalContent>
      <ModalFooter
        justifycontent="flex-end"
      >
        <Button
          backgroundcolor={colors.gray.oneHundred}
          color={colors.gray.nineHundred}
          fontsize="0.8rem"
          margin="0 0 0 auto"
          flex="flex"
          onClick={() => setShowModal({
            show: false,
            type: "notification",
          })}
        >
          <span>
            Browse demo anyway
          </span>
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CheckLoginModal
