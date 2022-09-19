import React, { useState, useEffect, useContext } from "react"
import firebase from "gatsby-plugin-firebase"

export const isBrowser = () => typeof window !== "undefined"

const defaultContext = {
  loading: false,
  login: () => {},
  signUp: () => {},
  signOut: () => {},
  signUpWithEmail: () => {},
}

export const FirebaseContext = React.createContext(defaultContext)
export const useFirebaseContext = () => useContext(FirebaseContext)
export const FirebaseProvider = ({
  children
}) => {
  const [user, setUser] = useState()
  const [firebaseAuth, setFirebaseAuth] = useState()
  const [firebaseDb, setFirebaseDb] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initFirebase = () => {
      setFirebaseAuth(firebase.auth())
      setFirebaseDb(firebase.database())
      firebase.database.enableLogging(false, false)

      firebase.auth().onAuthStateChanged(user => {
        setUser(user)
        setLoading(false)
      })
    }

    initFirebase()
  }, [user])

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        firebaseDb,
        login: (...p) => firebaseAuth.signInWithEmailAndPassword(...p),
        signUp: (...p) => firebaseAuth.createUserWithEmailAndPassword(...p),
        signOut: (...p) => firebaseAuth.signOut(...p),
        signUpWithEmail: (...p) => firebaseAuth.sendSignInLinkToEmail(...p),
        getAuthCredential: (...p) => firebase.auth.EmailAuthProvider.credential(...p)
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}
