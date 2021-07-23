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
      boxshadow="none"
      backgroundcolor="transparent"
    >
      <Flexbox
        flex="flex"
        alignitems="flex-start"
      >
        <Icon margin="0 1rem 0 0">
          <WarningCircle color={colors.red.sixHundred} size="2rem" weight="duotone" />
        </Icon>
        <Content
          paragraphcolor={colors.primary.sevenHundred}
          paragraphfontsize="1rem"
        >
          <h4>Log in or create an account to save layouts</h4>
          <p>Unfortunately, we won't be able to save your layouts unless you're logged into a Notesmith account.</p>
          <p><Link to="/signup">Sign up</Link> for free or <Link to="/login">log in</Link> to an existing account.</p>
          <Button
            backgroundcolor="transparent"
            padding="0"
            fontsize="0.8rem"
            margin="0 0 0 auto"
            flex="flex"
            color={colors.primary.sixHundred}
            onClick={() => setShowModal({
              show: false,
              type: "notification",
            })}
          >
            <span>
              No thanks, I'm okay with losing my work
            </span>
            <Icon margin="0 0 0 0.25rem">
              <ArrowRight color={colors.primary.sixHundred} weight="bold" />
            </Icon>
          </Button>
        </Content>
      </Flexbox>
    </Modal>
  )
}

export default CheckLoginModal
