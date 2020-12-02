require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Notesmith`,
    description: `Custom printed notebooks made for you because they're made by you. Design and create your Notesmith notebook today!`,
    author: `@notesmith`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
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
          `Spectral\:400,400i,700`,
        ]
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Notesmith`,
        short_name: `Notesmith`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
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
    `gatsby-plugin-sharp`,
    `gatsby-plugin-styled-components`,
  ],
}
