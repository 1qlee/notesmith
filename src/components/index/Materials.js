import React from "react"
import { colors, fonts } from "../../styles/variables"

import Content from "../ui/Content"
import { Flexbox } from "../layout/Flexbox"

const qualities = {
  paper: [
    {
      heading: "Total pages",
      text: "140 pages"
    },
    {
      heading: "Weight",
      text: "80# (~105gsm) text"
    },
    {
      heading: "Type",
      text: "Coated (ultra smooth)"
    },
    {
      heading: "Color",
      text: "Bright white"
    }
  ],
  cover: [
    {
      heading: "Weight",
      text: "250# (~676gsm) cover"
    },
    {
      heading: "Mounting",
      text: "Double-mounted"
    },
    {
      heading: "Color",
      text: "White, black"
    }
  ],
  lamination: [
    {
      heading: "Film",
      text: "Sand matte"
    },
    {
      heading: "Type",
      text: "Textured"
    },
    {
      heading: "Applied",
      text: "Double-sided both covers"
    },
  ],
  binding: [
    {
      heading: "Type",
      text: "Wire-O"
    },
    {
      heading: "Color",
      text: "Gold"
    },
  ]
}

const Materials = ({ tab }) => {

  return (
    <>
      <Content
        headingfontfamily={fonts.secondary}
        h3fontsize="1.25rem"
        margin="0 0 32px"
      >
        <h3>{tab}</h3>
      </Content>
      {qualities[tab.toLowerCase()].map((quality, index) => (
        <>
          <Flexbox
            flex="flex"
            align="center"
            justify="space-between"
            bordercolor={colors.gray.nineHundred}
            className="has-border-bottom"
            padding="16px 0"
          >
            <Content
              paragraphfontsize="1.25rem"
              margin="0"
            >
              <p>
                {quality.heading}
              </p>
            </Content>
            <Content
              paragraphfontsize="1.25rem"
              margin="0"
            >
              <p>
                {quality.text}
              </p>
            </Content>

          </Flexbox>
        </>
      ))}
    </>
  )
}

export default Materials