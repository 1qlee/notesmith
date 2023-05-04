import React, { useState, useEffect, useContext } from "react"
import firebase from "gatsby-plugin-firebase-v9.0"
import { 
  createUserWithEmailAndPassword, 
  EmailAuthProvider, 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
} from "firebase/auth"
import { 
  enableLogging,
  getDatabase, 
} from "firebase/database"

export const isBrowser = () => typeof window !== "undefined"

const defaultContext = {
  loading: false,
  login: () => {},
  signUp: () => {},
  signOut: () => {},
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
      const auth = getAuth(firebase)
      const db = getDatabase(firebase)
      setFirebaseAuth(auth)
      setFirebaseDb(db)
      enableLogging(false, false)

      onAuthStateChanged(auth, user => {
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
        firebaseAuth,
        getAuthCredential: (...p) => EmailAuthProvider.credential(...p),
        login: (...p) => signInWithEmailAndPassword(firebaseAuth, ...p),
        signOut: (...p) => signOut(firebaseAuth, ...p),
        signUp: (...p) => createUserWithEmailAndPassword(firebaseAuth, ...p),
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}
