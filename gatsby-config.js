require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Notesmith custom-made notebooks`,
    description: `Made-to-order custom notebooks crafted with your custom-made pages and layouts`,
    username: `@notesmithbooks`,
    siteUrl: `https://www.notesmithbooks.com`,
    image: "/meta-image.jpg"
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://www.notesmithbooks.com',
        sitemap: 'https://www.notesmithbooks.com/sitemap-0.xml',
        resolveEnv: () => process.env.NODE_ENV,
        env: {
          production: {
            policy: [{ userAgent: '*', allow: '/' }]
          },
          'branch-deploy': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null
          },
          'deploy-preview': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null
          }
        },
      }
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        excludes: ['/admin*', '/admin/*', '/account*', '/account/*', '/orders*', '/orders/*', '/forgot', '/subscription', '/cart', '/customize*', '/customize/*', '/customize/*/*', '/invites', '/invites/*'],
        query: `
          {
            allSitePage {
              nodes {
                path
                pageContext
              }
            }
          }
        `,
        resolveSiteUrl: () => `https://www.notesmithbooks.com`,
        resolvePages: ({
          allSitePage: { nodes: allPages },
        }) => {
          return allPages.map(page => {
            return { ...page }
          })
        },
        serialize: ({ path, pageContext }) => {
          return {
            url: path,
            lastmod: pageContext?.lastMod,
          }
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets`,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/
        }
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Notesmith`,
        short_name: `Notesmith`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `minimal-ui`,
        icon: `src/images/fav.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          '/fonts/*': [
            'Cache-Control: public',
            'Cache-Control: max-age=365000000',
            'Cache-Control: immutable',
          ],
        }
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-transformer-json`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-webpack-bundle-analyser-v2`,
    `gatsby-plugin-git-lastmod`,
  ],
}
