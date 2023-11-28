import React from "react"
import { useSiteMetadata } from "../../hooks/useSiteMetadata"

function Seo({ details }) {
  const { title: defaultTitle, description: defaultDescription, image: defaultImage, siteUrl: defaultUrl } = useSiteMetadata()
  const { title, description, image, url } = details || {}

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${url}${image}` || defaultImage,
    url: `${url}` || defaultUrl,
  }

  return (
    <>
      <title>{seo.title} | Notesmith</title>
      <meta name="description" content={description}></meta>
      <meta name="og:title" content={`${title} | Notesmith`}></meta>
      <meta name="og:url" content={seo.url}></meta>
      <meta name="og:description" content={description}></meta>
      <meta name="og:image" content={`${seo.url}${image}`}></meta>
      <meta name="twitter:card" content="summary"></meta>
      <meta name="twitter:url" content={seo.url}></meta>
      <meta name="twitter:image" content={`${seo.url}${image}`}></meta>
      <meta name="twitter:title" content={`${title} | Notesmith`}></meta>
      <meta name="twitter:description" content={description}></meta>
    </>
  )
}

export default Seo
