import React from 'react';
import './AluTRegDes2.css';
import { FaCalendarAlt, FaLaptopHouse, FaClock, FaUserGraduate } from 'react-icons/fa';

function AluTRegDes2() {
  const scheduleDetails = [
    {
      title: 'Frequency',
      description: 'Weekly and Monthly sessions available.',
      icon: 'https://cdn-icons-png.flaticon.com/128/1470/1470028.png',
    },
    {
      title: 'Mode',
      description: 'Online and On-Site (select based on preference).',
      icon: 'https://cdn-icons-png.flaticon.com/128/11133/11133669.png',
    },
    {
      title: 'Duration',
      description: 'Each training session lasts 2–3 hours.',
      icon: 'https://cdn-icons-png.flaticon.com/128/1584/1584808.png',
    },
    {
      title: 'Trainers',
      description: 'Certified recycling experts and environmental professionals.',
      icon: 'https://cdn-icons-png.flaticon.com/128/4947/4947544.png',
    },
  ];

  return (
    <div className="AluTRegMain">
      <div className="Alu-Container">
        <section className="ATW1-section">
          <p className="ATW1-subtitle">TRAINING SCHEDULE & DURATION</p>
          <h2 className="ATW1-main-title">LEARN WITH FLEXIBILITY AND EXPERT GUIDANCE</h2>
          <p className="ATW1-description">
            Our aluminum recycling workshops are designed to suit all learners — 
            from beginners to industry professionals. Choose your preferred schedule and training mode to grow your skills sustainably.
          </p>

          <div className="ATW1-locations-grid">
            {scheduleDetails.map((item, index) => (
              <div key={index} className="ATW1-location-card">
                <img src={item.icon} alt={`${item.title} icon`} className="ATW1-icon" />
                <h3 className="ATW1-city-title">{item.title}</h3>
                <p className="ATW1-address">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="Alu-Section Alu-WhyJoin">
          <h2 className="Alu-SectionTitle">💡 Why Join Our Training Program?</h2>
          <ul className="Alu-WhyJoinList">
            <li className="Alu-WhyJoinItem">✅ Learn from certified aluminum recycling experts.</li>
            <li className="Alu-WhyJoinItem">✅ Earn an official completion certificate.</li>
            <li className="Alu-WhyJoinItem">✅ Get hands-on training in real recycling centers.</li>
            <li className="Alu-WhyJoinItem">✅ Network with green innovators and industry leaders.</li>
            <li className="Alu-WhyJoinItem">✅ Participate in live demonstrations and sustainability workshops.</li>
          </ul>
        </section>

        <section className="Alu-Section Alu-RegistrationGuidelines">
          <h2 className="Alu-SectionTitle">🧾 Registration Guidelines</h2>
          <p className="Alu-SectionContent">Before registering, please make sure you:</p>
          <ul className="Alu-GuidelineList">
            <li className="Alu-GuidelineItem">Have a valid email and contact number.</li>
            <li className="Alu-GuidelineItem">Select your training category and preferred date.</li>
            <li className="Alu-GuidelineItem">Upload a valid ID or proof of occupation (optional).</li>
            <li className="Alu-GuidelineItem">Read and agree to the terms and conditions.</li>
          </ul>
          <p className="Alu-SectionContent">After registration, you will receive:</p>
          <ul className="Alu-GuidelineList">
            <li className="Alu-GuidelineItem">A confirmation email with session details.</li>
            <li className="Alu-GuidelineItem">A QR code or registration ID for verification.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AluTRegDes2;
