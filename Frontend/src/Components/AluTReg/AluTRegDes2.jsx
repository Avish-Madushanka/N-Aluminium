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
                <h1 className="AReg1--title">Work Together to Collect Aluminum Scrap</h1>
                <p className="AReg1--description">
                  Aluminum waste is a growing environmental and economic concern. Every year, 
                  <strong> thousands of tons of aluminum scraps </strong> are discarded, 
                  ending up in landfills instead of being recycled. Improper disposal wastes 
                  valuable resources, increases energy consumption, and contributes to pollution. 
                  By collecting and recycling aluminum, we conserve natural resources, reduce 
                  greenhouse gas emissions, and support a circular economy.
                </p>
                <div className="AReg1--image-card">
                  <img
                    src="https://media.istockphoto.com/id/688587628/photo/aluminium-and-pvc-industry-worker.jpg?s=612x612&w=0&k=20&c=j3W5LQbi0yV0RH0-DLqGs6VeFGlV60Vm_OaiIAMPoTo="
                    alt="People cleaning up trash"
                  />
                  <div className="AReg1--years-of-experience">20+ Years of Experience</div>
                </div>
              </div>

              <div className="AReg1--right-section">
                <div className="AReg1--info-card-container">
                  <div className="AReg1--info-item">
                    <div className="AReg1--info-icon AReg1--vision">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/3412/3412082.png"
                        alt="Vision Icon"
                      />
                    </div>
                    <div className="AReg1--info-content">
                      <h3>Our Vision</h3>
                      <p>
                        Our vision is to promote efficient aluminum scrap collection and recycling, 
                        reduce environmental impact, and foster a circular economy where materials 
                        are reused instead of wasted.
                      </p>
                    </div>
                  </div>

                  <div className="AReg1--info-item">
                    <div className="AReg1--info-icon AReg1--mission">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/2006/2006789.png"
                        alt="Mission Icon"
                      />
                    </div>
                    <div className="AReg1--info-content">
                      <h3>Our Mission</h3>
                      <p>
                        Our mission is to provide efficient, reliable, and easily accessible aluminum scrap 
                        collection services, while actively educating and engaging communities on the 
                        importance and benefits of recycling, responsible waste management, and 
                        sustainable living.
                      </p>
                    </div>
                  </div>

                  <div className="AReg1--info-item">
                    <div className="AReg1--info-icon AReg1--goals">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/18370/18370444.png"
                        alt="Goals Icon"
                      />
                    </div>
                    <div className="AReg1--info-content">
                      <h3>Our Goals</h3>
                      <p>
                        Our goals are to significantly increase aluminum recycling rates, minimize 
                        environmental waste, support and empower local communities, raise awareness 
                        about sustainable practices, and promote a circular economy where materials 
                        are reused efficiently for future generations.
                      </p>
                    </div>
                  </div>
                </div>

                <a href="/ContactUs" className="AReg1--learn-more-button">
                  Contact Us
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
