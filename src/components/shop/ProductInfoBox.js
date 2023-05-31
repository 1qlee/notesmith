import React from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"
import Content from "../ui/Content"

const StyledProductInfoBox = styled.div`
  align-items: flex-start;
  border-top: 1px solid ${colors.gray.threeHundred};
  display: flex;
  padding: 16px 0;
`

const InfoBoxItem = styled.div`
  flex: ${props => props.flex};
`

function ProductInfoBox({
  heading,
  text,
}) {
  return (
    <StyledProductInfoBox>
      <InfoBoxItem
        flex="1"
      >
        <Content
          margin="0"
        >
          <p>{heading}</p>
        </Content>
      </InfoBoxItem>
      <InfoBoxItem
        flex="2"
      >
        <Content>
          <p>{text}</p>
        </Content>
      </InfoBoxItem>
    </StyledProductInfoBox>
  )
}

export default ProductInfoBox