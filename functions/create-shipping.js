const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY_TEST);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API_TEST);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { address, name, email } = body;

  const fromAddress = new easypost.Address({
    company: 'Notesmith',
    street1: '39 Knollwood Road',
    city: 'Roslyn',
    state: 'NY',
    zip: '11576',
    email: "general@notesmithbooks.com"
  });

  const toAddress = new easypost.Address({
    street1: address.line1,
    street2: address.line2,
    city: address.city,
    state: address.state,
    zip: address.postal_code
  });

  const parcel = new easypost.Parcel({
    length: 12,
    width: 8.5,
    height: 1,
    weight: 8.9
  });

  const shipment = new easypost.Shipment({
    to_address: toAddress,
    from_address: fromAddress,
    parcel: parcel,
    carrier_accounts: [
      "ca_d8375b6672b94b6aa47efb01624097b6" // USPS
    ]
  });

  await fromAddress.save();
  await parcel.save();
  const newShipment = await shipment.save();
  const rates = newShipment.rates.filter(rate => rate.service === "First" || rate.service === "Express")
  rates.sort((a,b) => {
    return a.rate - b.rate
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      rates
    })
  }
}
