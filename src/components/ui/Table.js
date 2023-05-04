import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"

const Table = styled.table`
  border: ${colors.borders.black};
  border-spacing: 0;
  font-family: ${fonts.secondary};
  td,tr {
    border-width: 2px;
    border-color: ${colors.gray.nineHundred};
    border-bottom-width: 0;
    font-size: 0.875rem;
  }
  th,td {
    padding: 1rem;
  }
  th {
    border-color: ${colors.gray.nineHundred};
    border-width: 2px;
    font-size: 0.875rem;
    font-weight: 700;
    font-family: ${fonts.secondary};
  }
  tbody {
    tr {
      &:not(.is-selected) {
        &:hover {
          background-color: ${colors.gray.oneHundred};
        }
      }
    }
  }
  tr {
    &.is-selected {
      background-color: ${colors.gray.threeHundred};
    }
  }
`

export default Table