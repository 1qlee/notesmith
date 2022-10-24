import styled from "styled-components"
import { colors } from "../../../../styles/variables"

import Button from "../../../Button"

const ControlWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
  width: 100%;
`

const ControlFlexWrapper = styled.div`
  display: flex;
  align-items: ${props => props.alignitems || "center"};
  position: relative;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
`

const ControlFlexChild = styled.div`
  flex: ${props => props.flex};
  margin: ${props => props.margin};
  position: relative;
`

const ControlInputGroup = styled.div`
  position: relative;
`

const ControlInnerButton = styled(Button)`
  position: absolute;
  right: 24px;
  top: 6px;
`

const BorderOptions = styled.div`
  border: 1px solid ${colors.gray.nineHundred};
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
`

export { BorderOptions, ControlWrapper, ControlFlexWrapper, ControlFlexChild, ControlInputGroup, ControlInnerButton }