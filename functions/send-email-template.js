const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { from, to } = body;

  try {
    const templateData = {
      template_id: "d-7eab66ed51c74eceb1061b1781e07a51", // generic template
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

    console.log(`[Sendgrid] Sending email to: ${to}`);

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