export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("isLoggedIn")
    ? JSON.parse(window.localStorage.getItem("isLoggedIn"))
    : {}

export const setUser = user =>
  isBrowser() && window.localStorage.setItem("isLoggedIn", JSON.stringify(user))

export const isLoggedIn = () => {
  const user = getUser()
  return !!user.email
}

export const logout = (firebase) => {
  return new Promise(resolve => {
    firebase.auth().signOut().then(function() {
      setUser({});
      resolve();
    });
  })
}
