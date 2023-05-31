import React from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"
import { CaretDown, CaretUp, CheckCircle } from "phosphor-react"
import { useCollapse } from "react-collapsed"

import { Flexbox } from "../layout/Flexbox"
import Icon from "../ui/Icon"
import Content from "../ui/Content"
import Tag from "../ui/Tag"

const StyledAccordionTab = styled.div`
  padding: ${props => props.padding || "16px 0"};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${colors.borders.black};
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;
  &:hover {
    border-bottom-color: ${colors.gray.fourHundred};
  }
`

const AccordionTab = ({ 
  activeAccordionTab,
  children,
  onClick,
  prereq,
  status,
  summaries,
  tabName,
  text,
}) => {
  const isActive = activeAccordionTab === tabName
  const { getToggleProps, getCollapseProps, isExpanded, defaultExpanded } = useCollapse({ 
    isExpanded: isActive, 
    defaultExpanded: isActive,
  });

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      onClick(name => name ? null : tabName)
    }
  }

  return (
    <>
      <StyledAccordionTab
        {...getToggleProps({
          onClick: () => onClick(name => name === tabName ? null : tabName)
        })}
        style={!prereq ? { opacity: 0.5, pointerEvents: "none" } : null}
        onKeyDown={e => handleKeyDown(e)}
      >
        <Flexbox
          alignitems="center"
        >
          <Content
            h5margin="0"
          >
            <h5>{text}</h5>
          </Content>
          {status && status.msg && !isExpanded && (
            <Tag
              backgroundcolor={status.background}
              color={status.color}
              fontweight="700"
              padding="4px 8px"
              margin="0 0 0 8px"
            >
              {status.msg}
            </Tag>
          )}
        </Flexbox>
        <Icon>
          {isExpanded ? (
            <CaretUp size={16} />
          ) : (
            <CaretDown size={16} />
          )}
        </Icon>
      </StyledAccordionTab>
      <Content>
        {!isExpanded && summaries && (
          <>
            {summaries.map((summary, index) => (
              <p key={index}>{summary}</p>
            ))}
          </>
        )}
      </Content>
      <div
        {...getCollapseProps()}
      >
        {children}
      </div>
    </>
  )
}

export { AccordionTab }