import * as React from "react"
import { Helmet } from "react-helmet"

import wrapProvider from "./wrap-provider"

export const wrapRootElement = wrapProvider

export const onRenderBody = ({ 
  setHeadComponents, 
  setHtmlAttributes, 
  setBodyAttributes 
}, pluginOptions) => {
  const helmet = Helmet.renderStatic()
  setHtmlAttributes(helmet.htmlAttributes.toComponent())
  setBodyAttributes(helmet.bodyAttributes.toComponent())
  setHeadComponents([
    helmet.title.toComponent(),
    helmet.link.toComponent(),
    helmet.meta.toComponent(),
    helmet.noscript.toComponent(),
    helmet.script.toComponent(),
    helmet.style.toComponent(),
    <meta name="description" content="Made-to-order custom notebooks crafted with your custom-made pages and layouts - Notesmith"></meta>,
    <meta property="og:title" content="Notesmith custom-made notebooks"></meta>,
    <meta property="og:description" content="Made-to-order custom notebooks crafted with your custom-made pages and layouts - Notesmith"></meta>,
    <meta property="og:image" content="www.notesmithbooks.com/meta-image.jpg"></meta>,
    <meta property="og:type" content="website"></meta>,
    <meta property="twitter:title" content="Notesmith custom-made notebooks"></meta>,
    <meta property="twitter:description" content="Made-to-order custom notebooks crafted with your custom-made pages and layouts - Notesmith"></meta>,
    <meta property="twitter:image" content="www.notesmithbooks.com/meta-image.jpg"></meta>,
    <meta property="twitter:card" content="summary"></meta>,
    <meta property="twitter:creator" content="Notesmith"></meta>,
    <meta property="twitter:image" content="www.notesmithbooks.com/meta-image.jpg"></meta>,
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

// Hack, to reorder the helmet components as first in <head> tag
// export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
//   const headComponents = getHeadComponents()
//   console.log("🚀 ~ onPreRenderHTML ~ headComponents:", headComponents)

//   headComponents.sort((a, b) => {
//     if (a.type === 'meta') {
//       return 0;
//     }
//     return 1;
//   })

//   replaceHeadComponents(headComponents)
// }