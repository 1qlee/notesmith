import React, { useState, useEffect } from "react"
import { colors, widths } from "../styles/variables"
import { useFirebaseContext } from "../utils/auth"
import { get, ref, set } from "firebase/database"

import { SectionMain, Section, SectionContent } from "../components/layout/Section"
import Notification from "../components/ui/Notification"
import Layout from "../components/layout/Layout"
import Box from "../components/ui/Box"
import Content from "../components/ui/Content"

const Subscription = ({ location }) => {
  const params = new URLSearchParams(location.search)
  const lists = params.getAll("list")
  const key = params.get("key")
  const { loading, firebaseDb } = useFirebaseContext()
  const [processing, setProcessing] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // query firebase for a signup id that matches the key in params
    const getSignup = () => {
      setProcessing(true)

      get(ref(firebaseDb, `signups/${key}`)).then(async snapshot => {
        // going to get back an object with the signup data
        const data = snapshot.val()

        // check if the key matches the id
        if (data.id === key) {
          // if the email is already subscribed, show an error
          if (data.subscribed) {
            setProcessing(false)
            throw new Error("You have already been subscribed to the mailing list.")
          }
          else {
            // otherwise let's subscribe them to the mailing list
            await subscribeToLists(data.email)
          }
        }
      })
      .catch((error) => {
        setError(error ? error.message : "There was an error subscribing you to the mailing list. The link in your email may have expired. Please try signing up again.")
      })
    }

    // this function will try to subscribe the email to multiple lists
    // then it will send a confirmation email
    const subscribeToLists = async (email) => {
      const response = await fetch("/.netlify/functions/add-contact-lists", {
        method: "put",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lists: lists,
          email: email,
        })
      })
      const data = await response.json()

      if (data.error) {
        setError("There was an error subscribing you to the mailing list. The link in your email may have expired. Please try signing up again.")
      }
      else {
        await set(ref(firebaseDb, `signups/${key}`), {
          email: email,
          id: key,
          subscribed: true,
        })

        setSubscribed(true)
      }

      setProcessing(false)
    }

    if (!loading) {
      getSignup()
    }
  }, [location, loading])

  return (
    <Layout 
      loading={processing} 
      className="is-full-height"
      seoDetails={{
        title: "Subscribe to Notesmith",
      }}
    >
      <SectionMain
        className="has-max-height"
      >
        <Section>
          <SectionContent padding="0">
            <Box
              padding="64px"
              margin="0 auto"
              className="has-border no-border-top"
              width={widths.form}
            >
              {subscribed ? (
                <>
                  <Content
                    h1fontsize="2rem"
                    paragraphfontsize="1.25rem"
                    margin="0 0 32px"
                    headingtextalign="center"
                  >
                    <h1>Thanks for subscribing!</h1>
                    <p>Welcome to the Notesmith community! You have been successfully added to the waiting list for Early Access. Please look out for a follow-up email from us in the near future as availability opens up.</p>
                  </Content>
                </>
              ) : (
                <>
                  {error && (
                    <Content
                      h1fontsize="2rem"
                      paragraphfontsize="1.25rem"
                      margin="0 0 32px"
                      headingtextalign="center"
                      linktextdecoration="underline"
                    >
                      <h1>Something went wrong</h1>
                      <p>{error}</p>
                      <p>If you require more assistance, please <a mailto="support@notesmithbooks.com">send us an email</a>.</p>
                    </Content>
                  )}
                </>
              )}
            </Box>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Subscription