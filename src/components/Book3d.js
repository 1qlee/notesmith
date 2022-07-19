import React from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../styles/variables"

const initAnimation = keyframes`
  to {
    transform: rotate3d(0,1,0,0);
  }
`

const Pages = styled.div`
  position: absolute;
  content: '';
  left: ${props => props.left || 0};
  top: 4px;
  width: 48px;
  height: 596px;
  transform: translateX(382px) rotate3d(0,1,0,90deg);
  background: linear-gradient(90deg,
    ${colors.gray.oneHundred} 0%,
    ${colors.gray.threeHundred} 5%,
    ${colors.gray.oneHundred} 10%,
    ${colors.gray.threeHundred} 15%,
    ${colors.gray.oneHundred} 20%,
    ${colors.gray.threeHundred} 25%,
    ${colors.gray.oneHundred} 30%,
    ${colors.gray.threeHundred} 35%,
    ${colors.gray.oneHundred} 40%,
    ${colors.gray.threeHundred} 45%,
    ${colors.gray.threeHundred} 50%,
    ${colors.gray.oneHundred} 55%,
    ${colors.gray.threeHundred} 60%,
    ${colors.gray.threeHundred} 65%,
    ${colors.gray.oneHundred} 70%,
    ${colors.gray.threeHundred} 75%,
    ${colors.gray.oneHundred} 80%,
    ${colors.gray.threeHundred} 85%,
    ${colors.gray.oneHundred} 90%,
    ${colors.gray.threeHundred} 95%,
    ${colors.gray.oneHundred} 100%
  );
`

const Book3dWrapper = styled.div`
  perspective: 2800px;
`

const StyledBook3d = styled.div`
  position: relative;
  transform-style: preserve-3d;
  transform: rotate3d (0,1,0,0);
  transition: 1s ease;
  animation: 1s ease 0s 1 ${initAnimation};
  &:hover {
    transform: rotate3d(0,1,0,-30deg);
  }
  & > :first-child {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateZ(25px);
    height: 600px;
    width: 410px;
    filter: brightness(1.05) contrast(1.2);
  }
  &::after {
    position: absolute;
    top: 2px;
    left: 20px;
    content: '';
    width: 380px;
    height: 600px;
    transform: translateZ(-25px);
    background-color: ##fcfeff;
    box-shadow: 4px -4px 16px ${colors.shadow.float}, 8px 8px 16px ${colors.shadow.float}, 4px 4px 16px ${colors.shadow.float}, 16px 8px 16px ${colors.shadow.float};
  }
`

function Book3d({ children }) {
  return (
    <Book3dWrapper>
      <StyledBook3d>
        {children}
        <Pages left="-380px" />
        <Pages />
      </StyledBook3d>
    </Book3dWrapper>
  )
}

export default Book3d