function validateInput(value, limit) {
  if (value < limit) {
    return false
  }
  else {
    return true
  }
}

function validateOnBlur(e, limit, cb) {
  const { value } = e.target

  if (validateInput(value, limit)) {
    return cb(+value)
  }
  else {
    e.target.value = limit
    return cb(+limit)
  }
}

function validateOnKeydown(e, limit, cb) {
  const { value } = e.target
  // if Enter or ESC
  if (e.keyCode === 13 || e.keyCode === 27) {
    e.target.blur()

    if (validateInput(value, limit)) {
      return cb(+value)
    }
    else {
      e.target.value = limit
      return cb(+limit)
    }
  }
}

function validateMinValue(value, minValue, cb, maxValue) {
  if (value <= minValue) {
    return cb(+minValue)
  }
  else if (value > maxValue) {
    return cb(+maxValue)
  }
  else {
    return cb(+value)
  }
}

export {
  validateInput,
  validateOnBlur,
  validateOnKeydown,
  validateMinValue,
}
