import React, { useState } from "react";
import "./WasteMain.css";

const WasteMain = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const imageUrlSell =
    "https://ewasa.org/wp-content/uploads/2022/12/post-scrap-metal-export-prohibition-1024x576.png";
  const imageUrlValue =
    "https://bsmedia.business-standard.com/_media/bs/img/article/2016-12/12/full/1481562212-9804.jpg?im=FeatureCrop,size=(826,465)";

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
                  src="https://via.placeholder.com/30x30?text=E"
                  alt="Electronic Waste Icon"
                />
              </div>
              <h3>Electronic waste</h3>
              <p>
                First, you stand for recycling than your family also help. Be
                aware of your family.
              </p>
            </div>

            <div className="Co-feature-item">
              <div className="Co-feature-icon Co-demo">
                <img
                  src="https://via.placeholder.com/30x30?text=D"
                  alt="Demolition Icon"
                />
              </div>
              <h3>Demolition</h3>
              <p>
                First, you stand for recycling than your family also help. Be
                aware of your family.
              </p>
            </div>

            <div className="Co-feature-item">
              <div className="Co-feature-icon Co-recovery">
                <img
                  src="https://via.placeholder.com/30x30?text=R"
                  alt="Recovery Icon"
                />
              </div>
              <h3>Recovery</h3>
              <p>
                First, you stand for recycling than your family also help. Be
                aware of your family.
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

      <div className="Co-waste-section">
        <div className="Co-waste-card-container">
          <div className="Co-waste-card">
            <img
              src={imageUrlSell}
              alt="Sell to Us"
              className="Co-waste-card-image"
            />
            <div className="Co-waste-card-content">
              <h3 className="Co-waste-card-title">Sell to Us</h3>
              <p className="Co-waste-card-description">
                Metal Source is a buyer of all scrap metal grades including
                aluminum, steel, copper, stainless, and all ferrous and
                nonferrous metals, offering competitive prices and reliable
                service.
              </p>
              <a href="/UserCalendar" className="Co-waste-learn-more">
                →
              </a>
            </div>
          </div>

          <div className="Co-waste-card">
            <img
              src={imageUrlValue}
              alt="Scrap Value"
              className="Co-waste-card-image"
            />
            <div className="Co-waste-card-content">
              <h3 className="Co-waste-card-title">Know Your Scrap Value</h3>
              <p className="Co-waste-card-description">
                Know your scrap value in seconds. Enter the weight, get an
                instant estimate, and see how much cash you’ll earn for
                recycling your aluminum. It’s fast, accurate, and helps the
                planet too!
              </p>
              <a href="/Calculate" className="Co-waste-learn-more">
                →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteMain;
