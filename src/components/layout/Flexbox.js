import styled from "styled-components"
import PropTypes from "prop-types"

const Flexbox = styled.div`
  align-items: ${props => props.alignItems};
  display: ${props => props.flex};
  justify-content: ${props => props.justifyContent};
  flex-direction: ${props => props.flexDirection};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: relative;
  width: ${props => props.width};
`

const FlexboxButtons = styled.div`
  button, a {
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
`

Flexbox.propTypes = {
  alignItems: PropTypes.string.isRequired,
  flex: PropTypes.string.isRequired,
  justifyContent: PropTypes.string.isRequired,
}

export {
  Flexbox,
  FlexboxButtons
}
