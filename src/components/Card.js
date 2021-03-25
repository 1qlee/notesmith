import React from "react"
import styled from "styled-components"
import { colors } from "../styles/variables"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import Image from "./Image"

const StyledCard = styled.div`
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.white};
  width: ${props => props.width};
`

const CardContent = styled.div`
  padding: 1rem;
  h1,h2,h3,h4,h5,h6 {
    color: ${props => props.dark ? colors.primary.oneHundred : colors.gray.nineHundred} !important;
    margin: 0 0 1rem;
    padding: 0;
  }
  p {
    color: ${props => props.dark ? colors.primary.threeHundred : colors.gray.eightHundred};
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
`

function Card(props) {
  return (
    <StyledCard width={props.width} backgroundcolor={props.backgroundcolor}>
      <Image fluid={props.fluid} />
      <CardContent>
        <h3>{props.title}</h3>
        {documentToReactComponents(props.description)}
      </CardContent>
    </StyledCard>
  )
}

export default Card
