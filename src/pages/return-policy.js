import React from "react"
import { spacing } from "../styles/variables"
import { Container, Row, Col } from 'react-grid-system'

import { Section, SectionContent, SectionMain } from "../components/layout/Section"
import Content from "../components/ui/Content"
import Layout from "../components/layout/Layout"

const ReturnsPage = () => {
  return (
    <Layout>
      <SectionMain
        className="has-max-height"
      >
        <Section>
          <SectionContent
            padding={`${spacing.section} 0`}
          >
            <Container xl lg md sm xs>
              <Row>
                <Col>
                  <Content>
                    <h1>Return policy</h1>
                  </Content>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Content
                    paragraphfontsize="1.25rem"
                    lifontsize="1.25rem"
                    ulmargin="16px 0"
                    linktextdecoration="underline"
                  >
                    <p>If you are not satisfied with your purchase, you may return it for a refund within 14 days after your order is delivered. To be eligible for a refund, the item(s) must be returned in new, unused condition and in its original packaging with all of the packaging materials included.</p>
                    <p>The conditions for a return are as follows:</p>
                    <ul>
                      <li>Sent back to us within 14 days of delivery date (day you received the package).</li>
                      <li>Products are unused - no writings, markings, or any other applications. Exemptions are made for notebooks with pages designated for testing.</li>
                      <li>Original materials must be included - any containers, bags, branded materials, etc. that were included with the package.</li>
                    </ul>
                    <p><b>Return process:</b></p>
                    <p>1. Contact us by email at service@notesmithbooks.com to request your return shipping label for US orders. All return labels are to be paid for by the sender.</p>
                    <p>2. Follow the packing instructions provided with your return label to send the package back to us. If packing instructions are not followed and a second return label is required a fee of $20 will be applied.</p>
                    <p>3. Returns made in accordance with these conditions will be credited to the original payment method within 5-10 business days from receipt of return.</p>
                    <p>For additional assistance, please contact us at <a mailto="service@notesmithbooks.com">service@notesmithbooks.com</a>.</p>
                  </Content>
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default ReturnsPage