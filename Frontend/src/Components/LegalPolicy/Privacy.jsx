import React from "react";
import "./Privacy.css";
import logo from "../../assets/logo.png";

function Privacy() {
  return (
    <div className="Privacy-container">
      <header className="Privacy-header">
        <img src={logo} alt="MetaTrade Logo" className="Privacy-logo" />
        <h1>Privacy Policy</h1>
      </header>

      <section className="Privacy-content">
        <p>
          At MetaTrade, we are committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, and safeguard your information when you use our platform.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address, phone number,
          and location when you register or use our services. We also collect usage data to
          improve platform performance.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To provide and manage our services</li>
          <li>To process collection requests and transactions</li>
          <li>To improve user experience and platform performance</li>
          <li>To send updates, notifications, and service-related messages</li>
        </ul>

        <h2>Data Protection</h2>
        <p>
          We implement appropriate security measures to protect your data from unauthorized
          access, alteration, or disclosure. However, no system is completely secure, and we
          cannot guarantee absolute security.
        </p>

        <h2>Sharing Your Information</h2>
        <p>
          We do not sell your personal data. Information may be shared with trusted partners
          only when necessary to deliver services such as scrap collection or marketplace operations.
        </p>

        <h2>Cookies & Tracking</h2>
        <p>
          Our platform uses cookies to enhance user experience and analyze website traffic.
          You can manage cookie preferences through your browser settings.
        </p>

        <h2>Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information.
          You may also choose to opt out of certain communications at any time.
        </p>

        <h2>Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Any changes will be posted on this page.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through our
          Contact Us page.
        </p>
      </section>

      <footer className="Privacy-footer">
        <p>© 2026 MetaTrade Aluminum Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Privacy;