import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"

const Table = styled.table`
  border: ${colors.borders.black};
  border-spacing: 0;
  td,tr {
    border-width: 2px;
    border-color: ${colors.gray.nineHundred};
    border-bottom-width: 0;
  }
  th,td {
    padding: 1rem;
  }
  th {
    border-color: ${colors.gray.nineHundred};
    border-width: 2px;
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