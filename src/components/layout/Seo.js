import React from "react"
import { Helmet } from "react-helmet"
import { useSiteMetadata } from "../../hooks/useSiteMetadata"

function Seo({ details, hideScroll }) {
  const { title: defaultTitle, description: defaultDescription, image: defaultImage, siteUrl: defaultUrl } = useSiteMetadata()
  const { title, description, image, url } = details || {}
  // const meta = {
  //   [
  //   {
  //     name: `description`,
  //     content: seo.description,
  //   },
  //   {
  //     property: `og:title`,
  //     content: seo.title,
  //   },
  //   {
  //     property: `og:description`,
  //     content: seo.description,
  //   },
  //   {
  //     property: `og:type`,
  //     content: `website`,
  //   },
  //   {
  //     property: `og:image`,
  //     content: seo.image,
  //   },
  //   {
  //     name: `twitter:card`,
  //     content: `summary`,
  //   },
  //   {
  //     name: `twitter:creator`,
  //     content: "Notesmith",
  //   },
  //   {
  //     name: `twitter:title`,
  //     content: seo.title,
  //   },
  //   {
  //     name: `twitter:description`,
  //     content: seo.description,
  //   },
  //   {
  //     name: `twitter:image`,
  //     content: seo.image,
  //   }
  // ]}

  const seo = {
    title: `${title} - Notesmith` || `${defaultTitle} - Notesmith`,
    description: description || defaultDescription,
    image: image ? `https://www.notesmithbooks.com/${image}` : `https://www.notesmithbooks.com${defaultImage}`,
    url: url ? `${url}` : defaultUrl,
  }

  return (
    <Helmet
      htmlAttributes={{
        lang: "en",
      }}
      bodyAttributes={hideScroll && {
        class: "hide-scroll-y",
      }}
      title={seo.title}
    />
  )
}

export default Seo
