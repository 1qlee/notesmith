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
      console.log(indexTracker, nodeName)

      // recursion to save the group and its children to an object
      indexTracker < 10 ?
          svgObject[`0${indexTracker}-${nodeName}`] = svgToObjects(svgChild, indexTracker) :
          svgObject[`${indexTracker}-${nodeName}`] = svgToObjects(svgChild, indexTracker)
    }
    else {
      console.log(indexTracker, svgChild.nodeName)
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

export {
  createAttributes,
  svgToObjects,
}
