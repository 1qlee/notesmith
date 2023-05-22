const sendgridClient = require('@sendgrid/client')
const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)
sendgridClient.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { email, id } = body;

  const templateData = {
    template_id: "d-c306eb61b4914abca8a73f23265649be",
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
          subject: "Please confirm your subscription",
          preheader: "You have signed up to our mailing list.",
          heading: "Confirm your subscription",
          text: "Please confirm that you'd like to subscribe to join our mailing list to receive exlusive offers, news, and other updates. If you didn't subscribe to this list or you're not sure why you received this email, you can delete it. You will not be subscribed if you don't click on the link above.",
          button_text: "Click to subscribe",
          button_url: `http://localhost:8888/subscription/?list=e05a027d-da7d-4bec-8f5b-184e99ea112d&list=cc2979e2-1ea6-4706-bc25-f51d1221b20b&key=${id}`,
          english: true
        }
      }
    ]
  }

  try {
    await sendgridMail.send(templateData)

    console.log(`[Sendgrid] Successfully sent signup confirmation email to ${email}`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: "Success! Please check your email to confirm your subscription."
      })
    }
  } catch(error) {
    console.error(`[Sendgrid] ${error}`)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Error when signing up."
      })
    }
  }
}
