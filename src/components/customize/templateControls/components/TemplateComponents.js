import styled from "styled-components"
import Button from "../../../Button"

const ControlWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
  width: 100%;
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
  top: 6px;
`

export { ControlWrapper, ControlFlexWrapper, ControlFlexChild, ControlInputGroup, ControlInnerButton }