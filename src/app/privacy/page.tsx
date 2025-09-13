'use client';

import { MainLayout } from '@/components/Layout/MainLayout';

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="text-gray-600 space-y-6">
            <p className="text-lg">
              At RHYTM, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our AI-powered music curation platform.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <ul className="space-y-2">
                <li><strong>Account Information:</strong> Email address, username, and profile preferences</li>
                <li><strong>Music Preferences:</strong> Liked tracks, genres, BPM preferences, and listening history</li>
                <li><strong>Usage Data:</strong> How you interact with tracks, collections, and AI recommendations</li>
                <li><strong>Technical Data:</strong> Device information, browser type, and IP address for security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <ul className="space-y-2">
                <li><strong>Personalization:</strong> To provide AI-powered music recommendations tailored to your taste</li>
                <li><strong>Service Improvement:</strong> To enhance our algorithms and user experience</li>
                <li><strong>Communication:</strong> To send important updates about your account and new features</li>
                <li><strong>Security:</strong> To protect against fraud and maintain platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
              <p>
                Your data is stored securely using industry-standard encryption. We implement multiple layers of security 
                to protect your information from unauthorized access, alteration, or disclosure. All data is stored in 
                secure, encrypted databases with regular security audits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p>
                We integrate with Beatport for music data and sync functionality. We only share the minimum necessary 
                information required for these integrations to work. We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <ul className="space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a standard format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from communications at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or your personal data, please contact us at:
              </p>
              <p className="font-medium">
                Sky Walker Enterprise<br />
                Email: privacy@rhytm.com<br />
                Subject: Privacy Policy Inquiry
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant changes 
                via email or through our platform. Your continued use of RHYTM after such changes constitutes 
                acceptance of the updated policy.
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
