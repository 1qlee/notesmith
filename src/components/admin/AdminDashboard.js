import React, { useState } from "react"
import { useFirebaseContext } from "../../utils/auth"
import { ref, get, query, orderByChild, equalTo, set } from "firebase/database"
import { jsPdf, createFile } from 'jspdf'
import 'svg2pdf.js'

import { Section, SectionMain, SectionContent } from "../../components/layout/Section"
import { Container, Col, Row } from "react-grid-system"
import Button from "../ui/Button"
import { spacing } from "../../styles/variables"
import JSZip from "jszip"

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

  // var zip = new JSZip();

  // angular.forEach($scope.students, function (student) {
  //   //The createFile() function returns a jsPDF
  //   var doc = createFile(student);
  //   if (typeof doc !== 'undefined') {
  //     try {
  //       zip.file(student.name + '.pdf', doc.output('blob'));
  //     }
  //     catch {
  //       console.error('Something went wrong!');
  //     }
  //   }
  // });

  // zip.generateAsync({ type: 'blob' }).then(function (content) {
  //   saveAs(content, 'reports.zip');
  // });

  const downloadUnprintedOrders = async () => {
    // get all orders where printed property equals to false
    await get(query(ref(firebaseDb, "orders/"), orderByChild("printed"), equalTo(false))).then(snapshot => {
      if (snapshot.exists()) {
        const orderItemsArray = []
        // have to loop through all orders and get the orderItems
        snapshot.forEach(order => {
          const orderItems = order.val().orderItems
          // turn orderItems into an array only if it has more than one item
          if (Object.keys(orderItems).length > 1) {
            for (const orderItem in orderItems) {
              orderItemsArray.push(orderItems[orderItem])
            }
          } else {
            orderItemsArray.push(orderItems)
          }
        })
      }
    })
  }

  const handleGetOrders = (child, value, type) => {
    setActiveOrderType(type)
    getOrders(child, value, type)
  }

  function downloadBookPdf() {
    const zip = new JSZip()
    const bookPdf = new jsPdf({
      format: [139.7, 215.9],
      compress: true,
    })
    const downloadBookRef = ref('books/-Mo-pISGlvG2AxeVFsXz')
    let pageNum = 1

    downloadBookRef.once("value").then(snapshot => {
      const pages = snapshot.val().pages

      console.log("initializing pdf...")
      bookPdf.deletePage(1)

      for (const page in pages) {
        const numOfPages = Object.keys(pages).length

        ref(`pages/${page}`).orderByChild('pageNumber').once("value").then(snapshot => {
          const pageSvg = snapshot.val().svg
          const node = new DOMParser().parseFromString(pageSvg, 'text/html').body.firstElementChild

          console.log("adding page: ", pageNum)
          bookPdf.addPage([139.7, 215.9], "portrait")
          bookPdf.setPage(pageNum)

          bookPdf.svg(node, {
            x: 0,
            y: 0,
            width: 139.7,
            height: 215.9,
          }).then(() => {

            if (pageNum === numOfPages) {
              console.log("saving pdf")
              bookPdf.save()
            }

            pageNum++
          })
        })
      }
    })
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
                  onClick={() => downloadUnprintedOrders()}
                  margin="0 16px 0 0"
                >
                  Unprinted orders
                </Button>
                <Button
                  onClick={() => handleGetOrders("errors", false, "unprinted")}
                  margin="0 16px 0 0"
                >
                  Shipping errors
                </Button>
                <Button
                  onClick={() => handleGetOrders("shipped", false, "unprinted")}
                  margin="0 16px 0 0"
                >
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