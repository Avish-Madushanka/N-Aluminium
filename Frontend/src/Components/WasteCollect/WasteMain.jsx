import React, { useState } from "react";
import "./WasteMain.css";

const WasteMain = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const imageUrlSell =
    "https://westchicago.org/wp-content/uploads/2022/12/Garbage-Pickup-02.png";
  const imageUrlSell1 =
    "https://www.newswire.lk/wp-content/uploads/2023/12/US-Dollar-1.jpg";

  return (
    <div className="Co-recycling-section">
      <section className="Co-waste-management-section">
        <div className="Co-container">
          <h2 className="Co-section-title">Why Should Aluminum Scraps Be Managed?</h2>
          <p className="Co-section-description">
            Effective management of aluminum scraps is essential for both environmental protection and economic sustainability. Aluminum is a highly recyclable material that retains its original properties even after multiple recycling cycles, making it a valuable resource. However, without proper collection and management, large quantities of aluminum waste end up in landfills, contributing to pollution and resource loss. By implementing efficient aluminum scrap management systems, we can minimize raw material extraction, reduce energy consumption by up to 95% compared to primary production, and lower greenhouse gas emissions. Moreover, managing aluminum waste creates job opportunities, supports local industries, and promotes a circular economy where materials are reused and repurposed instead of discarded. Proper scrap management not only conserves natural resources but also helps build a cleaner, more sustainable future.
          </p>

          <div className="Co-features-grid">
            <div className="Co-feature-item">
              <div className="Co-feature-icon Co-electro">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/17187/17187687.png"
                  alt="Electronic Waste Icon"
                />
              </div>
              <h3>Electronic Waste</h3>
              <p>
                Handling discarded electronics responsibly is crucial to prevent harmful substances from contaminating the environment. By recycling aluminum parts found in electronic waste, we help recover valuable metals while reducing pollution and landfill impact. Encourage your family to join in these efforts and build recycling habits together.
              </p>
            </div>

            <div className="Co-feature-item">
              <div className="Co-feature-icon Co-demo">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/4285/4285861.png"
                  alt="Demolition Icon"
                />
              </div>
              <h3>Demolition Waste</h3>
              <p>
                Construction and demolition sites generate a large amount of aluminum waste from windows, doors, and frames. Proper recycling ensures that these materials are reused effectively, reducing the need for raw aluminum extraction. Take the first step toward recycling—your actions can inspire others to help too.
              </p>
            </div>

            <div className="Co-feature-item">
              <div className="Co-feature-icon Co-recovery">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/5058/5058346.png"
                  alt="Recovery Icon"
                />
              </div>
              <h3>Recovery Process</h3>
              <p>
                Our recovery process focuses on collecting, sorting, and purifying aluminum scraps to ensure they’re ready for reuse in new products. This process supports resource efficiency and sustainability. Start recycling today—when one person acts, others follow, creating a community that values the environment.
              </p>
            </div>
          </div>

          <div className="Co-content-and-accordion-grid">
            <div className="Co-image-container">
              <img
                src="https://www.steelradar.com/i/l/011/0118089_glencore-to-take-role-in-aluminium-scrap-recycling.jpeg"
                alt="Waste Management"
              />
            </div>

            <div className="Co-accordion-section">
              <div
                className={`Co-accordion-item ${
                  openAccordion === 0 ? "active" : ""
                }`}
              >
                <button
                  className="Co-accordion-header"
                  onClick={() => toggleAccordion(0)}
                >
                  How does aluminum scrap collection work?
                  <span className="Co-accordion-toggle-icon">
                    {openAccordion === 0 ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === 0 && (
                  <div className="Co-accordion-content">
                    <p>
                     Users can schedule a pickup through our system. Our team collects aluminum waste from your location, sorts it at recycling centers, and processes it for reuse in new products.
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`Co-accordion-item ${
                  openAccordion === 1 ? "active" : ""
                }`}
              >
                <button
                  className="Co-accordion-header"
                  onClick={() => toggleAccordion(1)}
                >
                  How can I earn from aluminum scraps?
                  <span className="Co-accordion-toggle-icon">
                    {openAccordion === 1 ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === 1 && (
                  <div className="Co-accordion-content">
                    <p>
                     You can earn money by selling your aluminum waste through our platform. The system provides real-time scrap value updates, so you get the best price for your collected items.
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`Co-accordion-item ${
                  openAccordion === 2 ? "active" : ""
                }`}
              >
                <button
                  className="Co-accordion-header"
                  onClick={() => toggleAccordion(2)}
                >
                  Can aluminum be recycled multiple times?
                  <span className="Co-accordion-toggle-icon">
                    {openAccordion === 2 ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === 2 && (
                  <div className="Co-accordion-content">
                    <p>
                      Yes! Aluminum is infinitely recyclable without losing its strength or quality. This makes it one of the most sustainable materials in the world.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scrap-info-section">
      <div
        className="scrap-card left-card"
        style={{
          backgroundImage: `url(${imageUrlSell})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="scrap-overlay"></div>
        <div className="scrap-content">
          <h2 className="scrap-title">Sell to Us</h2>
          <p className="scrap-text">
            Metal Source is a buyer of all scrap metal grades including aluminum,
            steel, copper, stainless, and all ferrous and nonferrous metals,
            offering competitive prices and reliable service.
          </p>
          <button className="scrap-btn">→</button>
        </div>
      </div>

      <div
        className="scrap-card right-card"
        style={{
          backgroundImage: `url(${imageUrlSell1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="scrap-overlay"></div>
        <div className="scrap-content">
          <h2 className="scrap-title">Know Your Scrap Value</h2>
          <p className="scrap-text">
            Know your scrap value in seconds. Enter the weight, get an instant
            estimate, and see how much cash you’ll earn for recycling your
            aluminum. It’s fast, accurate, and helps the planet too!
          </p>
          <button className="scrap-btn">→</button>
        </div>
      </div>
    </section>

    </div>
  );
};

export default WasteMain;
