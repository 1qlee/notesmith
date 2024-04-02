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
      key="jostFont"
    />,
    <link
      rel="preload"
      href="/fonts/jost-500.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="jostFont"
    />,
    <Script
      src="https://js.stripe.com/v3"
      strategy="off-main-thread"
    />,
    <Script 
      src="https://www.googletagmanager.com/gtag/js?id=G-6P3H5Q84XJ" 
      strategy="post-hydrate"
    />,
    <Script
      id="gtag-config"
      strategy="post-hydrate"
      forward={[`gtag`]}
    >
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-6P3H5Q84XJ');
      `}
    </Script>
  ])
} 