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
          subject: "Confirm your subscription to Notesmith",
          preheader: "Confirm your subscription by clicking on the button in the email.",
          heading: "Confirm your subscription",
          text: "Please confirm your subscription to Notesmith's mailing list by clicking on the button below. If you didn't subscribe to this list or you're not sure why you received this email, you can delete it. You will not be subscribed if you don't click on the button.",
          button_text: "Confirm subscription",
          button_url: `https://www.notesmithbooks.com/subscription/?list=cc2979e2-1ea6-4706-bc25-f51d1221b20b&list=e05a027d-da7d-4bec-8f5b-184e99ea112d&key=${id}`,
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
