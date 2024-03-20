const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { shipments } = body;

  try {
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