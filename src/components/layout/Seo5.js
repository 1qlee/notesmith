import React from "react"
import { useSiteMetadata } from "../../hooks/useSiteMetadata"

const Seo = ({ details, hideScroll, children }) => {
  const { title: defaultTitle, description: defaultDescription, image: defaultImage, siteUrl: defaultUrl } = useSiteMetadata()
  const { title, description, image, url } = details || {}

  const seo = {
    title: `${title} - Notesmith` || `${defaultTitle} - Notesmith`,
    description: description || defaultDescription,
    image: image ? `https://www.notesmithbooks.com/${image}` : `https://www.notesmithbooks.com${defaultImage}`,
    url: url ? `${url}` : defaultUrl,
  }

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:creator" content="Notesmith" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      {children}
    </>
  )
}

export default Seo