import React from "react"
import { useSiteMetadata } from "../../hooks/useSiteMetadata"

function Seo({ title, description, pathname, children, location, params, data, pageContext }) {
  const { title: defaultTitle, description: defaultDescription, image, siteUrl, username } = useSiteMetadata()

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image}`,
    url: `${siteUrl}${pathname || ``}`,
    username,
  }

  return (
    <>
      <title>{seo.title} | Notesmith</title>
      <meta name="description" content={description}></meta>
      <meta name="og:title" content={`${title} | Notesmith`}></meta>
      <meta name="og:url" content={siteUrl}></meta>
      <meta name="og:description" content={description}></meta>
      <meta name="og:image" content={`${siteUrl}${image}`}></meta>
      <meta name="twitter:card" content="summary"></meta>
      <meta name="twitter:url" content={siteUrl}></meta>
      <meta name="twitter:image" content={`${siteUrl}${image}`}></meta>
      <meta name="twitter:title" content={`${title} | Notesmith`}></meta>
      <meta name="twitter:description" content={description}></meta>
      {children}
    </>
  )
}

export default Seo
