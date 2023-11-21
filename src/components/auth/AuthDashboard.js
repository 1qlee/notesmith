import React, { useEffect, useState, useRef } from "react"
import { colors, widths } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { get, ref, set, push, query, orderByChild, equalTo } from "firebase/database"

import AuthLayout from "./components/AuthLayout"
import Content from "../ui/Content"
import Layout from "../layout/Layout"
import Notification from "../ui/Notification"
import { Row, Col } from "react-grid-system"

const UserDashboard = () => {
  const { loading, user, firebaseDb } = useFirebaseContext()
  const [referralCode, setReferralCode] = useState("")
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState({
    status: false,
    text: "Copy",
  })
  // const launchDate = new Date("2023-12-15")
  const singleRef = useRef(null)

  useEffect(() => {
    if (user) {
      const { uid } = user

      get(ref(firebaseDb, 'users/' + uid)).then((snapshot) => {
        if (snapshot.exists()) {
          const { referralCodes, referrer } = snapshot.val()

          if (referrer) {
            if (referralCodes) {
              // get the last referralCode (array)
              get(query(ref(firebaseDb, `referrals`), orderByChild('userId'), equalTo(uid))).then(snapshot => {
                if (snapshot.exists()) {
                  const referrals = Object.values(snapshot.val())
                  const unclaimedReferrals = referrals.filter(referral => !referral.redeemed)

                  if (unclaimedReferrals.length > 0) {
                    // sort referrals by dateCreated where claimed is false
                    unclaimedReferrals.sort((a, b) => {
                      return b.dateCreated - a.dateCreated
                    })

                    // get the most recent referralCode
                    const mostRecentReferral = unclaimedReferrals[0].id

                    setReferralCode(`notesmithbooks.com/invites/${mostRecentReferral}`)
                  }
                  else {
                    createSingleRefferalCode(uid, true)
                  }
                }
              })
            }
            else {
              createSingleRefferalCode(uid, true)
            }
          }
        }
      })
    }
  }, [user])

  const createSingleRefferalCode = (uid) => {
    // create a new referralCode
    saveReferralCodeDb(uid)
    setGenerating(true)

    setTimeout(() => {
      // prevents code from being generated too many times in a row
      setGenerating(false)
      singleRef.current.style.cursor = "pointer"
      singleRef.current.style.opacity = "1"
    }, 3000)
  }

  const saveReferralCodeDb = async (uid) => {
    const referralsRef = ref(firebaseDb, "referrals/")
    const newReferralKey = push(referralsRef).key
    // create a new referralCode
    set(ref(firebaseDb, `referrals/${newReferralKey}`), {
      id: newReferralKey,
      userId: uid,
      redeemed: false,
      dateCreated: new Date().valueOf(),
    }).then(() => {
      set(ref(firebaseDb, `users/${uid}/referralCodes/${newReferralKey}`), true)
      setReferralCode(`notesmithbooks.com/invites/${newReferralKey}`)
    })
  }

  const handleSingleCode = () => {
    if (generating) {
      return
    }
    else {
      createSingleRefferalCode(user.uid, true)
      singleRef.current.style.cursor = "not-allowed"
      singleRef.current.style.opacity = "0.5"
    }
  }

  const handleReferral = (e) => {
    const { target } = e
    target.select()
    copyToClipboard()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode)
      .then(() => {
        setCopied({
          status: true,
          text: "Copied!",
        })
        setTimeout(() => {
          setCopied({
            status: false,
            text: "Copy",
          })
        }, 2000)
      })
  }

  return (
    <Layout loading={loading || !user}>
      <AuthLayout page="Dashboard">
        <Row>
          <Col md={6}>
            <Content
              h1fontsize="2rem"
              margin="32px 0 16px"
              linktextdecoration="underline"
              maxwidth={widths.content.normal}
            >
              <p>
                Click on the "Books" tab above to get started. When you create a book you will be able to give it a name, after which it will appear in your Books table. Double-click on any book in the table to open it in the editor.
              </p>
              <p>If you have any questions or suggestions, feel free to <a href="mailto:general@notesmithbooks.com">send us an email</a>.</p>
            </Content>
            <Notification
              backgroundcolor={colors.green.twoHundred}
              color={colors.green.nineHundred}
              margin="16px 0"
            >
              <p>All notebooks purchased during the pre-order sale are <b>25% off</b>.</p>
            </Notification>
          </Col>
          <Col md={6}>
            {/* <Content
              h3fontsize="1.5rem"
              h3margin="0 0 16px"
              margin="32px 0"
            >
              <h3>Invite someone to early access</h3>
              <p>Anyone you invite to early access will be able to bypass the wailist and gain access to Notesmith instantly. This is an exclusive perk for early users like you - but don't worry, you can invite as many people as you wish!</p>
            </Content>
            {referralCode && (
              <>
                <Flexbox
                  justify="space-between"
                >
                  <StyledLabel htmlFor="single-link">Invite link (single use)</StyledLabel>
                  <TextLink
                    ref={singleRef}
                    fontsize="0.875rem"
                    margin="0 0 8px"
                    fontweight="400"
                    onClick={(e) => handleSingleCode(e)}
                  >
                    Generate new
                  </TextLink>
                </Flexbox>
                <Flexbox
                  margin="0 0 32px"
                >
                  <StyledInput
                    id="single-link"
                    value={referralCode}
                    onClick={e => handleReferral(e)}
                    fontsize="1rem"
                    borderradius="4px 0 0 4px"
                  />
                  <Button
                    borderradius="0 4px 4px 0"
                    onClick={() => copyToClipboard()}
                  >
                    <Icon
                      margin="0 4px 0 0"
                    >
                      {copied.status ? (
                        <Check />
                      ) : (
                        <ArrowLeft />
                      )}
                    </Icon>
                    <span>{copied.text}</span>
                  </Button>
                </Flexbox>
              </>
            )} */}
          </Col>
        </Row>
      </AuthLayout>
    </Layout>
  )
}

export default UserDashboard
