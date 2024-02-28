import React from "react"

import { Row, Col } from "react-grid-system"
import ProductInfoBox from "./ProductInfoBox"

const ProductDescription = ({
  bookData,
}) => {
  return (
    <Row>
      {bookData.infoBoxes.map((box, index) => (
        <Col xs={6} key={index}>
          <ProductInfoBox
            heading={box.heading}
            text={box.text}
            key={index}
            index={index}
          />
        </Col>
      ))}
    </Row>
  )
}

export default ProductDescription