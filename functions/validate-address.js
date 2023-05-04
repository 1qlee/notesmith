const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { address } = body;
  console.log(address)

  try {
    const addressToVerify = await easypost.Address.createAndVerify({
      street1: address.line1,
      street2: address.line2,
      city: address.city,
      state: address.state,
      country: address.country,
      zip: address.postal_code
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        address: addressToVerify
      })
    }
  }
  catch(error) {
    console.error("[EASYPOST] Address verification error: ", error.code)

    if (error.errors) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errors: error.errors
        })
      }
    }
    else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errors: [{
            message: "We could not verify your address. Please check your inputs."
          }]
        })
      }
    }
  }
}
