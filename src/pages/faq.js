import React from "react"
import { spacing } from "../styles/variables"

import { Container, Row, Col } from "react-grid-system"
import Seo from "../components/layout/Seo"
import Layout from "../components/layout/Layout"
import Content from "../components/ui/Content"
import { Section, SectionMain, SectionContent } from "../components/layout/Section"
import Accordion from "../components/ui/Accordion"
import Box from "../components/ui/Box"

const faqs = [
  {
    title: "Contact information",
    items: [
      {
        question: "Send us an email.",
        answer: [
          "For anything related to your order (returns, exchanges, cancellation, etc.): service@notesmithbooks.com.",
          "For media, press, wholesale inquiries, etc: general@notesmithbooks.com"
        ]
      },
    ]
  },
  {
    title: "Payments, returns, and refunds",
    items: [
      {
        question: "What payment methods do we accept?",
        answer: "We accept Visa, MasterCard, American Express, Discover, Apple Pay, and Google Pay."
      },
      {
        question: "What currencies do we accept?",
        answer: "Only USD."
      },
      {
        question: "Do our listed prices include taxes, duties or import fees?",
        answer: "Taxes are not included in any listed prices shown on our website. Any necessary tax will be calculated and added to your total during checkout. Notesmith is NOT responsible for any additional fees associated with your order, including any supplemental customs, duty or importations fees."
      },
      {
        question: "Can I cancel my order?",
        answer: "If you need to cancel your order, please contact us immediately at service@notesmithbooks.com. We will do our best to cancel your order before it ships. If your order has already shipped, we will not be able to cancel it. You will need to return the item(s) to us for a refund."
      },
      {
        question: "Can I return my order?",
        answer: "If you are not satisfied with your purchase, you may return it for a refund within 14 days after your order is delivered. To be eligible for a refund, the item(s) must be returned in new, unworn condition and in its original packaging with all of the packaging materials included."
      }
    ]
  }
]

const FaqPage = () => {
  return (
    <Layout>
      <SectionMain
        className="has-max-height"
      >
        <Section>
          <SectionContent
            padding={spacing.section}
          >
            <Container xl lg md sm xs>
              <Row>
                <Col>
                  <Content>
                    <h1>FAQ.</h1>
                  </Content>
                </Col>
              </Row>
              <Row>
                <Col>
                  {faqs.map((faq, index) => (
                    <Accordion
                      title={faq.title}
                    >
                      <Content
                        h5fontsize="1.25rem"
                        h5margin="0 0 16px"
                        paragraphfontsize="1.25rem"
                      >
                        {faq.items.map((refund, index) => (
                          <Box
                            margin="32px 0"
                          >
                            <h5>{refund.question}</h5>
                            {Array.isArray(refund.answer) ? (
                              <>
                                {refund.answer.map(line => (
                                  <p>{line}</p>
                                ))}
                              </>
                            ) : (
                              <p>{refund.answer}</p>
                            )}
                          </Box>
                        ))}
                      </Content>
                    </Accordion>  
                  ))}
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default FaqPage

export const Head = () => (
  <Seo title="FAQ" />
)