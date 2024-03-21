const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { orders } = body;

  try {
    const shipments = await Promise.all(orders.map(async (order) => {
      const { shipmentId, rateId, orderId } = order
      // retrieve the existing shipment by its ID
      const shipment = await easypost.Shipment.retrieve(shipmentId);
      const shippingRate = shipment.rates.find(rate => rate.id === rateId);
      // buy the shipping label from easypost
      await easypost.Shipment.buy(shipment.id, shippingRate);
      console.log(`[Easypost - create-shipment] Bought shipping label for: ${orderId}`)
    }));

    console.log(shipments)

    const batch = await easypost.Batch.create({
      // expecting array of shipment ids
      // [{ id: 'shp_...' }, { id: 'shp_...' }]
      shipments: shipments,
    });

    console.log(batch)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Batch created successfully" }),
    }
  }
  catch(error) {
    console.error(`[Easypost] Error creating batch: ${error}`)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}