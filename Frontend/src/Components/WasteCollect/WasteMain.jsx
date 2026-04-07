import React, { useState } from "react";
import "./WasteMain.css";
import { Link } from "react-router-dom";

const WasteMain = () => {
  const categories = [
    { name: 'Aluminum Scraps', imgSrc: 'https://media.istockphoto.com/id/645897288/photo/abtract-of-metal-scrap.jpg?s=612x612&w=0&k=20&c=LVynqe8WK5q7m1YL2ldXcy44qjRrY3RyD-solAxi-Lc=' },
    { name: 'Aluminum Wires', imgSrc: 'https://africangoldcompanygroup.com/wp-content/uploads/2023/11/557513186601830.jpg' },
    { name: 'Aluminum Cans', imgSrc: 'https://speed-tradespzoo.com/wp-content/uploads/2022/11/F_20150217155954zJ5cEe.jpg' },
    { name: 'Aluminum Dust', imgSrc: 'https://previews.123rf.com/images/faruki2017/faruki20171702/faruki2017170200190/71630074-iron-dust-aluminum-dust.jpg' },  
    { name: 'Cradding Boards', imgSrc: 'https://i.ytimg.com/vi/S7O8WJ2BFWY/maxresdefault.jpg' },
    { name: 'Glass Scraps', imgSrc: 'https://agecko.com/wp-content/uploads/2025/01/types-of-glass-recycling-window-panes.webp' },
    { name: 'Aluminum Sheets', imgSrc: 'https://5.imimg.com/data5/SELLER/Default/2024/11/466263246/RB/WO/HL/155423973/coated-aluminum-scrap.jpg' },
  ];
      
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

    const services = [
    {
      category: "Scheduling",
      title: "Check Scraps Pickup Dates",
      desc: "Metal Source is a buyer of all scrap metal grades including aluminum, steel, copper, stainless, and all ferrous and nonferrous metals.",
      image: "https://www.actionmetalsrecyclers.com/wp-content/uploads/2023/03/shutterstock_1976224004-768x513.jpg",
      btnText: "Schedule Pickup",
      btnIcon1: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    },
    {
      category: "Location Services",
      title: "Find Collection Centers Near You",
      desc: "Quickly find nearby aluminum scrap collection centers and partner shops through our interactive map.",
      image: "https://img.freepik.com/premium-photo/map-with-marked-location-illustrating-geographic-positioning-site-identification_1211661-5650.jpg",
      btnText: "Find Location",
      btnIcon2: "M9.5 2A1.5 1.5 0 0 0 8 3.5V6a2 2 0 0 1-2 2H3.5A1.5 1.5 0 0 0 2 9.5v5A1.5 1.5 0 0 0 3.5 16H6a2 2 0 0 1 2 2v2.5A1.5 1.5 0 0 0 9.5 22h5a1.5 1.5 0 0 0 1.5-1.5V18a2 2 0 0 1 2-2h2.5a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 20.5 8H18a2 2 0 0 1-2-2V3.5A1.5 1.5 0 0 0 14.5 2h-5z"
    },
    {
      category: "Real-Time Pricing",
      title: "Check Scrap Prices",
      desc: "View real-time aluminum scrap prices based on current market trends, material type, and quality. Easily estimate your earnings, compare rates, and make informed decisions before scheduling a pickup or selling your materials.",
      image: "https://taylorsjunkyard.com/wp-content/uploads/2025/11/maximizing-financial-returns-from-scrap-metal-1024x576.jpg",
      btnText: "Check Prices",
      btnIcon3: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
    }
  ];

  const processSteps = [
    {
      id: 1,
      title: "Login / Register",
      text: "Create a secure account or log in to access our aluminum scrap collection services. This allows you to manage requests, track pickups, receive updates, and use all platform features efficiently for a smooth and personalized experience.",
      iconUrl: "https://cdn-icons-png.flaticon.com/128/15688/15688116.png"
    },
    {
      id: 2,
      title: "Check Available Dates",
      text: "Browse available pickup dates and time slots based on your location. Our smart system helps you select the most convenient schedule, ensuring flexibility and better planning for both households and businesses needing aluminum scrap collection services.",
      iconUrl: "https://cdn-icons-png.flaticon.com/128/10212/10212848.png"
    },
    {
      id: 3,
      title: "Request Pickup",
      text: "Submit your aluminum scrap collection request by selecting your preferred date, time, and material type. Provide necessary details to help our team prepare, ensuring a fast, efficient, and well-organized pickup process tailored to your needs.",
      iconUrl: "https://cdn-icons-png.flaticon.com/128/15330/15330605.png"
    },
    {
      id: 4,
      title: "Collection & Processing",
      text: "Our professional team arrives at your location to collect aluminum scrap safely and on time. The materials are then sorted, evaluated, and processed for recycling or fabrication, transforming waste into valuable resources while supporting sustainable environmental practices.",
      iconUrl: "https://cdn-icons-png.flaticon.com/128/9982/9982382.png"
    }
  ];

  return (
    <div className="Co-recycling-section">
      <section className="Co-waste-management-section">
        <div className="WS2-container">
          <div className="WS2-left-section">
            <div className="WS2-image-container">
              <img src="https://www.cliftonmetals.com/wp-content/uploads/2024/07/A-Guide-to-Choosing-a-Responsible-Scrap-Metal-Recycler-Clifton-Metals-Blog-632x764.jpg" className="WS2-wall-image" alt="Aluminum recycling" />
              <div className="WS2-image-overlay"></div>
            </div>
          </div>
          <div className="WS2-right-section">
            <span className="WS2-badge">Why Recycle?</span>
            <h1 className="WS2-main-heading">Why Should Aluminum <br /> Scraps Be Managed?</h1>
            <p className="WS2-description">
              Effective aluminum scrap management is crucial for environmental protection and economic growth. Since aluminum can be recycled repeatedly without losing quality, proper collection prevents valuable material from ending up in landfills. Recycling saves up to 95% of the energy used in primary production and significantly reduces emissions.
            </p>

            <div className="Co-accordion-section">
              <div className={`Co-accordion-item ${openAccordion === 0 ? "active" : ""}`}>
                <button className="Co-accordion-header" onClick={() => toggleAccordion(0)}>
                  How does aluminum scrap collection work?
                  <span className="Co-accordion-toggle-icon">{openAccordion === 0 ? "−" : "+"}</span>
                </button>
                {openAccordion === 0 && (
                  <div className="Co-accordion-content">
                    <p>Users can schedule a pickup through our system. Our team collects aluminum waste from your location, sorts it at recycling centers, and processes it for reuse in new products.</p>
                  </div>
                )}
              </div>

              <div className={`Co-accordion-item ${openAccordion === 1 ? "active" : ""}`}>
                <button className="Co-accordion-header" onClick={() => toggleAccordion(1)}>
                  How can I earn from aluminum scraps?
                  <span className="Co-accordion-toggle-icon">{openAccordion === 1 ? "−" : "+"}</span>
                </button>
                {openAccordion === 1 && (
                  <div className="Co-accordion-content">
                    <p>You can earn money by selling your aluminum waste through our platform. The system provides real-time scrap value updates, so you get the best price for your collected items.</p>
                  </div>
                )}
              </div>

              <div className={`Co-accordion-item ${openAccordion === 2 ? "active" : ""}`}>
                <button className="Co-accordion-header" onClick={() => toggleAccordion(2)}>
                  Environmental benefits of recycling aluminum?
                  <span className="Co-accordion-toggle-icon">{openAccordion === 2 ? "−" : "+"}</span>
                </button>
                {openAccordion === 2 && (
                  <div className="Co-accordion-content">
                    <p>Recycling aluminum saves up to 95% of the energy required to produce new aluminum from raw materials. It also reduces greenhouse gas emissions and conserves natural resources.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="WS5-marquee-section">
          <div className="WS5-marquee-container">
            <div className="WS5-marquee-content">
              {[1, 2].map((loop) => (
                <React.Fragment key={loop}>
                  <span className="WS5-marquee-text">
                    <img src="https://cdn-icons-png.flaticon.com/128/3299/3299935.png" alt="icon" />
                    RECYCLE ALUMINUM - SAVE ENERGY UP TO 95%
                  </span>
                  <span className="WS5-marquee-text">
                    <img src="https://cdn-icons-png.flaticon.com/128/3135/3135706.png" alt="icon" />
                    EARN FROM YOUR SCRAP - BEST PRICES GUARANTEED
                  </span>
                  <span className="WS5-marquee-text">
                    <img src="https://cdn-icons-png.flaticon.com/128/2939/2939696.png" alt="icon" />
                    SUSTAINABLE FUTURE - CIRCULAR ECONOMY
                  </span>
                  <span className="WS5-marquee-text">
                    <img src="https://cdn-icons-png.flaticon.com/128/9279/9279555.png" alt="icon" />
                    FREE PICKUP AVAILABLE - SCHEDULE NOW
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      <section className="WS8-wrapper">
          <div className="WS8-container">
            <div className="WS8-header">
              <h2>Recycling Services</h2>
              <p>Quickly schedule your scrap pickup, find the nearest collection center, and check real-time aluminum prices. Everything you need to recycle smarter and earn more — all in one place. Join the green movement and turn waste into value with our easy-to-use recycling tools.</p>
            </div>
            <div className="WS8-grid">
              {services.map((item, index) => (
                <div className="WS8-card" key={index}>
                  <div className="WS8-image-box">
                    <img src={item.image} alt="service" className="WS8-img" />
                  </div>
                  <div className="WS8-content-box">
                    <span className="WS8-category">{item.category}</span>
                    <h3 className="WS8-title">{item.title}</h3>
                    <div className="WS8-reveal-box">
                      <p className="WS8-description">{item.desc}</p>
                      <a 
                        href={index === 0 ? "/UserCalendar" : index === 1 ? "/LocationMap" : "/Calculate"}
                        className={`WS8-unique-btn WS8-btn-type-${index % 3}`}
                      >
                        <span className="WS8-btn-text">{item.btnText}</span>
                        <span className="WS8-btn-circle">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="WS6-process-section">
          <div className="WS6-header">
            <div className="WS6-left">
              <span className="WS6-badge">Recycle Process</span>
              <h2 className="WS6-title">How Our Aluminum <br />Collection System Works</h2>
            </div>
          </div>

          <div className="WS6-steps-grid">
            {processSteps.map((step, idx) => (
              <div key={step.id} className="WS6-step-card" data-step={String(idx + 1).padStart(2, '0')}>
                <div className="WS6-icon-circle">
                  <div className="WS6-svg-container">
                    <img src={step.iconUrl} alt={step.title} className="WS6-icon-image" />
                  </div>
                </div>
                <h4 className="WS6-step-title">{step.title}</h4>
                <p className="WS6-step-text">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="WS3-category-section">
          <div className="WS3-header">
            <span className="WS3-subtitle">Materials We Accept</span>
            <h2 className="WS3-title">What We Collect</h2>
            <p className="WS3-description">We recycle a wide range of aluminum and metal materials, including cans, sheets, frames, and industrial scraps, ensuring they are properly sorted, processed, and reused. Our system reduces waste, saves energy, and transforms discarded materials into valuable resources, supporting a sustainable circular economy.</p>
          </div>
          <div className="WS3-category-container">
            {categories.map((category, index) => (
              <div key={index} className="WS3-category-item">
                <div className="WS3-category-image-wrapper">
                  <img src={category.imgSrc} alt={category.name} className="WS3-category-image" />
                  <div className="WS3-category-overlay">
                    <span className="WS3-recycle-icon">♻️</span>
                  </div>
                </div>
                <p className="WS3-category-name">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default WasteMain;