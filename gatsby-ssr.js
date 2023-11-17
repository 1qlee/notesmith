import * as React from "react"

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      rel="preload"
      href="/fonts/jost-var.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="jostFont"
    />,
    <link
      rel="preload"
      href="/fonts/nm-400-normal.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="nm400Font"
    />,
    <link
      rel="preload"
      href="/fonts/nm-700-normal.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="nm700Font"
    />,
  ])
}