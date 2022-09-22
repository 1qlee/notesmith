import { regex } from "../styles/variables"

export default function validatePassword(password) {
  let addtlCharsReq = 8 - password.length
  let passObj

  if (regex.password.test(password)) {
    passObj = { isValid: true, error: "" }
  }
  else {
    if (addtlCharsReq > 0) {
      passObj = { isValid: false, error: `You need ${addtlCharsReq} more character${addtlCharsReq > 1 ? `s` : ''}.` }
    }
    else if (password.length === 0) {
      passObj = { isValid: false, error: "" }
    }
  }

  return passObj
}