import React from 'react';
import './AluTRegDes2.css';
import {
  FaRecycle,
  FaLightbulb,
  FaTools,
  FaBuilding,
  FaClipboardList,
  FaCheckCircle,
  FaFileAlt,
  FaUserEdit
} from 'react-icons/fa';

function AluTRegDes2() {
  return (
    <div className="AluTRegMain">
      <div className="Alu-Container">

        <section className="ATW1-our-location-section">
      <div className="ATW1-container">
        <p className="ATW1-subtitle">OUR LOCATION</p>
        <h2 className="ATW1-main-title">FIND THE PIZZERIA NEAR YOU</h2>
        <p className="ATW1-description">
          Cursus ultricies in maecenas pulvinar ultrices integer quam amet, semper dictumst
          <br />
          sit interdum ut venenatis pellentesque.
        </p>

        <div className="ATW1-locations-grid">
          {locations.map((location, index) => (
            <div key={index} className="ATW1-location-card">
              <h3 className="ATW1-city-title">{location.city}</h3>
              <p className="ATW1-address">{location.address.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</p>
              <p className="ATW1-phone">{location.phone}</p>
              <div className="ATW1-social-icons">
                <a href={location.social.facebook} aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i> {/* Font Awesome icon */}
                </a>
                <a href={location.social.twitter} aria-label="Twitter">
                  <i className="fab fa-twitter"></i> {/* Font Awesome icon */}
                </a>
                <a href={location.social.youtube} aria-label="YouTube">
                  <i className="fab fa-youtube"></i> {/* Font Awesome icon */}
                </a>
              </div>
              <a href="#" className="ATW1-discover-link">
                DISCOVER <span className="ATW1-arrow">&rarr;</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>

        <section className="Alu-Section Alu-WhyJoin">
          <h2 className="Alu-SectionTitle">💡 Why Join Our Program?</h2>
          <ul className="Alu-WhyJoinList">
            <li className="Alu-WhyJoinItem">✅ Learn from certified professionals in the recycling industry.</li>
            <li className="Alu-WhyJoinItem">✅ Earn a Digital Certificate after completion.</li>
            <li className="Alu-WhyJoinItem">✅ Get real-world insights into aluminum recovery and reuse.</li>
            <li className="Alu-WhyJoinItem">✅ Network with other recyclers, entrepreneurs, and sustainability advocates.</li>
            <li className="Alu-WhyJoinItem">✅ Participate in live demonstrations and case studies.</li>
          </ul>
        </section>

        <section className="Alu-Section Alu-RegistrationGuidelines">
          <h2 className="Alu-SectionTitle">🧾 Registration Guidelines</h2>
          <p className="Alu-SectionContent">
            Before registering, please make sure you:
          </p>
          <ul className="Alu-GuidelineList">
            <li className="Alu-GuidelineItem">Have a valid email and contact number.</li>
            <li className="Alu-GuidelineItem">Choose your preferred training category and date.</li>
            <li className="Alu-GuidelineItem">Upload a valid ID or proof of occupation (optional).</li>
            <li className="Alu-GuidelineItem">Read the terms and conditions before submitting.</li>
          </ul>
          <p className="Alu-SectionContent">After registration, you will receive:</p>
          <ul className="Alu-GuidelineList">
            <li className="Alu-GuidelineItem">A confirmation email with your session details.</li>
            <li className="Alu-GuidelineItem">A QR code or registration ID for verification at the venue.</li>
          </ul>
        </section>  
      </div>
    </div>
  );
}

export default AluTRegDes2;
