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
    const item = cartItems[i]
    itemDetails.quantity += +item.quantity;
    itemDetails.value += +item.price * +item.quantity;

    if (item.weight) {
      const totalItemWeight = +item.weight * +item.quantity;
      itemDetails.weight += totalItemWeight;
    }
    else {
      // default weight of a custom notebook in A5 is 9.6
      itemDetails.weight += (9.6 * +item.quantity);
    }
  };

  return itemDetails;
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { cartItems, address, customer } = body;
  const cartDetails = parseCartItems(cartItems);
  const totalWeight = cartDetails.weight;
  const isInternational = address.country !== "US";
  let newShipment;

  try {
    // physical package size
    const parcel = await easypost.Parcel.create({
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

    if (isInternational) {
      console.log(`[Easypost: create-rates] Creating customs info for international shipment to: ${address.country}`);
      const customsItems = await easypost.CustomsItem.create(cartDetails);
      const customsInfo = await easypost.CustomsInfo.create({
        eel_pfc: 'NOEEI 30.37(a)',
        restriction_type: 'none',
        customs_certify: true,
        customs_signer: 'Notesmith LLC',
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
          name: "Notesmith",
        },
        parcel: parcel,
        customs_info: customsInfo,
        carrier_accounts: [
          "ca_4e24400a695c4f3dae90c0d45f465436", // UPS
          "ca_c1a5ccb5ccca4344b654fb98612fa8a9", // DHL
        ]
      });

      console.log(`[Easypost: create-rates] Successfully created customs info for international shipment to: ${address.country}`);
    }
    else {
      console.log(`[Easypost: create-rates] Creating shipment for domestic shipment`);

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
          "ca_d8375b6672b94b6aa47efb01624097b6", // USPS
        ]
      });

      console.log(`[Easypost: create-rates] Successfully created shipment for domestic shipment`)
    }

    let cheapestRate = {}

    if (newShipment.rates && newShipment.rates.length > 0) {
      const cheapestUpsRate = newShipment.rates
        .filter(rate => rate.carrier === "UPS")
        .sort((a, b) => a.rate - b.rate)[0];
        
      if (cheapestUpsRate) {
        cheapestRate = cheapestUpsRate;
      }
      else {
        if (isInternational) {
          const cheapestDhlRate = newShipment.rates
            .filter(rate => rate.carrier === "DHL" || rate.carrier === "DHLExpress")
            .sort((a, b) => a.rate - b.rate)[0];

          cheapestRate = cheapestDhlRate;
        }
        else {
          const cheapestUspsRate = newShipment.rates
            .filter(rate => rate.carrier === "USPS")
            .sort((a, b) => a.rate - b.rate)[0];

          cheapestRate = cheapestUspsRate;
        }
      }

      console.log(`[Netlify: create-rates] Found the cheapest rate: ${JSON.stringify(cheapestRate)}`);
    }

    const roundedRate = ((Math.ceil(cheapestRate.rate) * 100) / 100) * 100
    const formattedRate = {
      ...cheapestRate,
      rate: roundedRate,
      formattedRate: ((roundedRate * 1.0) / 100).toFixed(2),
      international: isInternational,
    }
    
    console.log("[Netlify: create-rates] Successfully created and returned shipping rates to the user.");

    return {
      statusCode: 200,
      body: JSON.stringify({
        rate: formattedRate,
      })
    };
  } catch(error) {
    console.error("[Netlify: create-rates] Something went wrong when trying to create shipping rates: " + error);
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
