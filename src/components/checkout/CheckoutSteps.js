import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { CaretDown, CaretUp } from "@phosphor-icons/react"
import { useCollapse } from "react-collapsed"

import { Flexbox } from "../layout/Flexbox"
import { Infobox, InfoItemHeading, InfoItemText, InfoItem } from "../shop/ShippingInfo"
import Icon from "../ui/Icon"
import Content from "../ui/Content"
import Tag from "../ui/Tag"

const StyledCheckoutSteps = styled.div`
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

const CheckoutSteps = ({ 
  activeCheckoutSteps,
  children,
  onClick,
  prereq,
  status,
  summaries,
  tabName,
  text,
}) => {
  const isActive = activeCheckoutSteps === tabName
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
      <StyledCheckoutSteps
        {...getToggleProps({
          onClick: () => onClick(name => name === tabName ? null : tabName)
        })}
        style={!prereq ? { opacity: 0.5, pointerEvents: "none" } : null}
        onKeyDown={e => handleKeyDown(e)}
      >
        <Flexbox
          align="center"
          justify="space-between"
          width="100%"
        >
          <Content
            h5margin="0"
            h5fontweight='400'
            h5fontsize="1.25rem"
          >
            <h5>{text}</h5>
          </Content>
          {status && status.msg && !isExpanded && (
            <Tag
              backgroundcolor={status.color}
              color={colors.white}
              border={`1px solid ${status.color}`}
              fontweight="700"
              padding="2px"
              margin="0 8px"
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
      </StyledCheckoutSteps>
      {!isExpanded && summaries && (
        <Infobox>
          {summaries.map((summary, index) => (
            <InfoItem key={index}>
              <InfoItemHeading>{summary.heading}</InfoItemHeading>
              <InfoItemText>{summary.text}</InfoItemText>
            </InfoItem>
          ))}
        </Infobox>
      )}
      <div
        {...getCollapseProps()}
      >
        {children}
      </div>
    </>
  )
}

export default CheckoutSteps