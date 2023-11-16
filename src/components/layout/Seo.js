import React from "react"
import { useSiteMetadata } from "../../hooks/useSiteMetadata"

function Seo({ title, description, pathname, children, location, params, data, pageContext }) {
  const { title: defaultTitle, description: defaultDescription, image, url, username } = useSiteMetadata()

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${url}${image}`,
    url: `${url}${pathname || ``}`,
    username,
  }

  return (
    <>
      <title>{seo.title} | Notesmith</title>
      <meta name="description" content={description}></meta>
      <meta name="og:title" content={title}></meta>
      <meta name="og:url" content={url}></meta>
      <meta name="og:description" content={description}></meta>
      <meta name="og:image" content={`${url}${image}`}></meta>
      <meta name="twitter:card" content="summary"></meta>
      <meta name="twitter:url" content={url}></meta>
      <meta name="twitter:image" content={`${url}${image}`}></meta>
      <meta name="twitter:title" content={title}></meta>
      <meta name="twitter:description" content={description}></meta>
      {children}
    </>
  )
}

export default Seo
