const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid, error, cartItems, address } = body;

  // loop through cartItems and save weight and quantity to itemDetails
  const itemDetails = {
    weight: 0,
    quantity: 0,
  }
  cartItems.forEach(item => {
    itemDetails.weight += item.weight * item.quantity
    itemDetails.quantity += item.quantity
  })

  try {
    const templateData = {
      template_id: "d-cf4a34243518483b9ceb28dfaeb0e7d8",
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
            weight: itemDetails.weight,
            quantity: itemDetails.quantity,
            address: address,
          }
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