require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

const { privateKey } = JSON.parse(process.env.GATSBY_FIREBASE_PRIVATE_KEY)

module.exports = {
  project_id: process.env.GATSBY_FIREBASE_PROJECT_ID,
  private_key: privateKey,
  client_email: process.env.GATSBY_FIREBASE_CLIENT_EMAIL
}