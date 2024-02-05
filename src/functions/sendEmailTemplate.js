export default async function sendEmailTemplate(emailData) {
  try {
    const response = await fetch("/.netlify/functions/send-email-template", {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(emailData)
    })

    const data = await response.json()

    if (data.error) {
      throw ("There was an error sending the email, please try again.")
    }
  }
  catch(error) {
    return error || "There was an error sending the email, please try again."
  }
}