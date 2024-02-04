export default async function updatePaymentIntent(pid, paymentData) {
  try {
    const response = await fetch("/.netlify/functions/update-payment-intent", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        pid: pid,
        data: paymentData,
      })
    })

    const data = await response.json()

    if (data.error) {
      throw data.error
    }
    else {
      return data
    }
  } catch (error) {
    return {
      error: "An error occurred on our server. Please try again. If this error persists, please contact support."
    }
  }
}