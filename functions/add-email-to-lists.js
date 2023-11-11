const sendgridClient = require('@sendgrid/client')
const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)
sendgridClient.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { lists, email } = body;

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