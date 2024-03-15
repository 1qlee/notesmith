// parse a node to return an object with its attributes
function createAttributes(elem) {
  const { attributes, nodeName } = elem
  let attributesObject = {
    name: nodeName,
  }
  // loop through each attribute
  for (let i = 0; i < attributes.length; i++) {
    // creates a key-value pair in attributesObject accordingly
    attributesObject[attributes[i].name] = attributes[i].value
  }

  return attributesObject
}

// parse an SVG node into a tree of objects
function svgToObjects(svgNode, indexTracker) {
  const svgChildElements = svgNode.childNodes
  const svgChildrenArray = Array.from(svgChildElements)
  const svgObject = {}

  for (let i = 0; i < svgChildrenArray.length; i++) {
    const svgChild = svgChildrenArray[i]
    // if the child node has a child - should always be <g></g>
    if (svgChild.firstElementChild) {
      const { nodeName } = svgChild

      // recursion to save the group and its children to an object
      indexTracker < 10 ?
          svgObject[`0${indexTracker}-${nodeName}`] = svgToObjects(svgChild, indexTracker) :
          svgObject[`${indexTracker}-${nodeName}`] = svgToObjects(svgChild, indexTracker)
    }
    else {
      // check if the node has attributes
      if (svgChild.hasAttributes()) {
        const { nodeName } = svgChild

        indexTracker < 10 ?
            svgObject[`0${indexTracker}-${nodeName}`] = createAttributes(svgChild) :
            svgObject[`${indexTracker}-${nodeName}`] = createAttributes(svgChild)
      }
    }

    indexTracker++
  }


  return svgObject
}

function convertUnix(timestamp) {
  const date = new Date(timestamp);
  const options = {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)

  return formattedDate
}

function consolidateMixedObjects(obj1, obj2) {
  const result = {};

  for (const prop in obj1) {
    if (obj1.hasOwnProperty(prop) && obj2.hasOwnProperty(prop)) {
      result[prop] = obj1[prop] === obj2[prop] ? obj1[prop] : "Mixed";
    }
  }

  return result;
}

function consolidateObjectProps(newObj, exisitingObj) {
  const result = {};

  for (const prop in newObj) {
    if (newObj.hasOwnProperty(prop) && exisitingObj.hasOwnProperty(prop)) {
      if (newObj[prop] === exisitingObj[prop]) {
        result[prop] = newObj[prop];
      } 
      else {
        // if this prop in exisitingObj is already an array, add the new value to it using spread operator
        if (typeof exisitingObj[prop] === "object") {
          result[prop] = [...exisitingObj[prop], newObj[prop]];
        }
        // otherwise create a new array with both values
        else {
          result[prop] = [exisitingObj[prop], newObj[prop]];
        }
      }
    }
    
    for (const prop in exisitingObj) {
      if (exisitingObj.hasOwnProperty(prop) && !newObj.hasOwnProperty(prop)) {
        result[prop] = exisitingObj[prop];
      }
    }
  }

  return result;
}

function processStringNumbers(inputString, processingFunction) {
  const numbers = String(inputString).split(' ').map(num => {
    const numericValue = +num;
    
    if (isNaN(numericValue) || numericValue === 0) {
      return num
    } else {
      return processingFunction(numericValue); // Keep non-numeric values as they are
    }
  });

  return numbers.join(' ');
}

const isBrowser = () => typeof window !== "undefined" && document

const convertToDecimal = (num, places) => {
  return ((num * 1.0) / 100).toFixed(places)
}

const convertToMM = pixels => {
  if (pixels === 0) {
    return 0
  }

  return parseFloat((pixels * .2645833333).toFixed(3))
}

const convertToPx = mm => {
  return parseFloat((mm * 3.7795275591).toFixed(3))
}

const convertToIn = pixels => {
  return parseFloat((pixels * .0104166667).toFixed(2))
}

const convertFloatFixed = (number, places) => {
  const convertedNum = Number(number)
  return parseFloat(convertedNum.toFixed(places))
}

function isNotEmpty(value) {
  if (value !== undefined && value !== null && value !== "") {
    // Check if the value is a number (including zero)
    return true;
  } else {
    return false;
  }
}

function findIndexOfElementInArray(array, propertyName, targetValue) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][propertyName] === targetValue) {
      return i; // Return the index of the element if found.
    }
  }
  return -1; // Return -1 if the element is not found.
}

function daysUntilDate(targetDate) {
  // Get the current date and time
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = targetDate - currentDate;

  // Convert milliseconds to days and round up to the nearest whole number
  const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysLeft;
}

function formatDollars(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

function calculateDiscounts(options) {
  const { price, quantity, rate } = options
  let discounts = {
    price: price,
    subtotal: price * quantity,
    percent: 0,
    minQuantity: null,
  }

  // hard-code bulk discounts - primarily used for notebooks
  if (rate === "bulk") {
    // set the minimum quantity for a bulk discount
    discounts.minQuantity = 5

    if (quantity >= 5 && quantity < 10) {
      discounts.price = price * .95
    }
    else if (quantity >= 10 && quantity < 20) {
      discounts.price = price * .9
    }
    else if (quantity >= 20) {
      discounts.price = price * .85
    }
    else {
      discounts.price = price
    }
  }
  else {
    discounts.price = price * (1 - (rate / 100)) // where rate is a whole number (e.g. 5 percent)
  }

  discounts.percent = 100 - (discounts.price / price * 100)
  discounts.subtotal = discounts.price * quantity
  discounts.formattedSubtotal = formatDollars((discounts.subtotal) / 100)
  discounts.formattedPrice = formatDollars(discounts.price / 100)

  return discounts
}

export {
  calculateDiscounts,
  consolidateMixedObjects,
  consolidateObjectProps,
  convertFloatFixed,
  convertToDecimal,
  convertToIn,
  convertToMM,
  convertToPx,
  convertUnix,
  createAttributes,
  daysUntilDate,
  findIndexOfElementInArray,
  formatDollars,
  isNotEmpty,
  isBrowser,
  processStringNumbers,
  svgToObjects,
}
