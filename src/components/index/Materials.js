import React from "react"
import { colors, fonts } from "../../styles/variables"

import Content from "../ui/Content"
import { Flexbox } from "../layout/Flexbox"
import Box from "../ui/Box"

const qualities = {
  paper: [
    {
      heading: "Total pages",
      text: "140 pages"
    },
    {
      heading: "Weight",
      text: "70# (~105gsm) text"
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
      heading: "Feature",
      text: "Water resistant"
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
        h3margin="0"
        margin="0 0 16px"
      >
        <h3>{tab}</h3>
      </Content>
      <Box
        margin="0 0 16px"
      >
        {qualities[tab.toLowerCase()].map((quality, index) => (
          <Flexbox
            flex="flex"
            align="center"
            justify="space-between"
            bordercolor={colors.gray.nineHundred}
            className="has-border-bottom"
            padding="0 0 16px"
            margin="0 0 16px"
          >
            <Content
              paragraphfontsize="1rem"
              margin="0"
            >
              <p>
                {quality.heading}
              </p>
            </Content>
            <Content
              paragraphfontsize="1rem"
              margin="0"
            >
              <p>
                {quality.text}
              </p>
            </Content>
          </Flexbox>
        ))}
      </Box>
    </>
  )
}

export default Materials