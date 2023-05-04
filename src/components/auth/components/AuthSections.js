import styled from "styled-components"
import { colors } from "../../../styles/variables"

const AuthSection = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const AuthContentBox = styled.div`
  width: 100%;
  min-height: calc(100vh - 120px);
  border: ${colors.borders.black};
  border-top-width: 0;
  padding: 16px;
  margin-bottom: 16px;
`

export {
  AuthSection,
  AuthContentBox
}