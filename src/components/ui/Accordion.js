import React, { useState } from 'react'
import styled from 'styled-components'
import { colors } from '../../styles/variables'
import { CaretUp, CaretDown } from '@phosphor-icons/react'

import Content from './Content'
import { Flexbox } from '../layout/Flexbox'
import Icon from './Icon'

const AccordionTab = styled.div`
  border-bottom: 1px solid #000;
  color: ${colors.gray.sixHundred};
  transition: color 0.2s;
  &:hover {
    cursor: pointer;
    color: ${colors.gray.nineHundred};
  }
`

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <AccordionTab onClick={toggleAccordion}>
        <Flexbox
          flex="flex"
          justifycontent="space-between"
          width="100%"
        >
          <Content
            padding="16px 0"
            h4margin="0"
          >
            <h4>{title}</h4>
          </Content>
          <Icon>
            {isOpen ? (
              <CaretUp size={24} />
            ) : (
              <CaretDown size={24} />
            )}
          </Icon>
        </Flexbox>
      </AccordionTab>
      {isOpen && (
        <div>
          {children}
        </div>
      )}
    </div>
  )
}

export default Accordion
