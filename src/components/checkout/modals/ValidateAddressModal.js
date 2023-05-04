import React from "react"
import { WarningCircle } from "phosphor-react"
import { colors } from "../../../styles/variables"
import { CircleNotch } from "phosphor-react"

import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import Notification from "../../ui/Notification"
import Icon from "../../ui/Icon"
import Button from "../../ui/Button"
import Content from "../../ui/Content"

function ValidateAddressModal({
  address,
  addressError,
  processing,
  forceShippingSubmit,
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
          margin="0 0 16px"
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
            lifontsize="0.75rem"
            h5margin="0 0 4px"
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
          paragraphmarginbottom="0"
          paragraphfontsize="0.875rem"
          h5margin="0 0 4px"
        >
          <h5>Address</h5>
          <p>{address.line1}, {address.line2}</p>
          <p>{address.city}, {address.state} {address.postal_code}</p>
        </Content>
      </ModalContent>
      <ModalFooter
        justifycontent="flex-end"
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
          onClick={forceShippingSubmit}
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
