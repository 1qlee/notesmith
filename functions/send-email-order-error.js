const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid, error, cartItems } = body;

  try {
    const templateData = {
      template_id: "d-929f322693bb41879356ddcd9c897d70",
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
              email: "errors@notesmithbooks.com"
            }
          ],
          dynamic_template_data: {
            error: error,
            pid: pid,
            items: cartItems,
          }
        }
      ]
    }

    await sendgridMail.send(templateData)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" })
    }
  } catch(error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending email" })
    }
  }
}