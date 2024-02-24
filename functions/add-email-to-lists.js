const sendgridClient = require('@sendgrid/client')
const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)
sendgridClient.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { email } = body;
  const lists = [
    "e05a027d-da7d-4bec-8f5b-184e99ea112d",
    "cc2979e2-1ea6-4706-bc25-f51d1221b20b",
    "b8f3fbcd-10dc-44c6-98f3-64ec7901f960",
  ]

  try {
    const request = {
      method: 'PUT',
      url: '/v3/marketing/contacts',
      headers: {
        "Authorization": `Bearer ${process.env.GATSBY_SENDGRID_API_KEY}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        list_ids: lists,
        contacts: [
          {
            email: email
          }
        ]
      })
    };

    const [response] = await sendgridClient.request(request)

    if (response.statusCode === 202) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          msg: "Successfully added email to lists."
        })
      }
    }
    else {
      console.error(`[Sendgrid] Error when adding ${email} to list(s) [${lists}]`)
      throw {
        error: "Couldn't add email to lists."
      }
    }
  } catch(error) {
    console.error(`[Sendgrid] Error adding contact to lists: ${error}`)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "There was an error subscribing you to the mailing list. The link in your email may have expired. Please try signing up again."
      })
    }
  }
}