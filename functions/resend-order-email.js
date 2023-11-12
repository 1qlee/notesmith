const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const sendgridClient = require('@sendgrid/client')
const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)
sendgridClient.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)

const convertToDecimal = (num, places) => {

  return ((num * 1.0) / 100).toFixed(places)
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid } = body;
  console.log(pid)

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(pid);
    const { id, metadata, shipping, amount, charges } = paymentIntent;
    const { quantity, price, priceId, authKey, shipmentId, rateId, tracking, email } = metadata;
    const shippingRate = metadata.shipping
    const taxRate = metadata.tax
    // get information regarding the product's price
    const orderItem = await stripe.prices.retrieve(priceId);
    // get information regarding the product itself
    const productItem = await stripe.products.retrieve(orderItem.product);
    // the date the payment was succeeded
    const date = new Date(charges.data[0].created * 1000);
    const { last4 } = charges.data[0].payment_method_details.card;
    const subtotal = orderItem.unit_amount * metadata.quantity;

    // sendgrid email template and its data
    const templateData = {
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
            orderId: id,
            date: date.toLocaleString(),
            productImage: productItem.images[0],
            productName: productItem.name,
            productPrice: convertToDecimal(subtotal, 2),
            subtotal: convertToDecimal(subtotal, 2),
            productQuantity: metadata.quantity,
            shippingRate: convertToDecimal(shippingRate, 2),
            taxRate: convertToDecimal(taxRate, 2),
            totalAmount: convertToDecimal(amount, 2),
            carrier: "",
            tracking: tracking,
            authKey: authKey,
            last4: last4,
            english: true
          }
        }
      ]
    }

    await sendgridMail.send(templateData);

    return {
      statusCode: 200,
      body: JSON.stringify({ sent: true }),
    }
  } catch(error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Error"
      }),
    }
  }
}