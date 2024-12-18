const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY);

const convertToDecimal = (num, places) => {
  return ((num * 1.0) / 100).toFixed(places)
}

// email the customer a digital receipt
exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid } = body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(pid);
    const { status, metadata, amount } = paymentIntent;

    if (status === "succeeded") {
      const { latest_charge } = paymentIntent;
      const { tax, authKey, shipping, subtotal, email, orderId, orderKey, datePaid, trackingUrl } = metadata;
      const { address } = paymentIntent.shipping;
      const date = new Date(+datePaid).toLocaleString()
      const charge = await stripe.charges.retrieve(latest_charge);
      const { payment_method_details, created } = charge;
      const paymentType = payment_method_details.type;

      let templateData = {
        template_id: "d-abcd18cd57cd41aa8d857ccdfd01da92",
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
              address: address,
              authKey: authKey,
              date: date,
              english: true,
              orderId: orderId,
              orderKey: orderKey,
              paymentType: paymentType,
              shippingRate: convertToDecimal(shipping, 2),
              subtotal: convertToDecimal(subtotal, 2),
              taxRate: tax ? convertToDecimal(tax, 2) : "0",
              totalAmount: convertToDecimal(amount, 2),
              trackingUrl: trackingUrl,
            }
          }
        ]
      }

      if (payment_method_details.card) {
        templateData.personalizations[0].dynamic_template_data.last4 = payment_method_details.card.last4;
      }

      console.log("[Stripe - send-email-receipt] Sending email receipt...")
      await sendgridMail.send(templateData);

      return {
        statusCode: 200,
        body: JSON.stringify({ received: true }),
      };
    }
  } catch (error) {
    console.log(`[Netlify] Stripe webhook failed with ${error}`);

    return {
      statusCode: 400,
      body: `Webhook Error: ${error.message}`,
    };
  }
}
