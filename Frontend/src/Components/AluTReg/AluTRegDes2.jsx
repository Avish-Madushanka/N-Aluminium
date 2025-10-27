import React from 'react';
import './AluTRegDes2.css';

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

        <div className="AReg1--main-container">
          <div className="AReg1--ocean-container">
            <div className="AReg1--main-content">
              <div className="AReg1--left-section">
                <h1 className="AReg1--title">Register Details</h1>
                <p className="AReg1--description">
                  Fill out the form below to join the Aluminum Training Program. Our team will review your registration and confirm your participation through email within <strong>24–48 hours.</strong>  
                </p>
                <div className="AReg1--image-card">
                  <img
                    src="https://aluminiumacademy.com/wp-content/uploads/2022/07/DSC_1435R.jpg"
                  />
                  <div className="AReg1--years-of-experience">6-Month Training Program</div>
                </div>
              </div>

              <div className="AReg1--right-section">
                <div className="AReg1--info-card-container">
                  <div className="AReg1--info-item">
                    <div className="AReg1--info-icon AReg1--vision">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/4301/4301554.png"
                        alt="submit details"
                      />
                    </div>
                    <div className="AReg1--info-content">
                    <h3>Before registering, please make sure you:</h3>
                    <ul>
                      <li>Have a valid email address and active contact number.</li>
                      <li>Select your preferred training category and starting date.</li>
                      <li>Upload a valid ID or proof of occupation (optional).</li>
                      <li>Read and agree to the terms and conditions before submitting your registration.</li>
                    </ul>
                  </div>
                  </div>

                  <div className="AReg1--info-item">
                    <div className="AReg1--info-icon AReg1--mission">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/624/624955.png"
                        alt="recieve details"
                      />
                    </div>
                    <div className="AReg1--info-content">
                    <h3>After registration, you will receive:</h3>
                    <ul>
                      <li>A confirmation email with your session details.</li>
                      <li>A QR code or registration ID for verification at the venue.</li>
                    </ul>
                  </div>
                  </div>
                </div>

                <a href="/AluTRegForm" className="AReg1--learn-more-button">
                  Register Now
                </a>
              </div>
            </div>
          </div>
        </div>


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
      </div>
    </div>
  );
}

export default AluTRegDes2;
