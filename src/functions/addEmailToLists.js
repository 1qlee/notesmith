export default async function addEmailToLists(email) {
  await fetch("/.netlify/functions/add-email-to-lists", {
    method: "put",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
    })
  }).then(res => {
    return res.json()
  }).then(async data => {
    if (data.error) {
      throw "There was an error adding the user to lists."
    }
    else {
      return null
    }
  }).catch(error => {
    return error
  })
}