import React from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SubscriptionModal from '../components/SubscriptionModal'
import { useSubscription } from '../contexts/SubscriptionContext'

export default function Privacy() {
  const { subscribed, subscribedEmail, showSubscriptionModal, setShowSubscriptionModal, handleSubscribe } = useSubscription()
  return (
    <>
      <Head>
        <title>Privacy Policy - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', marginBottom: '12px' }}>Privacy Policy</h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Last updated: December 2024</p>
          </div>

          <div style={{ lineHeight: '1.8', color: 'var(--text)', fontSize: '16px' }}>
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>1. Introduction</h2>
              <p style={{ marginBottom: '12px' }}>
                Welcome to Handcrafted Haven ("we," "us," "our," or "Company"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>2. Information We Collect</h2>
              <p style={{ marginBottom: '12px' }}>We may collect information about you in a variety of ways. The information we may collect on the site includes:</p>
              <ul style={{ paddingLeft: '24px', marginBottom: '12px' }}>
                <li style={{ marginBottom: '8px' }}><strong>Personal Data:</strong> Name, email address, phone number, shipping address, billing address, and payment information when you make a purchase or create an account.</li>
                <li style={{ marginBottom: '8px' }}><strong>Account Information:</strong> Username, password, profile picture, and biographical information for seller accounts.</li>
                <li style={{ marginBottom: '8px' }}><strong>Transaction Data:</strong> Order history, products purchased, amounts paid, and delivery status.</li>
                <li style={{ marginBottom: '8px' }}><strong>Communication Data:</strong> Messages you send through our contact forms, email, or customer support channels.</li>
                <li style={{ marginBottom: '8px' }}><strong>Technical Data:</strong> IP address, browser type, device type, pages visited, time spent on pages, and clickstream data collected through cookies and similar technologies.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>3. How We Use Your Information</h2>
              <p style={{ marginBottom: '12px' }}>We use the information we collect for the following purposes:</p>
              <ul style={{ paddingLeft: '24px', marginBottom: '12px' }}>
                <li style={{ marginBottom: '8px' }}>Processing and fulfilling your orders</li>
                <li style={{ marginBottom: '8px' }}>Creating and managing your account</li>
                <li style={{ marginBottom: '8px' }}>Communicating with you about your orders and inquiries</li>
                <li style={{ marginBottom: '8px' }}>Sending promotional emails and newsletters (with your consent)</li>
                <li style={{ marginBottom: '8px' }}>Improving our website and services</li>
                <li style={{ marginBottom: '8px' }}>Preventing fraud and ensuring security</li>
                <li style={{ marginBottom: '8px' }}>Complying with legal and regulatory obligations</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>4. Disclosure of Your Information</h2>
              <p style={{ marginBottom: '12px' }}>We may share your information in the following situations:</p>
              <ul style={{ paddingLeft: '24px', marginBottom: '12px' }}>
                <li style={{ marginBottom: '8px' }}><strong>Service Providers:</strong> We share information with third-party service providers who assist us in operating our website, processing payments, shipping orders, and providing customer support.</li>
                <li style={{ marginBottom: '8px' }}><strong>Legal Requirements:</strong> We may disclose your information when required by law or when we believe in good faith that such disclosure is necessary to comply with legal obligations.</li>
                <li style={{ marginBottom: '8px' }}><strong>Business Transfers:</strong> If Handcrafted Haven is acquired or merged with another entity, your information may be transferred as part of that transaction.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>5. Security of Your Information</h2>
              <p style={{ marginBottom: '12px' }}>
                We use appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>6. Cookies and Tracking Technologies</h2>
              <p style={{ marginBottom: '12px' }}>
                Our website uses cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie settings through your browser preferences. Please note that disabling cookies may affect the functionality of our website.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>7. Your Rights and Choices</h2>
              <p style={{ marginBottom: '12px' }}>Depending on your location, you may have the following rights:</p>
              <ul style={{ paddingLeft: '24px', marginBottom: '12px' }}>
                <li style={{ marginBottom: '8px' }}>Right to access your personal information</li>
                <li style={{ marginBottom: '8px' }}>Right to correct inaccurate information</li>
                <li style={{ marginBottom: '8px' }}>Right to request deletion of your information</li>
                <li style={{ marginBottom: '8px' }}>Right to opt-out of marketing communications</li>
                <li style={{ marginBottom: '8px' }}>Right to data portability</li>
              </ul>
              <p style={{ marginBottom: '12px' }}>
                To exercise any of these rights, please contact us at support@handcraftedhaven.com.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>8. Third-Party Links</h2>
              <p style={{ marginBottom: '12px' }}>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of those websites. We encourage you to review their privacy policies before providing your information.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>9. Children's Privacy</h2>
              <p style={{ marginBottom: '12px' }}>
                Handcrafted Haven is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete such information and terminate the child's account.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>10. Contact Us</h2>
              <p style={{ marginBottom: '12px' }}>
                If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', marginTop: '12px' }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Email:</strong> privacy@handcraftedhaven.com
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Phone:</strong> 1-800-HANDMADE
                </p>
                <p>
                  <strong>Address:</strong> 43 Sowatey Close, East Adenta
                </p>
              </div>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>11. Changes to This Privacy Policy</h2>
              <p style={{ marginBottom: '12px' }}>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by updating the date at the top of this page or by other appropriate means.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer onSubscribe={handleSubscribe} subscribed={subscribed} />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        email={subscribedEmail}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  )
}
