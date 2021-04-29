require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Notesmith - Unique, custom notebooks made to order`,
    description: `Design and create your own unique notebook with fully customizable pages. Every notebook is made-to-order and custom printed specially for you.`,
    author: `@notesmith`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-stripe`,
      options: {
        objects: ['Balance', 'BalanceTransaction', 'Product', 'Price', 'ApplicationFee', 'Sku', 'Subscription'],
        secretKey: `${process.env.GATSBY_STRIPE_SECRET_KEY || process.env.GATSBY_STRIPE_SECRET_KEY_TEST || "sk_test_51IDyQgIN24Fw2SWdjfxPZJ02aac6rtFhUulDKlhXBbPwq3rYEZeywzB5gB3ZdW0RSRdzMJCGk05UFWNpgRJ3jq5w00FR59sIsF"}`,
        downloadFiles: true,
      }
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`, `/orders/*`] },
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
          include: /assets/ // See below to configure properly
        }
      }
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID || "88un70hhvnz3",
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "8ifX-8dB75Bs8kQtc8Scea1JHkbeLwXqxpG5xVyhEJE",
        downloadLocal: true,
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Crimson Pro\:400,400i,700`,
          `Spectral\:400,700,700i`,
        ]
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Notesmith`,
        short_name: `Notesmith`,
        start_url: `/`,
        background_color: `#234342`,
        theme_color: `#234342`,
        display: `minimal-ui`,
        icon: `src/images/fav.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: process.env.GATSBY_FIREBASE_API_KEY || "AIzaSyAZ1VZdx66fX5ok9uW8enCjM",
          authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN || "notesmith-765c3.firebaseapp.com",
          databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL || "https://notesmith-765c3.firebaseio.com",
          projectId: process.env.GATSBY_FIREBASE_PROJECT_ID || "notesmith-765c3",
          storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET || "notesmith-765c3.appspot.com",
          messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID || "56797146951",
          appId: process.env.GATSBY_FIREBASE_APP_ID || "1:56797146951:web:df2b3e29b067e438962662",
          measurementId: process.env.GATSBY_FIREBASE_MEASUREMENT_ID || "G-9S05PJ9HT1"
        }
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-styled-components`,
  ],
}
