import React, { useState, useEffect, useContext } from "react"
import firebase from "gatsby-plugin-firebase"

export const isBrowser = () => typeof window !== "undefined"

const defaultContext = {
  user: {},
  loading: false,
  login: () => {},
  signUp: () => {},
  signOut: () => {},
  signUpWithEmail: () => {},
  sendEmailVerification: () => {},
  sendEmailVerificationOnSignUp: () => {},
  updateEmail: () => {},
}

export const FirebaseContext = React.createContext(defaultContext)
export const useFirebaseContext = () => useContext(FirebaseContext)
export const FirebaseProvider = ({
  children
}) => {
  const [user, setUser] = useState({})
  const [firebaseAuth, setFirebaseAuth] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initFirebase = () => {
      setFirebaseAuth(firebase.auth())

      firebase.auth().onAuthStateChanged(user => {
        setUser(user)
      })
      setLoading(false)
    }

    initFirebase()
  }, [user])

  function sendEmailVerification() {
    user.sendEmailVerification().then(() => {
      console.log("Sending verification email...")
    }).catch(error => {
      return error
    })
  }

  function updateEmail(email, cb) {
    user.updateEmail(email).then(() => {
      console.log("Updating user's email...")
      return cb(false)
    }).catch(error => {
      switch(error.code) {
        case "auth/email-already-in-use":
          console.log("This email is already in use.")
          cb(true)
          break
        case "auth/invalid-email":
          console.log("Email was in an invalid format.")
          cb(true)
          break
        case "auth/requires-recent-login":
          console.log("Requires recent login")
          user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(email, "riff")).then(res => {
            console.log(res)
          }).catch(error => {
            console.log(error)
          })
          cb(true)
          break
        default:
          console.log("Something went wrong")
          cb(true)
      }
    })
  }

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        sendEmailVerification,
        updateEmail,
        login: (...p) => firebaseAuth.signInWithEmailAndPassword(...p),
        signUp: (...p) => firebaseAuth.createUserWithEmailAndPassword(...p),
        signOut: (...p) => firebaseAuth.signOut(...p),
        signUpWithEmail: (...p) => firebaseAuth.sendSignInLinkToEmail(...p),
        sendEmailVerificationOnSignUp: (...p) => firebaseAuth.sendEmailVerification(...p),
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}
