const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY_TEST);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API_TEST);

exports.handler = async (event) => {
  const body = JSON.parse(event.body)
  const { rateId, shipment } = body

  easypost.Shipment.retrieve(shipment.id).then(shippy => {
    shippy.buy(rateId).then(console.log("Bought a label"))
  })

  return {
    statusCode: 200,
  }
}
