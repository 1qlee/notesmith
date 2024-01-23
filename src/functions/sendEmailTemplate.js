export default async function sendEmailTemplate(emailData) {
  await fetch("/.netlify/functions/send-generic-email", {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(emailData)
  }).then(res => {
    return res.json()
  }).then(async data => {
    if (data.error) {
      throw ("There was an error sending the verification email, please try again.")
    }
    else {
      return null
    }
  }).catch(error => {
    return error || "There was an error sending the verification email, please try again."
  })
}