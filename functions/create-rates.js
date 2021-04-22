const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY_TEST);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API_TEST);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { address, name, email, productData } = body;
  let products = [];

  for (const product in productData) {
    products.push(productData[product])
  };

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
    weight: products[0].quantity * 2.8 * 2
  });

  const shipment = new easypost.Shipment({
    to_address: toAddress,
    from_address: fromAddress,
    parcel: parcel,
    carrier_accounts: [
      "ca_d8375b6672b94b6aa47efb01624097b6", // USPS
      "ca_113990b2b7b94d4b9280cbe4fc0f4433"
    ]
  });

  try {
    await fromAddress.save();
    await parcel.save();
    const newShipment = await shipment.save();
    const ratesArray = newShipment.rates.sort((a,b) => {
      return a.rate - b.rate
    });
    const cheapestRate = ratesArray[0];
    // const rates = newShipment.rates.filter(rate => rate.service === "First")
    // rates.sort((a,b) => {
    //   return a.rate - b.rate
    // })

    return {
      statusCode: 200,
      body: JSON.stringify({
        rate: cheapestRate,
        shipment: newShipment,
      })
    };
  } catch(error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "Something went wrong. Please refresh and try again."
      })
    }
  }
}
