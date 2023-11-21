import React, { useState, useEffect, useContext } from "react"
import { 
  EmailAuthProvider, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  initializeAuth, 
  indexedDBLocalPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence,
  signInWithEmailAndPassword, 
  signOut, 
} from "firebase/auth"
import {
  initializeApp,
} from "firebase/app"
import { 
  enableLogging,
  getDatabase, 
} from "firebase/database"

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID,
  measurementId: process.env.GATSBY_FIREBASE_MEASUREMENT_ID,
  privateKey: process.env.GATSBY_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.GATSBY_FIREBASE_CLIENT_EMAIL,
}

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
    const app = initializeApp(firebaseConfig)
    const auth = initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
    })
    const db = getDatabase(app)

    setFirebaseAuth(auth)
    setFirebaseDb(db)
    enableLogging(false, false)

    onAuthStateChanged(auth, user => {
      setUser(user)
      setLoading(false)
    })

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
