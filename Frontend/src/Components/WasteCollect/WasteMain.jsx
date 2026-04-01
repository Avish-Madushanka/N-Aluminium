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

  const processSteps = [
    {
      id: 1,
      title: "Garbage Pickup",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
          <path d="M14 9h4l4 4v5h-3" />
          <circle cx="7.5" cy="18.5" r="2.5" />
          <circle cx="17.5" cy="18.5" r="2.5" />
          <path d="M7 9h3M7 12h3" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Sorting Waste",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Washing Waste",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-8-4-8s-4 4.7-4 8c0 2.2 1.8 4 4 4z" />
          <path d="M12 7h6M12 11h4M12 15h2" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Recycle Process",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 2h10l3 3v14l-3 3H7l-3-3V5z" />
          <path d="M12 8v8M8 12l4 4 4-4" />
        </svg>
      )
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

        <div className="WS3-category-section">
          <div className="WS3-header">
            <span className="WS3-subtitle">Materials We Accept</span>
            <h2 className="WS3-title">What We Collect</h2>
            <p className="WS3-description">We recycle a wide range of aluminum and metal materials to support a circular economy.</p>
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

      <section className="scrap-info-section">
        <div className="WS4-container">
          <div className="WS4-section WS4-m">
            <div className="WS4-content">
              <div className="WS4-icon-wrapper">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M21 21v-5h-5" />
                </svg>
              </div>
              <h2 className="WS4-title">
                <span className="WS4-highlight-blue">Check Scraps</span> Pickup Dates
              </h2>
              <p className="WS4-subtitle">
                Metal Source is a buyer of all scrap metal grades including aluminum, steel, copper, stainless, and all ferrous and nonferrous metals.
              </p>
              <Link to="/UserCalendar" className="WS4-button WS4-button-2">
                Schedule Pickup
                <span className="WS4-button-arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="WS4-section WS4-w">
            <div className="WS4-content">
              <div className="WS4-icon-wrapper">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h2 className="WS4-title">
                Collection Centers <br />
                <span className="WS4-highlight-pink">Near You</span>
              </h2>
              <p className="WS4-subtitle">
                Quickly find nearby aluminum scrap collection centers and partner shops through our interactive map.
              </p>
              <Link to="/LocationMap" className="WS4-button WS4-button-2">
                Find Location
                <span className="WS4-button-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="WS6-process-section">
        <div className="WS6-container">
          <div className="WS6-header">
            <div className="WS6-left">
              <span className="WS6-badge">Recycle Process</span>
              <h2 className="WS6-title">How We Turn Waste Into <br /> Sustainability Solution</h2>
            </div>
          </div>

          <div className="WS6-steps-grid">
            <div className="WS6-line"></div>
            {processSteps.map((step) => (
              <div key={step.id} className="WS6-step-card">
                <div className="WS6-icon-circle">
                  <div className="WS6-svg-container">{step.icon}</div>
                </div>
                <h4 className="WS6-step-title">{step.title}</h4>
                <p className="WS6-step-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WasteMain;