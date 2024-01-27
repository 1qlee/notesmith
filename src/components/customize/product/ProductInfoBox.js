import React from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import Content from "../../ui/Content"

const StyledProductInfoBox = styled.div`
  align-items: flex-start;
  border-bottom: ${colors.borders.black};
  display: flex;
  padding: ${props => props.index === 0 ? "0 0 16px" : "16px 0"};
`

const InfoBoxItem = styled.div`
  flex: ${props => props.flex};
`

function ProductInfoBox({
  heading,
  index,
  text,
}) {
  return (
    <StyledProductInfoBox
      index={index}
    >
      <InfoBoxItem
        flex="1"
      >
        <Content
          margin="0"
          h5fontsize="1rem"
          h5margin="0 8px 0 0"
          headinglineheight="1.75"
          h5color={colors.gray.sevenHundred}
        >
          <h5>{heading}</h5>
        </Content>
      </InfoBoxItem>
      <InfoBoxItem
        flex="2"
      >
        <Content
          paragraphcolor={colors.gray.sevenHundred}
        >
          <p>{text}</p>
        </Content>
      </InfoBoxItem>
    </StyledProductInfoBox>
  )
}

export default ProductInfoBox