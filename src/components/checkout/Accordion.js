import React from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"
import { CaretDown, CaretUp } from "phosphor-react"
import { useCollapse } from "react-collapsed"

import Icon from "../ui/Icon"
import Content from "../ui/Content"

const StyledAccordionTab = styled.div`
  padding: ${props => props.padding || "16px 0"};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${colors.borders.black};
  cursor: pointer;
`

const AccordionTab = ({ 
  activeAccordionTab,
  children,
  onClick,
  summaries,
  prereq,
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
        <Content
          headingfontfamily={fonts.secondary}
          h3fontsize="1rem"
          h3margin="0"
        >
          <h3>{text}</h3>
        </Content>
        <Icon>
          {isExpanded ? (
            <CaretUp size={16} />
          ) : (
            <CaretDown size={16} />
          )}
        </Icon>
      </StyledAccordionTab>
      <Content
        paragraphfontfamily={fonts.secondary}
        paragraphfontsize="0.875rem"
      >
        {!isExpanded && summaries && (
          <>
            {summaries.map((summary, index) => (
              <p>{summary}</p>
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