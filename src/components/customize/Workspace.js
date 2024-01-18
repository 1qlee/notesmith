import styled from "styled-components"
import { colors } from "../../styles/variables"

const Workspace = styled.div`
  background-color: ${colors.white};
  height: 100%;
  left: 213px;
  overflow: auto;
  position: absolute;
  right: 300px;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  &::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.threeHundred};
  }
`

export default Workspace
