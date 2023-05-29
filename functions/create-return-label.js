const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { address } = body;
  const businessAddress = {
    company: 'Notesmith LLC',
    street1: '971 Stewart Ave',
    city: 'Garden City',
    state: 'NY',
    zip: '11530',
    email: "general@notesmithbooks.com",
    phone: "9175754958",
    name: "Won Kyu Lee",
  }

  try {
    const shipment = await easypost.Shipment.create({
      to_address: businessAddress,
      from_address: address,
      parcel: {
        width: 9,
        length: 6,
        height: 2,
        weight: 9.6,
      },
      is_return: true,
    })

    console.log(shipment)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Return label created successfully" }),
    }
  } catch(error) {
    console.error(`[Easypost] Error creating return label: ${error}`)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}