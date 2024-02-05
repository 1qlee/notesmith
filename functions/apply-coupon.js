const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)

// calculate total order amount using inventory data
const calcOrderAmount = async (cartItems) => {
  let totalAmount = 0;
  // iterate through all cart items in cart
  for (let i = 0; i < cartItems.length; i++) {
    const { quantity, price_id } = cartItems[i];
    // retrieve product from stripe by using id
    const stripeProduct = await stripe.prices.retrieve(price_id);

    totalAmount += stripeProduct.unit_amount * quantity * .75;
  }

  console.log(`[Stripe] The total amount for this order is: ${totalAmount}.`)
  return totalAmount;
};

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body);
  const { pid, coupon } = body;

  try {
    let paymentIntent = await stripe.paymentIntents.retrieve(pid);

    if (coupon === process.env.GATSBY_SECRET_COUPON) {
      // const totalAmount = await calcOrderAmount(cartItems);

      await stripe.paymentIntents.update(pid, {
        amount: 100,
        metadata: {
          subtotal: 100,
          tax: 0,
          shipping: 0,
          coupon: coupon,
        }
      });

      paymentIntent = await stripe.paymentIntents.retrieve(pid);

      console.log(`[Stripe] Applied coupon successfully to paymentIntent: ${pid}`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          paymentIntent: paymentIntent,
          coupon: true,
        })
      }
    }
    else {
      console.log(`[Stripe] Coupon code is invalid: ${coupon}`);

      return {
        statusCode: 400,
        body: JSON.stringify({
          coupon: false,
          error: "The coupon code you entered is invalid."
        })
      }
    }
  } catch (error) {
    console.error(`[Stripe] Could not find paymentIntent: ${pid}`);
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "We could not retrieve your order information. Please clear your cart and try again."
      })
    }
  }
}
