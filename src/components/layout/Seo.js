import React from "react"
import Helmet from "react-helmet"
import { useSiteMetadata } from "../../hooks/useSiteMetadata"

function Seo({ details, hideScroll }) {
  const { title: defaultTitle, description: defaultDescription, image: defaultImage, siteUrl: defaultUrl } = useSiteMetadata()
  const { title, description, image, url } = details || {}
  console.log("🚀 ~ Seo ~ details:", details)

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: image ? `www.notesmithbooks.com/${image}` : `www.notesmithbooks.com${defaultImage}`,
    url: url ? `${url}` : defaultUrl,
  }
  console.log("🚀 ~ Seo ~ seo:", seo)

  return (
    <Helmet
      bodyAttributes={hideScroll && {
        class: "hide-scroll-y",
      }}
      htmlAttributes={{
        lang: "en",
      }}
      title={`${title} | Notesmith`}
      meta={[
        {
          name: `description`,
          content: seo.description,
        },
        {
          property: `og:title`,
          content: seo.title,
        },
        {
          property: `og:url`,
          content: `${seo.url}`,
        },
        {
          property: `og:description`,
          content: seo.description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: `${seo.url}${image}`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:url`,
          content: `${seo.url}`,
        },
        {
          name: `twitter:image`,
          content: `${seo.url}${image}`,
        },
        {
          name: `twitter:title`,
          content: seo.title,
        },
        {
          name: `twitter:description`,
          content: seo.description,
        },
      ]}
    />
  )
}

export default Seo
