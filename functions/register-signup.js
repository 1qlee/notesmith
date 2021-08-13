const sendgridClient = require('@sendgrid/client')
const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)
sendgridClient.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { email } = body;

  const templateData = {
    template_id: "d-c4a7c6e190f14f1b8fcb19564b276f23",
    from: {
      email: "general@notesmithbooks.com",
      name: "Notesmith"
    },
    reply_to: {
      email: "general@notesmithbooks.com",
      name: "Notesmith"
    },
    personalizations: [
      {
        to: [
          {
            email: email
          }
        ],
        dynamic_template_data: {
          text: "Thank you for signing up for Notesmith's early access. We will reach out to you once the early access phase is available.",
          english: true
        }
      }
    ]
  }

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
    const putContact = await sendgridClient.request(request).then(([response, body]) => {
      return {
        statusCode: response.statusCode,
        body: JSON.stringify({
          msg: "Thanks for signing up!"
        })
      }
    })

    await sendgridMail.send(templateData)

    return putContact
  } catch(error) {
    console.log(error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Error"
      })
    }
  }
}
