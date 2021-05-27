const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { address, name, email, productData } = body;
  let products = [];

  for (const product in productData) {
    products.push(productData[product])
  };

  // always sending from our business address
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

  // physical package size
  const parcel = new easypost.Parcel({
    length: 12,
    width: 8.5,
    height: 1,
    weight: products[0].quantity * 2.8 * 2 // assumption that there is only one product
  });

  // create a new easypost Shipment object
  const newShipment = new easypost.Shipment({
    to_address: toAddress,
    from_address: fromAddress,
    parcel: parcel,
    carrier_accounts: [
      "ca_d8375b6672b94b6aa47efb01624097b6", // USPS
      "ca_113990b2b7b94d4b9280cbe4fc0f4433"
    ]
  });

  try {
    // just have to wait to receive these values
    await fromAddress.save();
    await parcel.save();
    // shipment is the new easypost shipment object we created earlier
    const shipment = await newShipment.save();
    const shipmentId = shipment.id;
    // all rates sorted by descending shipping rate price
    const ratesSortedDescending = shipment.rates.sort((a,b) => {
      return a.rate - b.rate
    });
    // the cheapest rate will naturally be the first element of the array
    // this variable is an object containing info relevant to the rate
    const cheapestRate = ratesSortedDescending[0];

    return {
      statusCode: 200,
      body: JSON.stringify({
        cheapestRate: cheapestRate,
        shipmentId: shipmentId,
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

// this function filters and sorts by specific carrier service
// const rates = newShipment.rates.filter(rate => rate.service === "First")
// rates.sort((a,b) => {
//   return a.rate - b.rate
// })
