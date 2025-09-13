'use client';

import { MainLayout } from '@/components/Layout/MainLayout';

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="text-gray-600 space-y-6">
            <p className="text-lg">
              Welcome to RHYTM, an AI-powered music curation platform owned and operated by Sky Walker Enterprise. 
              By using our service, you agree to these Terms of Service. Please read them carefully.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p>
                By accessing or using RHYTM, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
                If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
              <p>
                RHYTM provides AI-powered music discovery and curation services for DJs and music enthusiasts. Our platform helps users:
              </p>
              <ul className="space-y-2">
                <li>Discover new tracks based on personal preferences</li>
                <li>Create and manage music collections</li>
                <li>Sync with Beatport DJ and export playlists</li>
                <li>Receive personalized music recommendations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts and Responsibilities</h2>
              <p>
                To use RHYTM, you must create an account and provide accurate information. You are responsible for:
              </p>
              <ul className="space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your use complies with all applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="space-y-2">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Upload malicious code or engage in harmful activities</li>
                <li>Violate any intellectual property rights</li>
                <li>Share your account with others or create multiple accounts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <p>
                The RHYTM platform, including its AI algorithms, design, and content, is owned by Sky Walker Enterprise 
                and protected by intellectual property laws. You retain ownership of your personal data and music preferences, 
                but grant us license to use this data to provide and improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p>
                RHYTM integrates with third-party services like Beatport. Your use of these services is subject to their 
                respective terms and conditions. We are not responsible for the availability or performance of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
              <p>
                While we strive for 100% uptime, we cannot guarantee uninterrupted service. We reserve the right to:
              </p>
              <ul className="space-y-2">
                <li>Modify or discontinue any part of the service</li>
                <li>Perform maintenance that may temporarily limit access</li>
                <li>Suspend accounts that violate these terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p>
                Sky Walker Enterprise shall not be liable for any indirect, incidental, special, or consequential damages 
                resulting from your use of RHYTM. Our total liability is limited to the amount you paid for the service 
                in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p>
                We may terminate or suspend your account at any time for violations of these terms. You may terminate 
                your account at any time through your account settings. Upon termination, your right to use the service 
                ceases immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. We will notify users of significant 
                changes via email or platform notifications. Continued use after changes constitutes acceptance of new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact:
              </p>
              <p className="font-medium">
                Sky Walker Enterprise<br />
                Email: legal@rhytm.com<br />
                Subject: Terms of Service Inquiry
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
