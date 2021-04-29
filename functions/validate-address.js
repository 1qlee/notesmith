const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY || process.env.GATSBY_STRIPE_SECRET_KEY_TEST);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API || process.env.GATSBY_EASYPOST_API_TEST);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { address } = body;

  const addressToVerify = new easypost.Address({
    verify: ['delivery'],
    street1: address.line1,
    street2: address.line2,
    city: address.city,
    state: address.state,
    zip: address.postal_code
  });
  const verifiedAddress = await addressToVerify.save()

  if (verifiedAddress.verifications.delivery.success) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: "Address has been validated."
      })
    }
  }
  else {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: verifiedAddress.verifications.delivery.errors
      })
    }
  }

}
