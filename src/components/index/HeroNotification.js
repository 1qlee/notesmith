import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { Link } from "gatsby"

import { MegaphoneSimple } from "@phosphor-icons/react"
import Notification from "../ui/Notification"
import Icon from "../ui/Icon"

const NotificationWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -40px;
  z-index: 9;
  @media only screen and (max-width: 1085px) {
    bottom: -48px;
  }
  @media only screen and (max-width: 650px) {
    width: calc(100% - 32px);
  }
  @media only screen and (max-width: 584px) {
    bottom: -56px;
  }
`

const HeroNotification = () => {
  return (
    <NotificationWrapper>
      <Notification
        backgroundcolor={colors.yellow.threeHundred}
        color={colors.gray.nineHundred}
        className="is-pulsating"
        borderradius="16px"
        padding="16px"
        boxshadow={colors.shadow.layeredLarge}
        align="center"
        justify="center"
        as={Link}
        to="/products/notebooks/hardcover-wired-notebook-a5-custom/white/"
      >
        <Icon
          margin="0 8px 0 0"
        >
          <MegaphoneSimple
            size={20}
            weight="duotone"
            color={colors.yellow.sixHundred}
          />
        </Icon>
        <span><b>Early Access Sale! Get 25% off all notebooks for a limited time.</b></span>
      </Notification>
    </NotificationWrapper>
  )
}

export default HeroNotification