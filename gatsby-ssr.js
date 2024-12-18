import * as React from "react"
import { Helmet } from "react-helmet"
import { Script } from "gatsby"

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
    <meta name="description" content="Premium quality custom notebooks with your custom layouts and fountain pen friendly paper. - Notesmith"></meta>,
    <meta property="og:title" content="Premium quality custom notebooks | Custom layouts | Fountain pen friendly paper"></meta>,
    <meta property="og:description" content="Premium quality custom notebooks with your custom layouts and fountain pen friendly paper. - Notesmith"></meta>,
    <meta property="og:image" content="https://www.notesmithbooks.com/meta-image.jpg"></meta>,
    <meta property="og:url" content="https://www.notesmithbooks.com"></meta>,
    <meta property="og:type" content="website"></meta>,
    <meta property="twitter:title" content="Notesmith custom-made notebooks"></meta>,
    <meta property="twitter:description" content="Premium quality custom notebooks with your custom layouts and fountain pen friendly paper. - Notesmith"></meta>,
    <meta property="twitter:image" content="https://www.notesmithbooks.com/meta-image.jpg"></meta>,
    <meta property="twitter:card" content="summary"></meta>,
    <meta property="twitter:creator" content="Notesmith"></meta>,
    <link
      rel="preload"
      href="/fonts/jost-400.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="Jost"
    />,
    <link
      rel="preload"
      href="/fonts/jost-500.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="Jost"
    />,
    <link 
      rel="icon"
      href="/favicon.ico"
      sizes="32x32"
    />,
    <link
      rel="icon"
      href="/icons/icon.svg"
      type="image/svg+xml"
    />,
    <link
      rel="apple-touch-icon"
      href="/icons/apple-touch-icon.png"
    />,
    <link
      rel="manifest"
      href="/manifest.webmanifest"
    />,
    <Script
      src="https://js.stripe.com/v3"
      strategy="off-main-thread"
    />,
    <Script 
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GATSBY_GTAG}`}
      strategy="off-main-thread"
    />,
    <Script
      id="gtag-config"
      strategy="off-main-thread"
      forward={['dataLayer.push', 'gtag']}
    >
      {`
        dataLayer = window.dataLayer || [];
        window.gtag = function () {dataLayer.push(arguments);};
        window.gtag('js', new Date());
        window.gtag('config', "${process.env.GATSBY_GTAG}", { page_path: location ? location.pathname + location.search + location.hash : undefined })
      `}
    </Script>
  ])
} 