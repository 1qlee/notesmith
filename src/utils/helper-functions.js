import { convertFloatFixed } from "../styles/variables"
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
  const date = new Date(timestamp * 1000);
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

const isBrowser = () => typeof window !== "undefined" && document


export {
  createAttributes,
  svgToObjects,
  convertUnix,
  isBrowser,
  consolidateMixedObjects,
  consolidateObjectProps
}
