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
                    alt="Training program"
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
                        alt="receive details"
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
      </div>
      <div className="AT3-stats-section">
        <div className="AT3-stats-container">
          <div className="AT3-stat-item">
            <img src="https://cdn-icons-png.flaticon.com/128/18718/18718281.png" className="AT3-stat-icon" />
            <div className="AT3-stat-number">45<sup>+</sup></div>
            <div className="AT3-stat-label">Practical Sessions</div>
          </div>

          <div className="AT3-stat-item">
            <img src="https://cdn-icons-png.flaticon.com/128/1018/1018662.png" className="AT3-stat-icon" />
            <div className="AT3-stat-number">150<sup>+</sup></div>
            <div className="AT3-stat-label">Trained Students</div>
          </div>

          <div className="AT3-stat-item">
            <img src="https://cdn-icons-png.flaticon.com/128/8644/8644515.png" className="AT3-stat-icon" />
            <div className="AT3-stat-number">85<sup>+</sup></div>
            <div className="AT3-stat-label">Successful Projects</div>
          </div>

          <div className="AT3-stat-item">
            <img src="https://cdn-icons-png.flaticon.com/128/4559/4559359.png" className="AT3-stat-icon" />
            <div className="AT3-stat-number">79<sup>%</sup></div>
            <div className="AT3-stat-label">Job Placement Rate</div>
          </div>
        </div>
      </div>

      <div className="AT5-offer-section">
      <div className="AT5-header-container">
        <h2 className="AT5-main-heading">Why Join Our Aluminum Training Program?</h2>
      </div>
      
      <div className="AT5-content-layout"> 
        <div className="AT5-programs-column AT5-column-left">
          <div className="AT5-program-item AT5-align-right">
            <div className="AT5-program-icon-wrapper">
              <img 
                src="https://cdn-icons-png.flaticon.com/128/5190/5190582.png" 
                alt="Industry Experts Icon" 
                className="AT5-program-icon-img"
              />
            </div>
            <h3 className="AT5-program-title">Learn from Industry Experts</h3>
            <p className="AT5-program-text">
              Gain hands-on knowledge directly from certified aluminum fabricators, recycling specialists, and experienced trainers in the field.
            </p>
          </div>

          <div className="AT5-program-item AT5-align-right">
            <div className="AT5-program-icon-wrapper">
              <img 
                src="https://cdn-icons-png.flaticon.com/128/8982/8982004.png" 
                alt="Career Opportunities Icon" 
                className="AT5-program-icon-img"
              />
            </div>
            <h3 className="AT5-program-title">Expand Your Career Opportunities</h3>
            <p className="AT5-program-text">
              Network with construction professionals, recycling entrepreneurs, and sustainability leaders to build your future career in aluminum manufacturing and eco-friendly practices.
            </p>
          </div>
        </div>

        <div className="AT5-main-image-wrapper">
          <img
            src="https://manpower.ae/wp-content/uploads/2023/03/aluminium.png"
            alt="aluminum worker"
            className="AT5-main-image"
          />
        </div>

        <div className="AT5-programs-column AT5-column-right">
          <div className="AT5-program-item AT5-align-left">
            <div className="AT5-program-icon-wrapper">
              <img 
                src="https://cdn-icons-png.flaticon.com/128/9953/9953680.png" 
                alt="Practical Skills Icon" 
                className="AT5-program-icon-img"
              />
            </div>
            <h3 className="AT5-program-title">Practical Aluminum Skills</h3>
            <p className="AT5-program-text">
              Develop real-world skills in aluminum cutting, shaping, window and door frame fabrication, and recycling applications used in modern industries.
            </p>
          </div>

          <div className="AT5-program-item AT5-align-left">
            <div className="AT5-program-icon-wrapper">
              <img 
                src="https://cdn-icons-png.flaticon.com/128/6528/6528841.png" 
                alt="Live Demonstrations Icon" 
                className="AT5-program-icon-img"
              />
            </div>
            <h3 className="AT5-program-title">Experience Live Demonstrations</h3>
            <p className="AT5-program-text">
              Participate in interactive workshops, safety training, and project-based learning that simulate real industrial environments.
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default AluTRegDes2;
