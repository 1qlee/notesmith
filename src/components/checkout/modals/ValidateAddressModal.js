import { ArrowLeft, Warning } from "phosphor-react"
import { colors, convertToPx } from "../../../styles/variables"
import { Link, navigate, graphql, useStaticQuery } from "gatsby"
import { useFirebaseContext } from "../../../utils/auth"
import Loading from "../../../assets/loading.svg"
import React, { useState } from "react"
import styled from "styled-components"

import { StyledLabel, StyledInput, ErrorLine } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"

function ValidateAddressModal({
  setShowModal,
  formError,
  address,
  forceShippingSubmit,
}) {
  return (
    <Modal>
      <ModalHeader
        backgroundcolor={colors.white}
      >
        <Content
          h3fontsize="1.25rem"
          h3margin="0"
        >
          <h3>Is your address correct?</h3>
        </Content>
      </ModalHeader>
      <ModalContent>
        <Content
          margin="0 0 2rem 0"
          h5fontsize="0.75rem"
          h5margin="0 0 0.5rem 0"
        >
          <h5>Errors</h5>
          <ul>
            {formError.map(error => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </Content>
        <Content
          paragraphlineheight="1.5"
          paragraphmarginbottom="0"
          h5fontsize="0.75rem"
          h5margin="0 0 0.5rem 0"
        >
          <h5>Your address</h5>
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
