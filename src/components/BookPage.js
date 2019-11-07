import styled from "styled-components"

import colors from "../styles/colors"

const BookPage = styled.div`
  position: relative;
  padding: 0 1rem;
  width: 100%;
  h1 {
    color: white;
  }
  p {
    color: ${colors.primary.white};
    line-height: 1.5;
    font-size: 1.1rem;
    &:not(:last-child) {
      margin-bottom: 1.45rem;
    }
  }
  small {
    color: ${colors.primary.light};
    font-size: 1rem;
    margin-bottom: 1rem;
    display: block;
  }
  &::before {
    content: "${props => props.pageNumber}";
    position: absolute;
    left: -3rem;
    top: 0;
    color: ${colors.primary.light};
    font-size: 2rem;
    @media only screen and (max-width: 640px) {
      left: 1rem;
      top: -2rem;
    }
  }
`

export default BookPage
