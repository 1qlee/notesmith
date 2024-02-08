import React from "react"
import { Helmet } from "react-helmet"
import { useSiteMetadata } from "../../hooks/useSiteMetadata"

function Seo({ details, hideScroll }) {
  const { title: defaultTitle, description: defaultDescription, image: defaultImage, siteUrl: defaultUrl } = useSiteMetadata()
  const { title, description, image, url } = details || {}

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: image ? `https://www.notesmithbooks.com/${image}` : `https://www.notesmithbooks.com${defaultImage}`,
    url: url ? `${url}` : defaultUrl,
  }

  return (
    <Helmet
      bodyAttributes={hideScroll && {
        class: "hide-scroll-y",
      }}
      htmlAttributes={{
        lang: "en",
      }}
    >
      <title>{title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <link rel="canonical" href={seo.url} />

      {/* OpenGraph tags */}
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="Notesmith" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  )
}

export default Seo
