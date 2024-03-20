import styled from "styled-components"
import { colors } from "../../styles/variables"

const Table = styled.table`
  border: ${colors.borders.black};
  border-spacing: 0;
  position: relative;
  width: 100%;
  td,tr {
    border-width: 1px;
    border-color: ${colors.gray.nineHundred};
    border-bottom-width: 0;
  }
  td {
    padding: 8px 16px;
  }
  th {
    border-color: ${colors.gray.nineHundred};
    border-width: 1px;
    font-weight: 500;
    font-size: 1rem;
    padding: 16px;
  }
  tr {
    &.is-selected {
      background-color: ${colors.gray.oneHundred};
    }
  }
  &.is-mobile {
    @media only screen and (max-width: 640px) {
      display: block;
      max-width: -moz-fit-content;
      max-width: fit-content;
      margin: 0 auto;
      overflow-x: auto;
      white-space: nowrap;
    }
  }
`

export default Table