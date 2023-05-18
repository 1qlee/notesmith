const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

function parseCartItems(cartItems) {
  const itemDetails = {
    weight: 0,
    quantity: 0,
    value: 0,
    description: 'notebooks',
    hs_tariff_number: '4820.10.20',
    origin_country: "US",
  }

  for (let i = 0; i < cartItems.length; i++) {
    itemDetails.quantity += +cartItems[i].quantity;
    itemDetails.value += +cartItems[i].price * +cartItems[i].quantity;

    if (cartItems[i].weight) {
      const totalItemWeight = +cartItems[i].weight * +cartItems[i].quantity;
      itemDetails.weight += totalItemWeight;
    }
    else {
      itemDetails.weight += (9.6 * +cartItems[i].quantity);
    }
  };

  return ;
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { cartItems, address } = body;
  const cartDetails = parseCartItems(cartItems);
  const totalWeight = cartDetails.weight;

  // physical package size
  const parcel = await easypost.Parcel.create({
    width: 9,
    length: 6,
    height: 2,
    weight: totalWeight,  // assumption that there is only one product
  });

  // create a new easypost Shipment object
  const newShipment = await easypost.Shipment.create({
    to_address: {
      street1: address.line1,
      street2: address.line2,
      city: address.city,
      state: address.state,
      country: address.country,
      zip: address.postal_code,
    },
    from_address: {
      company: 'Notesmith LLC',
      street1: '971 Stewart Ave',
      city: 'Garden City',
      state: 'NY',
      zip: '11530',
      email: "general@notesmithbooks.com",
    },
    parcel: parcel,
    carrier_accounts: [
      "ca_d8375b6672b94b6aa47efb01624097b6", // USPS
    ]
  });

  try {
    // shipment is the new easypost shipment object we created earlier
    const shipmentId = newShipment.id;
    const priorityRate = newShipment.rates.filter(rate => rate.service === "Priority" || rate.service === "PriorityMailInternational")
    const { service } = priorityRate
    const roundedRate = (Math.ceil(priorityRate[0].rate) * 100) / 100
    const formattedRate = roundedRate * 100

    const formattedPriorityRate = {
      ...priorityRate[0],
      rate: formattedRate,
    }

    if (service === "PriorityMailInternational") {
      const customsItems = await easypost.CustomsItem.create(cartDetails)

      const customsInfo = await new easypost.CustomsInfo({
        eel_pfc: 'NOEEI 30.37(a)',
        customs_certify: true,
        customs_signer: 'Won Kyu Lee',
        contents_type: 'merchandise',
        customs_items: [customsItems],
      });
    }

    console.log("[Netlify] Successfully created and returned shipping rates to the user.");
    return {
      statusCode: 200,
      body: JSON.stringify({
        rate: formattedPriorityRate,
        shipmentId: shipmentId,
      })
    };
  } catch(error) {
    console.error("[Netlify] Something went wrong when trying to create shipping rates.");
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
