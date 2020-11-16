import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Img from "gatsby-image"
import { colors } from "../styles/variables"
import PageProfile1 from "../assets/pageProfiles/pageProfile-1.svg"
import PageProfile2 from "../assets/pageProfiles/pageProfile-2.svg"
import PageProfile3 from "../assets/pageProfiles/pageProfile-3.svg"
import PageProfile4 from "../assets/pageProfiles/pageProfile-4.svg"
import PageProfile5 from "../assets/pageProfiles/pageProfile-5.svg"

const PageWrapper = styled.div`
  position: relative;
  height: 500px;
`

const PageProfileCard = styled.div`
  box-shadow: 0 50px 100px -20px ${colors.shadow.dark};
  position: absolute;
  right: -25%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`

const PageProfile = styled.div`
  align-items: center;
  background-color: ${colors.white};
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 4px;
  padding: 1rem;
  position: relative;
  width: 250px;
  &.color-0 {
    background-color: ${colors.blue.sixHundred};
    &::after {
      border-color: ${colors.blue.sixHundred};
    }
  }
  &.color-1 {
    background-color: ${colors.red.sixHundred};
    &::after {
      border-color: ${colors.red.sixHundred};
    }
  }
  &.color-2 {
    background-color: ${colors.green.sixHundred};
    &::after {
      border-color: ${colors.green.sixHundred};
    }
  }
  &.color-3 {
    background-color: ${colors.purple.sixHundred};
    &::after {
      border-color: ${colors.purple.sixHundred};
    }
  }
  &.color-4 {
    background-color: ${colors.primary.sixHundred};
    &::after {
      border-color: ${colors.primary.sixHundred};
    }
  }
  &::after {
    border-radius: 1rem;
    border: 4px solid red;
    content: "";
    height: calc(100% + 1rem);
    position: absolute;
    width: calc(100% + 1rem);
    z-index: -1;
  }
`

const PageProfileTagLine = styled.h3`
  box-shadow: inset 0 -1px 0 ${colors.white};
  color: ${colors.white};
  font-size: 0.65rem;
  font-weight: 400;
  margin-bottom: 0;
  text-transform: uppercase;
`

const PageProfileName = styled.h4`
  color: ${colors.white};
  font-size: 1rem;
  margin: 0.5rem 0 1rem 0;
`

const PageProfileType = styled.span`
  background-color: ${colors.white};
  font-size: 0.7rem;
  line-height: 1.25;
  margin: 1rem auto;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  &.color-0 {
    color: ${colors.blue.sixHundred};
  }
  &.color-1 {
    color: ${colors.red.sixHundred};
  }
  &.color-2 {
    color: ${colors.green.sixHundred};
  }
  &.color-3 {
    color: ${colors.purple.sixHundred};
  }
  &.color-4 {
    color: ${colors.primary.sixHundred};
  }
`

const PageProfileList = styled.ul`
  list-style: none;
  width: 100%;
`

const PageProfileListItem = styled.li`
  color: ${colors.primary.oneHundred};
  margin: 0.5rem 1rem;
  position: relative;
  font-size: 1rem;
  &::before {
    background-color: ${colors.primary.oneHundred};
    content: "";
    height: 1px;
    left: -0.75rem;
    position: absolute;
    top: 50%;
    width: 0.5rem;
  }
`

const PageProfileImage = styled.figure`
  display: block;
  .gatsby-image-wrapper {
    border-radius: 100%;
    border: 2px solid white;
    box-shadow: inset 0 4px 8px ${colors.shadow.inset}, inset 0 0 1px ${colors.shadow.inset};
    height: 50px;
    width: 50px;
  }
`

const PageSvgWrapper = styled.div`
  background: ${colors.paper.cream};
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  border: 1px solid ${colors.gray.sixHundred};
  height: 100%;
  width: 500px;
`

function PageProfileSvg(props) {
  const { activeProfile } = props

  switch(activeProfile) {
    case 0:
      return <PageProfile1 />
    case 1:
      return <PageProfile2 />
    case 2:
      return <PageProfile3 />
    case 3:
      return <PageProfile4 />
    case 4:
      return <PageProfile5 />
    default:
      return null
  }
}

function PageCarousel(props) {
  const { profiles, profileImages } = props
  const [activeProfile, setActiveProfile] = useState(0)

  useEffect(() => {
    cycleProfiles()
  }, [])

  function cycleProfiles() {
    let counter = 0
    return setInterval(() => {
      if (counter < 4) {
        counter++
        return setActiveProfile(counter)
      }
      else {
        counter = 0
        setActiveProfile(counter)
        clearInterval()
      }
    }, 2000)
  }

  return (
    <PageWrapper>
      <PageSvgWrapper>
        <PageProfileSvg activeProfile={activeProfile} />
      </PageSvgWrapper>
      <PageProfileCard>
        <PageProfile className={`color-${activeProfile}`}>
          <PageProfileTagLine>Made By</PageProfileTagLine>
          <PageProfileName>{profiles[activeProfile].name}</PageProfileName>
          <PageProfileImage>
            <Img loading="eager" fluid={profileImages[activeProfile].fluid} />
          </PageProfileImage>
          <PageProfileType className={`color-${activeProfile}`}>
            {profiles[activeProfile].type}
          </PageProfileType>
          <PageProfileList>
            {profiles[activeProfile].list.map(listItem => (
              <PageProfileListItem>{listItem}</PageProfileListItem>
            ))}
          </PageProfileList>
        </PageProfile>
      </PageProfileCard>
    </PageWrapper>
  )
}

export default PageCarousel
