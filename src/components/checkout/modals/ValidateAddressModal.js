import React, { useState } from "react"
import styled from "styled-components"
import { WarningCircle, CircleNotch } from "phosphor-react"
import { colors, convertToPx } from "../../../styles/variables"
import { useFirebaseContext } from "../../../utils/auth"

import { StyledLabel, StyledInput, ErrorLine } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { Flexbox } from "../../layout/Flexbox"
import Notification from "../../ui/Notification"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"

function ValidateAddressModal({
  address,
  addressError,
  forceShippingSubmit,
  setShowModal,
}) {
  return (
    <Modal
      setShowModal={setShowModal}
      width="300px"
    >
      <ModalHeader>
        Confirm your address
      </ModalHeader>
      <ModalContent>
        <Notification
          backgroundcolor={colors.red.twoHundred}
          bordercolor={colors.red.twoHundred}
          margin="0 0 2rem"
          padding="1rem"
          justifycontent="flex-start"
          alignitems="flex-start"
        >
          <Icon
            backgroundcolor={colors.red.twoHundred}
            borderradius="100%"
            margin="0 1rem 0 0"
            className="is-pulsating"
            pulseColor={colors.red.threeHundred}
          >
            <WarningCircle size="1.5rem" weight="fill" color={colors.red.sixHundred} />
          </Icon>
          <Content
            licolor={colors.red.nineHundred}
          >
            <StyledLabel color={colors.red.nineHundred}>Errors</StyledLabel>
            <ul>
              {addressError.map(error => (
                <li key={error.message}>{error.message}</li>
              ))}
            </ul>
          </Content>
        </Notification>
        <Content
          paragraphlineheight="1.5"
          paragraphmarginbottom="0"
        >
          <StyledLabel>Your address</StyledLabel>
          <p>{address.line1}, {address.line2}</p>
          <p>{address.city}, {address.state} {address.postal_code}</p>
        </Content>
      </ModalContent>
      <ModalFooter
        justifycontent="space-between"
      >
        <Button
          backgroundcolor={colors.gray.oneHundred}
          onClick={() => setShowModal({ show: false })}
        >
          Edit address
        </Button>
        <Button
          backgroundcolor={colors.red.sixHundred}
          color={colors.white}
          onClick={forceShippingSubmit}
        >
          Proceed with address as is
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ValidateAddressModal
