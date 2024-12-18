import React from "react"
import { colors, spacing } from "../styles/variables"

import Layout from "../components/layout/Layout"
import { Container, Row, Col } from "react-grid-system"
import { Section, SectionMain, SectionContent } from "../components/layout/Section"
import Content from "../components/ui/Content"
import { Flexbox } from "../components/layout/Flexbox"

const informationUsageList = [
  "To improve customer service: Information you provide helps us respond to your customer service requests and support needs more efficiently.",
  "To personalize user experience: We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.",
  "To improve our Site: We may use feedback you provide to improve our products and services.",
  "To process payments: We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.",
  "To run a promotion, contest, survey, or other Site feature: To send Users information they agreed to receive about topics we think will be of interest to them.",
  "To send periodic emails: We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests. If User decides to opt-in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc. If at any time the User would like to unsubscribe from receiving future emails, we include options to unsubscribe within each email."
];

const ContentBlock = ({ heading, children }) => {
  return (
    <Content
      margin="32px 0"
    >
      <h3>{heading}</h3>
      <p>{children}</p>
    </Content>
  )
}

const PrivacyPage = () => {
  return (
    <Layout
      seoDetails={{
        title: "FAQ",
      }}
    >
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
                    <h1>Privacy Policy</h1>
                    <p>Last updated March 26, 2024.</p>
                    <p>
                      This Privacy Policy governs the manner in which we collect, use, maintain, and disclose information collected from users (each, a "User", "Customer", or "Visitor") of our website (the "Site"). This privacy policy applies to the website and all products and services offered by Notesmith ("we", "us", or "our").
                    </p>
                  </Content>
                  <ContentBlock
                    heading="Information Collection"
                  >
                    We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, respond to a survey, fill out a form, and in connection with other activities, services, features, or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, mailing address, phone number, and credit card information. Users may, however, visit our Site anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site-related activities.
                  </ContentBlock>
                  <ContentBlock
                    heading="Information Usage"
                  >
                    We may collect and use Users' personal information for the following purposes:
                    <Content>
                      <ul>
                        {informationUsageList.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </Content>
                  </ContentBlock>
                  <ContentBlock
                    heading="How We Protect Your Information"
                  >
                    We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site. We do not store any sensitive information including payment data and personal data on our servers. All payment data is processed through a secure payment gateway and is not stored or processed on our servers.
                  </ContentBlock>
                  <ContentBlock
                    heading="How We Disclose Your Information"
                  >
                    We do not sell, trade, or rent Users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above. We may also disclose personal information when required to do so by law.
                  </ContentBlock>
                  <ContentBlock
                    heading="Cookies and Trackers"
                  >
                    We may use Google Analytics and Google Ads to collect data about your use of our website. These services may collect information about your browsing behavior and device information through the use of cookies and similar technologies. However, we do not share or sell any user data collected through Google Analytics or Google Ads, nor through any other service. All data collected through these services is used internally only for analytics and advertising purposes. Users may opt out of this data collection by declining the consent banner when visiting our website.
                  </ContentBlock>
                  <ContentBlock
                    heading="Changes to This Privacy Policy"
                  >
                    We have the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the top of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
                  </ContentBlock>
                  <ContentBlock
                    heading="Your Acceptance of These Terms"
                  >
                    By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.
                  </ContentBlock>
                </Col>
              </Row>
            </Container>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default PrivacyPage