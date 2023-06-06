import React, { useEffect, useState } from "react"
import { useFirebaseContext } from "../../utils/auth"
import { ref, get, query, orderByChild, equalTo, set } from "firebase/database"

import { Section, SectionMain, SectionContent } from "../../components/layout/Section"
import { Container, Col, Row } from "react-grid-system"
import Button from "../ui/Button"
import { spacing } from "../../styles/variables"

const OrderTable = ({ type }) => {
  return (
    <></>
  )
}

const AdminDashboard = () => {
  const { firebaseDb } = useFirebaseContext()
  const [unprintedOrders, setUnprintedOrders] = useState([])
  const [activeOrderType, setActiveOrderType] = useState("unprinted")

  const getOrders = (child, value, type) => {
    const ordersRef = ref(firebaseDb, "orders/")

    get(query(ordersRef, orderByChild(child), equalTo(value))).then(snapshot => {
      const ordersArray = []
      // push them into an array const
      snapshot.forEach(order => {
        ordersArray.push(order.val())
      })

      switch(type) {
        case "unprinted":
          setUnprintedOrders(ordersArray)
          break
      }
    })
  }

  const handleOrderType = (child, value, type) => {
    setActiveOrderType(type)
    getOrders(child, value, type)
  }

  return (
    <SectionMain
      className="has-max-height"
    >
      <Section>
        <SectionContent
          padding={spacing.normal}
        >
          <Container>
            <Row>
              <Col>
                <Button
                  onClick={() => handleOrderType("printed", false, "unprinted")}
                >
                  Unprinted orders
                </Button>
                <Button>
                  Shipping errors
                </Button>
                <Button>
                  Shipped orders
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <OrderTable />
              </Col>
            </Row>
          </Container>
        </SectionContent>
      </Section>
    </SectionMain>
  )
}

export default AdminDashboard