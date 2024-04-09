require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Notesmith custom-made notebooks`,
    description: `Premium quality custom-made notebooks with your custom layouts and fountain pen friendly paper.`,
    username: `@notesmithbooks`,
    siteUrl: `https://www.notesmithbooks.com`,
    image: "/meta-image.jpg"
  },
  partytownProxiedURLs: [
    `https://www.googletagmanager.com/gtag/js?id=${process.env.GATSBY_GTAG}`,
    `https://www.google-analytics.com/analytics.js`,
    "https://js.stripe.com/v3",
  ],
  headers: [
    {
      source: `/.well-known/apple-developer-merchantid-domain-association/`,
      headers: [
        {
          key: `Content-Type`,
          value: `application/json`,
        },
      ]
    },
    {
      source: `/apple-developer-merchantid-domain-association/`,
      headers: [
        {
          key: `Content-Type`,
          value: `application/json`,
        },
      ]
    },
    {
      source: `/fonts/*`,
      headers: [
        {
          key: `Access-Control-Allow-Origin`,
          value: `https://js.stripe.com`,
        },
        {
          key: `Cache-Control`,
          value: `public, max-age=31536000`,
        }
      ]
    }
  ],
  plugins: [
    {
      resolve: `gatsby-plugin-gdpr-cookies`,
      options: {
        googleAnalytics: {
          trackingId: 'G-6P3H5Q84XJ', // leave empty if you want to disable the tracker
          cookieName: 'gatsby-gdpr-google-analytics', // default
          anonymize: true, // default
          allowAdFeatures: true // default
        },
        environments: ['production', 'development'],
      },
    },
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
