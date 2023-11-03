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

  return itemDetails;
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { cartItems, address, customer } = body;
  console.log("🚀 ~ file: create-rates.js:33 ~ exports.handler= ~ address:", address)
  const cartDetails = parseCartItems(cartItems);
  const totalWeight = cartDetails.weight;
  const isInternational = address.country !== "US";
  let newShipment;

  try {
    // physical package size
    const parcel = await easypost.Parcel.create({
      width: 9,
      length: 6,
      height: 2,
      weight: totalWeight,  // assumption that there is only one product
    });
    const userAddress = {
      name: customer.name,
      street1: address.line1,
      street2: address.line2,
      city: address.city,
      state: address.state,
      country: address.country,
      zip: address.postal_code,
      phone: customer.phone,
    }
    const toAddress = address.id ? { id: address.id } : userAddress;
    
    if (address.id) {
      const addressObj = await easypost.Address.retrieve(address.id);
      console.log("Address to: " + addressObj);
    }

    if (isInternational) {
      console.log(`[Easypost] Creating customs info for international shipment to: ${address.country}`);
      const customsItems = await easypost.CustomsItem.create(cartDetails);
      const customsInfo = await easypost.CustomsInfo.create({
        eel_pfc: 'NOEEI 30.37(a)',
        restriction_type: 'none',
        customs_certify: true,
        customs_signer: 'Won Kyu Lee',
        contents_type: 'merchandise',
        customs_items: [customsItems],
      });

      newShipment = await easypost.Shipment.create({
        to_address: toAddress,
        from_address: {
          company: 'Notesmith LLC',
          street1: '971 Stewart Ave',
          city: 'Garden City',
          state: 'NY',
          zip: '11530',
          email: "general@notesmithbooks.com",
          phone: "9175754958",
          name: "Won Kyu Lee",
        },
        parcel: parcel,
        customs_info: customsInfo,
        carrier_accounts: [
          "ca_4e24400a695c4f3dae90c0d45f465436", // UPS
          "ca_c1a5ccb5ccca4344b654fb98612fa8a9", // DHL
        ]
      });

      console.log(`[Easypost] Successfully created customs info for international shipment to: ${address.country}`);
    }
    else {
      console.log(`[Easypost] Creating shipment for domestic shipment`);

      newShipment = await easypost.Shipment.create({
        to_address: toAddress,
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
          "ca_4e24400a695c4f3dae90c0d45f465436", // UPS
        ]
      });

      console.log(`[Easypost] Successfully created shipment for domestic shipment`)
    }
    // shipment is the new easypost shipment object we created earlier
    const shipmentId = newShipment.id;
    const cheapestRate = newShipment.rates.sort((a,b) => {
      return a.rate - b.rate
    })[0]
    const roundedRate = ((Math.ceil(cheapestRate.rate) * 100) / 100) * 100
    const formattedRate = {
      ...cheapestRate,
      rate: roundedRate,
      international: isInternational,
    }

    console.log("[Netlify] Successfully created and returned shipping rates to the user.");
    return {
      statusCode: 200,
      body: JSON.stringify({
        rate: formattedRate,
        shipmentId: shipmentId,
      })
    };
  } catch(error) {
    console.error("[Netlify] Something went wrong when trying to create shipping rates: " + error);
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
