const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const sendgrid = require('@sendgrid/client')
sendgrid.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { email } = body;
  const request = {
    method: 'PUT',
    url: '/v3/marketing/contacts',
    headers: {
      "Authorization": `Bearer ${process.env.GATSBY_SENDGRID_API_KEY}`,
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      list_ids: [
        "86ea0025-dfa9-40c4-bc44-ccf53fc8f477"
      ],
      contacts: [
        {
          email: email
        }
      ]
    })
  };

  try {
    const putContact = await sendgrid.request(request).then(([response, body]) => {
      console.log(body)
      return {
        statusCode: response.statusCode,
        body: JSON.stringify({
          msg: "Thanks for signing up!"
        })
      }
    })

    return putContact
  } catch(error) {
    console.log(error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "Error"
      })
    }
  }
}
