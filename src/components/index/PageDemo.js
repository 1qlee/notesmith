import React from "react"
import styled from "styled-components"
import { StaticImage } from "gatsby-plugin-image"

import ProfileCircle1 from "../../assets/peeps/sweater-paper.svg"
import ProfilePage1 from "../../assets/index/index-page-1.svg"
import PageDemo1 from "../../assets/index/page-demo-0.svg"
import PageDemo2 from "../../assets/index/page-demo-1.svg"
import PageDemo3 from "../../assets/index/page-demo-2.svg"

const StyledPageDemo = styled.div`
  position: relative;
`

const DemoProfile = styled.div`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
  z-index: 3;
`

const DemoImageWrapper = styled.div`
  position: relative;
  margin: 0 auto;
`

const DemoImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

function PageDemo({
  image
}) {
  return (
    <StyledPageDemo>
      <DemoImageWrapper>
        <StaticImage
          src="../../images/index/splash-image-blank.jpg"
          alt="Ink on paper"
          placeholder="blurred"
          loading="eager"
          quality={100}
        />
        <DemoImage>
          <PageDemo3
            width="100%"
            height="100%"
          />
        </DemoImage>
      </DemoImageWrapper>
    </StyledPageDemo>
  )
}

export default PageDemo