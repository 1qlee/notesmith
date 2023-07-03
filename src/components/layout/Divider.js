import styled from "styled-components"

const Divider = styled.hr`
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  background-color: ${props => props.backgroundcolor};
  height: ${props => props.height || "1px"};
  border: none !important;
  box-sizing: content-box;
  overflow: visible;
  display: block;
  width: ${props => props.width || "100%"};
`

export default Divider
