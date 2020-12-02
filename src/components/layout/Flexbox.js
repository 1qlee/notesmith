import styled from "styled-components"
import PropTypes from "prop-types"

const Flexbox = styled.div`
  align-items: ${props => props.alignItems};
  display: ${props => props.flex};
  justify-content: ${props => props.justifyContent};
  margin: ${props => props.margin};
  position: relative;
`

const FlexboxButtons = styled.div`
  button, a {
    &:not(:last-child) {
      margin-right: 1rem;
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
