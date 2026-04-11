import React from "react";
import "./Terms.css";
import logo from "../../assets/logo.png";

function Terms() {
  return (
    <div className="Terms-container">
      <header className="Terms-header">
        <img src={logo} alt="ALUX Logo" className="Terms-logo" />
        <h1>Terms & Conditions</h1>
      </header>

      <section className="Terms-content">
        <p>
          Welcome to ALUX. By accessing and using our platform, you agree to comply
          with and be bound by the following terms and conditions. Please read them carefully
          before using our services.
        </p>

        <h2>Use of Our Services</h2>
        <p>
          You agree to use our platform only for lawful purposes. You must not misuse the
          system, attempt unauthorized access, or engage in any activity that disrupts
          the functionality of the platform.
        </p>

        <h2>User Accounts</h2>
        <p>
          To access certain features, you may need to create an account. You are responsible
          for maintaining the confidentiality of your login credentials and all activities
          under your account.
        </p>

        <h2>Service Availability</h2>
        <p>
          We aim to provide reliable services, including aluminum scrap collection,
          fabrication, and marketplace features. However, we do not guarantee uninterrupted
          availability and may modify or suspend services when necessary.
        </p>

        <h2>Payments & Pricing</h2>
        <p>
          All pricing for scrap materials and services is based on market conditions.
          We strive to ensure transparency, but prices may change without prior notice.
        </p>

        <h2>User Responsibilities</h2>
        <ul>
          <li>Provide accurate information when using the platform</li>
          <li>Ensure materials are ready for collection</li>
          <li>Follow all safety and legal guidelines</li>
        </ul>

        <h2>Limitation of Liability</h2>
        <p>
          ALUX is not liable for any indirect or consequential damages resulting from
          the use or inability to use our services.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We may update these Terms & Conditions at any time. Continued use of the platform
          means you accept any updated terms.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions regarding these Terms & Conditions, please contact us
          through our Contact Us page.
        </p>
      </section>

      <footer className="Terms-footer">
        <p>© 2026 ALUX Aluminum Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Terms;