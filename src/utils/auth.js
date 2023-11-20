import React, { useState, useEffect, useContext } from "react"
import firebase from "gatsby-plugin-firebase-v9.0"
import { 
  EmailAuthProvider, 
  createUserWithEmailAndPassword, 
  getAuth, 
  onAuthStateChanged, 
  initializeApp,
  initializeAuth,
  signInWithEmailAndPassword, 
  signOut, 
} from "firebase/auth"
import { 
  enableLogging,
  getDatabase, 
} from "firebase/database"


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
      const app = initializeApp(firebase)
      const auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
      })
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
