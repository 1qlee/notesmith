import React, { useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { ArrowRight, WarningCircle } from "phosphor-react"
import { colors } from "../../../styles/variables"

import { StyledFieldset, StyledLabel, StyledInput, RadioInput } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"

function CheckLoginModal({ setShowModal }) {
  return (
    <Modal
      setShowModal={setShowModal}
      width="300px"
    >
      <ModalHeader>Sign in or create an account to save layouts</ModalHeader>
      <ModalContent>
        <Content
          paragraphmarginbottom="1rem"
        >
          <p>We won't be able to save your layouts unless you're logged into a Notesmith account. You might lose any progress you make.</p>
          <p><Link to="/signup">Sign up</Link> for free or <Link to="/signin">sign in</Link> to an existing account to save your layouts.</p>
        </Content>
      </ModalContent>
      <ModalFooter
        justifycontent="flex-end"
      >
        <Button
          backgroundcolor={colors.primary.oneHundred}
          fontsize="0.8rem"
          margin="0 0 0 auto"
          flex="flex"
          color={colors.gray.nineHundred}
          onClick={() => setShowModal({
            show: false,
            type: "notification",
          })}
        >
          <span>
            No, I'm okay with losing my work
          </span>
          <Icon margin="0 0 0 0.25rem">
            <ArrowRight color={colors.gray.nineHundred} weight="bold" />
          </Icon>
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CheckLoginModal
