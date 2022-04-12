const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

function calculateTotalWeight(cartItems) {
  let totalWeight = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const totalItemWeight = cartItems[i].weight * cartItems[i].quantity
    totalWeight += totalItemWeight
  };

  return totalWeight;
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { address, name, email, cartItems } = body;
  let cartItemsArray = [];

  for (const cartItem in cartItems) {
    cartItemsArray.push(cartItems[cartItem])
  };

  // always sending from our business address
  const fromAddress = new easypost.Address({
    company: 'Notesmith',
    street1: '39 Knollwood Road',
    city: 'Roslyn',
    state: 'NY',
    zip: '11576',
    email: "general@notesmithbooks.com",
  });

  const toAddress = new easypost.Address({
    street1: address.line1,
    street2: address.line2,
    city: address.city,
    state: address.state,
    country: address.country,
    zip: address.postal_code,
  });

  // physical package size
  const parcel = new easypost.Parcel({
    width: 9,
    length: 6,
    height: 2,
    weight: calculateTotalWeight(cartItemsArray),  // assumption that there is only one product
  });

  // create a new easypost Shipment object
  const newShipment = new easypost.Shipment({
    to_address: toAddress,
    from_address: fromAddress,
    parcel: parcel,
    carrier_accounts: [
      "ca_d8375b6672b94b6aa47efb01624097b6", // USPS
      "ca_113990b2b7b94d4b9280cbe4fc0f4433", // UPS
      "ca_c1a5ccb5ccca4344b654fb98612fa8a9", // DHL
      "ca_6f9cf63ed25945f098109d60bdc34358", // FedEx
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

    console.log("Successfully created and returned shipping rates to the user.");
    return {
      statusCode: 200,
      body: JSON.stringify({
        cheapestRate: cheapestRate,
        allRates: ratesSortedDescending,
        shipmentId: shipmentId,
      })
    };
  } catch(error) {
    console.error("Something went wrong when trying to create shipping rates.");
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Something went wrong. Please refresh the page and try again."
      })
    }
  }
}

// this function filters and sorts by specific carrier service
// const rates = newShipment.rates.filter(rate => rate.service === "First")
// rates.sort((a,b) => {
//   return a.rate - b.rate
// })
