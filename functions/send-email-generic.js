const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  console.log("🚀 ~ file: send-email-generic.js:6 ~ exports.handler= ~ body:", body)
  const { templateId, from, to } = body;

  try {
    const templateData = {
      template_id: templateId,
      from: {
        email: from || "general@notesmithbooks.com",
        name: "Notesmith"
      },
      reply_to: {
        email: from || "general@notesmithbooks.com",
        name: "Notesmith"
      },
      personalizations: [
        {
          to: [
            {
              email: to,
            }
          ],
          dynamic_template_data: body,
        }
      ]
    }

    await sendgridMail.send(templateData)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" })
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending email" })
    }
  }
}