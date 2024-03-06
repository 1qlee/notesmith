import styled from "styled-components"
import { spacing } from "../../../styles/variables"

const AuthSection = styled.div`
  position: relative;
  margin-top: 60px;
  padding: ${spacing.large};
  width: 100%;
`

const AuthContentBox = styled.div`
  width: 100%;
  min-height: calc(100vh - 120px);
  margin-bottom: 16px;
`

export {
  AuthSection,
  AuthContentBox
}