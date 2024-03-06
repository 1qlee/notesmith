import React, { useEffect, useState, useRef } from "react"
import { colors, widths } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { get, ref, set, push, query, orderByChild, equalTo, onValue } from "firebase/database"
import { isBrowser } from "../../utils/helper-functions"
import { ArrowLeft, Check, WarningCircle } from "@phosphor-icons/react"

import AuthLayout from "./components/AuthLayout"
import Button from "../ui/Button"
import Content from "../ui/Content"
import Icon from "../ui/Icon"
import Layout from "../layout/Layout"
import Notification from "../ui/Notification"
import TextLink from "../ui/TextLink"
import { Flexbox } from "../layout/Flexbox"
import { Row, Col } from "react-grid-system"
import { StyledLabel, StyledInput } from "../form/FormComponents"
import Progress from "../ui/Progress"
import Box from "../ui/Box"

const UserDashboard = () => {
  const { loading, user, firebaseDb } = useFirebaseContext()
  const [referralCode, setReferralCode] = useState("")
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState({
    status: false,
    text: "Copy",
  })
  const [quantitySold, setQuantitySold] = useState(null)
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

      onValue(ref(firebaseDb, "orderItems"), (snapshot) => {
        if (snapshot.exists()) {
          const orderItems = Object.values(snapshot.val())
          const quantitySold = orderItems.reduce((acc, orderItem) => {
            return acc + orderItem.quantity
          }, 0)

          setQuantitySold(quantitySold)
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
     
      if (singleRef) {
        singleRef.current.style.cursor = "pointer"
        singleRef.current.style.opacity = "1"
      }
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
    isBrowser() && navigator.clipboard.writeText(referralCode)
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
    <Layout 
      loading={loading || !user}
      seoDetails={{
        title: "Dashboard",
      }}
    >
      <AuthLayout page="Dashboard">
        <Row>
          <Col md={6}>
            <Content
              h1fontsize="2rem"
              h3fontsize="1.5rem"
              h3margin="0 0 16px"
              margin="32px 0"
              maxwidth={widths.content.normal}
            >
              <h3>Welcome to Notesmith!</h3>
              <p>
                Click on the "Books" tab above to get started. From there, click on the "New book" button to create the book which will then appear in your Books Table. Double-click on any book in the table to open it in the editor.
              </p>
              <p><b>Reminder: </b>The editor is currently a work-in-progress.</p>
            </Content>
            <Notification
              backgroundcolor={colors.gray.oneHundred}
              color={colors.gray.nineHundred}
              borderradius="16px"
              padding="16px"
              margin="32px 0 16px"
            >
              <Icon
                className="is-pulsating"
                margin="0 8px 0 0"
              >
                <WarningCircle 
                  size={24}
                />
              </Icon>
              <Content
                linktextdecoration="underline"
              >
                <p>If you have any feedback, suggestions, bug reports, etc. to share, please <a href="mailto:general@notesmithbooks.com">send us an email</a> – your input can truly make a difference in shaping the future of Notesmith!</p>
              </Content>
            </Notification>
          </Col>
          <Col md={6}>
            {referralCode && (
              <>
                <Content
                  h3fontsize="1.5rem"
                  h3margin="0 0 16px"
                  margin="32px 0 16px"
                >
                  <h3>Invite someone to Notesmith</h3>
                  <p>This link will take the user directly to the sign up page.</p>
                </Content>
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
                    readOnly
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
            )}
          </Col>
        </Row>
      </AuthLayout>
    </Layout>
  )
}

export default UserDashboard
