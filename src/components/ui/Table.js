import styled from "styled-components"
import { colors } from "../../styles/variables"

const Table = styled.table`
  border: ${colors.borders.black};
  border-spacing: 0;
  @media only screen and (max-width: 640px) {
    display: block;
    max-width: -moz-fit-content;
    max-width: fit-content;
    margin: 0 auto;
    overflow-x: auto;
    white-space: nowrap;
  }
  td,tr {
    border-width: 1px;
    border-color: ${colors.gray.nineHundred};
    border-bottom-width: 0;
  }
  th,td {
    padding: 1rem;
  }
  th {
    border-color: ${colors.gray.nineHundred};
    border-width: 1px;
    font-weight: 700;
    font-size: 1rem;
  }
  tr {
    &.is-selected {
      background-color: ${colors.gray.twoHundred};
    }
  }
`

export default Table