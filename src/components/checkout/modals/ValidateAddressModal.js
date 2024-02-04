import React from "react"
import { WarningCircle } from "@phosphor-icons/react"
import { colors } from "../../../styles/variables"
import { CircleNotch } from "@phosphor-icons/react"

import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import Notification from "../../ui/Notification"
import Icon from "../../ui/Icon"
import Button from "../../ui/Button"
import Content from "../../ui/Content"

function ValidateAddressModal({
  address,
  addressError,
  processing,
  forceAddressSubmit,
  setShowModal,
}) {
  return (
    <Modal
      setShowModal={setShowModal}
    >
      <ModalHeader>
        Confirm your address
      </ModalHeader>
      <ModalContent>
        <Notification
          backgroundcolor={colors.red.twoHundred}
          bordercolor={colors.red.twoHundred}
          borderradius="8px"
          margin="0 0 16px"
          padding="1rem"
          justify="flex-start"
          align="flex-start"
        >
          <Icon
            borderradius="100%"
            margin="0 1rem 0 0"
            className="is-pulsating"
            pulseColor={colors.red.fourHundred}
          >
            <WarningCircle size="1.5rem" weight="fill" color={colors.red.sixHundred} />
          </Icon>
          <Content
            licolor={colors.red.nineHundred}
            h5margin="0 0 4px"
            h5color={colors.red.nineHundred}
          >
            <h5>Errors</h5>
            <ul>
              {addressError.map(error => (
                <li key={error.message}>{error.message}</li>
              ))}
            </ul>
          </Content>
        </Notification>
        <Content
          paragraphlineheight="1.5"
          paragraphmargin="0"
          h5margin="0 0 4px"
        >
          <h5>You inputted:</h5>
          <p>{address.line1}, {address.line2}</p>
          <p>{address.city}, {address.state} {address.postal_code}</p>
        </Content>
      </ModalContent>
      <ModalFooter
        justify="flex-end"
      >
        {!processing && (
          <Button
            backgroundcolor={colors.gray.twoHundred}
            className={processing ? "is-loading" : null}
            color={colors.gray.nineHundred}
            disabled={processing}
            onClick={() => setShowModal({ show: false })}
            margin="0 8px 0 0"
          >
            Edit address
          </Button>
        )}
        <Button
          className={processing ? "is-loading" : null}
          disabled={processing}
          onClick={async () => await forceAddressSubmit()}
        >
          {processing ? (
            <Icon>
              <CircleNotch size={16} />
            </Icon>
          ) : (
            "Proceed with address as is"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ValidateAddressModal
