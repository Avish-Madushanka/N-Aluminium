import React from "react";
import "./Cookie.css";
import logo from "../../assets/logo.png";

function Cookie() {
  return (
    <div className="Cookie-container">
      <header className="Cookie-header">
        <img src={logo} alt="MetaTrade Logo" className="Cookie-logo" />
        <h1>Cookie Policy</h1>
      </header>

      <section className="Cookie-content">
        <p>
          This Cookie Policy explains how MetaTrade uses cookies and similar technologies
          to recognize you when you visit our website. It explains what these technologies are
          and why we use them, as well as your rights to control our use of them.
        </p>

        <h2>What Are Cookies</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when
          you visit a website. Cookies are widely used to make websites work efficiently and
          provide reporting information.
        </p>

        <h2>Why We Use Cookies</h2>
        <ul>
          <li>To enable core website functionality</li>
          <li>To improve user experience and performance</li>
          <li>To analyze traffic and usage patterns</li>
          <li>To remember your preferences and settings</li>
        </ul>

        <h2>Types of Cookies We Use</h2>
        <ul>
          <li>Essential Cookies – Required for basic functionality</li>
          <li>Performance Cookies – Help us understand how users interact</li>
          <li>Functionality Cookies – Remember your preferences</li>
          <li>Analytics Cookies – Provide insights to improve services</li>
        </ul>

        <h2>Managing Cookies</h2>
        <p>
          You can control and manage cookies through your browser settings. You may choose to
          disable cookies, but this may affect certain features of the website.
        </p>

        <h2>Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Any changes will be posted on
          this page with an updated revision date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about our Cookie Policy, please contact us through our
          Contact Us page.
        </p>
      </section>

      <footer className="Cookie-footer">
        <p>© 2026 MetaTrade Aluminum Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Cookie;