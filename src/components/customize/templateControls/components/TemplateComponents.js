import styled from "styled-components"
import Button from "../../../Button"

const ControlWrapper = styled.div`
  position: relative;
  width: 100%;
  &:not(:last-child) {
    margin-right: 4px;
  }
`

const ControlFlexWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
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
  top: 5px;
`

export { ControlWrapper, ControlFlexWrapper, ControlFlexChild, ControlInputGroup, ControlInnerButton }